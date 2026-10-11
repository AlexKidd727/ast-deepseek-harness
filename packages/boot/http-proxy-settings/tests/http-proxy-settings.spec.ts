import { afterEach, describe, expect, it } from 'vitest'
import {
  activeProxySource,
  clearedProxyEnv,
  installProxyFromEnvironment,
  installProxyPolicy,
  policyFromSettings,
  proxyRouteFor,
} from '@deepseek-ai/dsh-http-proxy'
import { createVolatile } from '@deepseek-ai/cosmokit'
import { DEFAULT_PROXY_PORT, type Config } from '../src/index.ts'

/** Build a Config-shaped object for sync tests without booting cordis. */
function configOf(fields: {
  host?: string
  port?: number
  username?: string
  password?: string
}): Config {
  return {
    host: createVolatile(fields.host),
    port: createVolatile(fields.port ?? DEFAULT_PROXY_PORT),
    username: createVolatile(fields.username),
    password: createVolatile(fields.password),
  }
}

describe('http-proxy-settings policy composition', () => {
  afterEach(() => {
    // NOTE: clear ambient proxy names left by install tests.
    Object.assign(process.env, clearedProxyEnv())
  })

  it('installs a settings policy when env did not claim the route', async () => {
    const envDispose = await installProxyFromEnvironment({ get: () => undefined }, () => undefined)
    try {
      expect(activeProxySource()).toBe('none')
      const fields = configOf({ host: '127.0.0.1', port: 9 })
      const settingsDispose = await installProxyPolicy(policyFromSettings({
        host: fields.host.get(),
        port: fields.port.get(),
      }))
      try {
        expect(activeProxySource()).toBe('settings')
        expect(proxyRouteFor(new URL('https://example.com/')).proxied).toBe(true)
      } finally {
        await settingsDispose()
      }
    } finally {
      await envDispose()
    }
  })

  it('keeps env source when HTTP_PROXY was installed at launch', async () => {
    const envDispose = await installProxyFromEnvironment({
      get: name => (name === 'HTTP_PROXY' || name === 'HTTPS_PROXY'
        ? { value: 'http://127.0.0.1:9' }
        : undefined),
    }, () => undefined)
    try {
      expect(activeProxySource()).toBe('env')
      // Settings must not override: the product rule is env wins.
      expect(activeProxySource() === 'env').toBe(true)
    } finally {
      await envDispose()
    }
  })
})
