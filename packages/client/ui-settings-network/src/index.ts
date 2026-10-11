/**
 * Network settings page, node half. The empty apply exists so the plugin
 * appears in the host cordis.yml / Loader; the browser half owns the page
 * through exports["./client"]. The `http-proxy-settings` namespace the page
 * edits is registered by `@deepseek-ai/dsh-http-proxy-settings`.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
