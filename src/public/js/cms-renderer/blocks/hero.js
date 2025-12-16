/**
 * Project   : TACVB31
 * Block     : HERO
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : RENDERER
 */

export function renderHero(props) {
  const h = document.createElement("h1");
  h.textContent = props.headline || "";
  return h;
}
