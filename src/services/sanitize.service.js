import sanitizeHtml from "sanitize-html";

export function sanitizeRichTextHtml(input) {
  return sanitizeHtml(input ?? "", {
    allowedTags: [
      "p","br","strong","em","u","s",
      "h2","h3","h4",
      "ul","ol","li",
      "blockquote",
      "a"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"]
    },
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || "#";
        const isExternal = /^https?:\/\//i.test(href);
        return {
          tagName: "a",
          attribs: {
            href,
            target: attribs.target || (isExternal ? "_blank" : "_self"),
            rel: attribs.rel || (isExternal ? "noopener noreferrer" : undefined)
          }
        };
      }
    },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard"
  });
}
