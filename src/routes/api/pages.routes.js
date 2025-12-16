/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : ROUTES
 */
import { Router } from "express";
import { getPageBySlug } from "../../controllers/api/pages.controller.js";

const router = Router();
router.get("/pages/:slug", getPageBySlug);

export default router;
