/**
 * Project   : TACVB31
 * Module    : CMS Renderer
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : RENDERER
 */

export function renderPageInto(root, pageDto) {
  const mount = document.querySelector(root);
  mount.innerHTML = JSON.stringify(pageDto, null, 2);
}
