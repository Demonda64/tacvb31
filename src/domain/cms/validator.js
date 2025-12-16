/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : DOMAIN
 */

import Ajv from "ajv";
import { uiCardDataSchemaV1 } from "./uiCardSchema.v1.js";

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(uiCardDataSchemaV1);

export function validateCardDataOrThrow(type, data) {
  if (data.type !== type) {
    throw new Error("Card type mismatch");
  }
  if (!validate(data)) {
    throw new Error(JSON.stringify(validate.errors));
  }
}
