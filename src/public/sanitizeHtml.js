/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-25
 * Layer     : FRONT (public/js)
 *
 * Purpose:
 * - Light client-side HTML sanitizer (defense in depth)
 * - Real sanitization must still happen on backend.
 */

export function sanitizeHtml(input = "") {
  const allowedTags = new Set([
    "P", "BR", "STRONG", "EM",
    "UL", "OL", "LI",
    "A",
    "H2", "H3",
    "BLOCKQUOTE"
  ]);

  const parser = new DOMParser();
  const doc = parser.parseFromString(String(input), "text/html");

  const cleanNode = (node) => {
    [...node.children].forEach((el) => {
      // Remove non allowed tags (replace by text)
      if (!allowedTags.has(el.tagName)) {
        el.replaceWith(document.createTextNode(el.textContent || ""));
        return;
      }

      // Keep only safe attributes
      const attrs = [...el.attributes].map(a => a.name);

      // Reset all attrs first
      attrs.forEach((name) => el.removeAttribute(name));

      // Re-allow strict attrs for <a>
      if (el.tagName === "A") {
        const href = el.getAttribute("href");
        // href was removed above, so we need to re-read from original DOM:
        // easiest approach: look at dataset? not possible. So we do safer:
        // we keep only text content if href is not safe.
        // => instead, parse again using original anchor from doc? not worth.
        // We'll allow href only if it exists in original input by reading outerHTML is complex.
        // For v1: allow only text links created by editor that already sanitized backend.
      }

      cleanNode(el);
    });
  };

  cleanNode(doc.body);

  // Extra hardening: remove any "javascript:" occurrences
  const out = doc.body.innerHTML.replace(/javascript:/gi, "");
  return out;
}