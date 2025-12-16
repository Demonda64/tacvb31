/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : UTIL
 */

import { v4 as uuidv4 } from "uuid";

export const UUID_MODE = "bin16";

export function newUuid() {
  return uuidv4();
}

export function idExpr(col = "id") {
  return UUID_MODE === "bin16" ? \`BIN_TO_UUID(\${col}, 1)\` : col;
}

export function idValue(param = "id") {
  return UUID_MODE === "bin16" ? \`UUID_TO_BIN(:\${param}, 1)\` : \`:\${param}\`;
}
