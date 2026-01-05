import { ajv } from "./ajv.instance.js";

const schemaByType = {
  RICHTEXT: "cms.card.RICHTEXT.v1"
};

export function validateCardDataOrThrow(type, data) {
  const schemaId = schemaByType[type];
  if (!schemaId) {
    const err = new Error("CARD_SCHEMA_NOT_FOUND");
    err.status = 400;
    err.details = { type };
    throw err;
  }

  const validate = ajv.getSchema(schemaId);
  const ok = validate(data);
  if (!ok) {
    const err = new Error("CARD_DATA_INVALID");
    err.status = 422;
    err.details = validate.errors;
    throw err;
  }
}
