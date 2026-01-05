/**
 * Project : TACVB31
 * Module  : CMS
 * Author  : Freezer64
 * Created : 2025-12-23
 * Schema  : cms.card.RICHTEXT.v1
 */
export const CARD_RICHTEXT_V1_SCHEMA = {
  $id: "cms.card.RICHTEXT.v1",
  type: "object",
  required: ["v", "type", "props"],
  additionalProperties: false,
  properties: {
    v: { type: "integer", const: 1 },
    type: { type: "string", const: "RICHTEXT" },
    props: {
      type: "object",
      required: ["html"],
      additionalProperties: false,
      properties: {
        html: { type: "string", minLength: 1, maxLength: 20000 },
        variant: { type: "string", enum: ["default", "muted", "lead"] }
      }
    }
  }
};
