/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : CONFIG/CONTROLLERS
 */
import { getPageDtoBySlug } from "../../services/pageDto.service.js";

export async function getPageBySlug(req, res, next) {
  try {
    const slug = req.params.slug;
    const dto = await getPageDtoBySlug(slug);
    if (!dto) return res.status(404).json({ error: "PAGE_NOT_FOUND" });
    return res.json(dto);
  } catch (e) {
    return next(e);
  }
}
