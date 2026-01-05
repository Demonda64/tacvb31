/**
 * TACVB31 — CMS
 * RICHTEXT JSON Schema v1
 * Author: Freezer64
 */

export const RICHTEXT_SCHEMA_V1 = {
  type: "object",
  required: ["v", "type", "props"],
  properties: {
    v: { type: "integer", const: 1 },
    type: { type: "string", const: "RICHTEXT" },
    props: {
      type: "object",
      required: ["html"],
      properties: {
        html: {
          type: "string",
          minLength: 1,
          maxLength: 20000
        },
        variant: {
          type: "string",
          enum: ["default", "muted", "lead"]
        }
      },
      additionalProperties: false
    }
  },
  additionalProperties: false
};
