/**
 * Project   : TACVB31
 * Module    : CMS
 * Layer     : CONTROLLER (ADMIN)
 * Purpose   : Update GRID container layout
 */

import { pool } from "../../config/db.js";

export async function updateGridLayout(req, res, next) {
  try {
    const { id } = req.params; // HEX ID du container
    const { columns, gap } = req.body || {};

    const desktop = Number(columns?.desktop ?? 3);
    const tablet  = Number(columns?.tablet ?? 2);
    const mobile  = Number(columns?.mobile ?? 1);

    // validation stricte
    if (![desktop, tablet, mobile].every(n => Number.isInteger(n) && n >= 1 && n <= 6)) {
      return res.status(400).json({ error: "INVALID_COLUMNS_RANGE" });
    }

    if (typeof gap !== "string" || gap.length < 2 || gap.length > 20) {
      return res.status(400).json({ error: "INVALID_GAP" });
    }

    // 👉 ICI LE POINT QUE TU DEMANDAIS
    const data = {
      v: 1,
      layout: {
        columns: { desktop, tablet, mobile },
        gap
      }
    };

    const conn = await pool.getConnection();
    try {
      const [r] = await conn.execute(
        `UPDATE club_core.ui_containers
         SET data = ?, updated_at = NOW(6)
         WHERE id = UNHEX(?) AND deleted_at IS NULL`,
        [JSON.stringify(data), id]
      );

      if (r.affectedRows === 0) {
        return res.status(404).json({ error: "CONTAINER_NOT_FOUND" });
      }
    } finally {
      conn.release();
    }

    res.json({ ok: true, id, data });
  } catch (e) {
    next(e);
  }
}
