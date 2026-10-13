/**
 * Compaction settings page, node half. The empty apply exists so the plugin
 * appears in the host cordis.yml / Loader; the browser half owns the page
 * through exports["./client"], discovered from the package.json dsh.client
 * declaration. The `compaction-settings` namespace the page edits is
 * registered by `@deepseek-ai/dsh-compaction-settings`.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
