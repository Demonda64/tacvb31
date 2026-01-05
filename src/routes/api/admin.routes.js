/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-25
 * Layer     : ROUTES (ADMIN API)
 */
import { Router } from "express";
import { updateGridLayout } from "../../controllers/api/admin.containers.controller.js";

const router = Router();

router.patch("/admin/containers/:id/grid-layout", updateGridLayout);

export default router;
