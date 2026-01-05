/**
 * Project : TACVB31
 * Module  : CMS
 * Author  : Freezer64
 * Created : 2025-12-23
 * File    : sanitizeRichText.js
 * Role    : Backend sanitization for RICHTEXT v1
 */
import sanitizeHtml from "sanitize-html";

export function sanitizeRichText(html = "") {
  return sanitizeHtml(String(html), {
    allowedTags: ["p", "br", "strong", "em", "u", "ul", "ol", "li", "a", "h2", "h3", "blockquote"],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    // refuse data: / javascript: by default through allowedSchemes
    transformTags: {
      a: (tagName, attribs) => {
        const out = { ...attribs };
        // force safe rel for target blank
        if (out.target === "_blank") {
          out.rel = "noopener noreferrer";
        }
        return { tagName, attribs: out };
      }
    },
    // drop any style / on* attrs implicitly (not allowed)
  });
}
