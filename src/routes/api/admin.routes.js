// src/routes/api/admin.routes.js
import { Router } from "express";
import { updateGridLayout } from "../../controllers/api/admin.containers.controller.js";

const router = Router();

/**
 * PATCH /api/admin/containers/:id/grid-layout
 */
router.patch("/admin/containers/:id/grid-layout", updateGridLayout);

export default router;
