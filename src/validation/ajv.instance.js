import Ajv from "ajv";
import addFormats from "ajv-formats";
import { CARD_RICHTEXT_V1_SCHEMA } from "./schemas/card.richext.v1.schema.js";

export const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

ajv.addSchema(CARD_RICHTEXT_V1_SCHEMA);
