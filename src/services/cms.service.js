/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : SERVICE
 */

import { withTx } from "../config/db.js";
import { newUuid, idExpr, idValue } from "../utils/uuidSql.js";
import { validateCardDataOrThrow } from "../domain/cms/validator.js";

// Services createContainer, moveContainer, deleteContainer,
// createCard, moveCard, deleteCard
// (coller ici les fonctions que je t'ai données précédemment)
