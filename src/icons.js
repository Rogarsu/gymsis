// ─────────────────────────────────────────────────────────────
// icons.js — Lucide icon helper for use in template literals
// ─────────────────────────────────────────────────────────────

/** Returns an <i data-lucide="name"> string for inline HTML */
export const ic = (name, cls = '') =>
  `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`

/** Call after any innerHTML render to activate Lucide icons */
export function refreshIcons() {
  if (window.lucide) window.lucide.createIcons()
}
