/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : DOMAIN
 */

export const uiCardDataSchemaV1 = {
  \$schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["v", "type", "props"],
  properties: {
    v: { const: 1 },
    type: { type: "string" },
    props: { type: "object" }
  }
};
