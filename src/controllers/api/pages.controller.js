/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : CONTROLLERS/API
 */

import { getPageDtoBySlug } from "../../services/pageDto.service.js";

export async function getPageBySlug(req, res, next) {
  try {
    const dto = await getPageDtoBySlug(req.params.slug);
    if (!dto) return res.status(404).json({ error: "PAGE_NOT_FOUND" });
    return res.json(dto);
  } catch (e) {
    return next(e);
  }
}
