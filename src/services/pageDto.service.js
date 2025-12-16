/**
 * Project   : TACVB31
 * Module    : CMS
 * Author    : Freezer64
 * Created   : 2025-12-15
 * Layer     : SERVICE
 */
import { pool } from "../config/db.js";

function buildTree(items) {
  const byId = new Map();
  const roots = [];

  for (const it of items) {
    byId.set(it.id, { ...it, children: [] });
  }

  for (const it of items) {
    const node = byId.get(it.id);
    if (it.parent_id && byId.has(it.parent_id)) {
      byId.get(it.parent_id).children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRec = (arr) => {
    arr.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    arr.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}

function normalizeJson(v) {
  if (v == null) return null;
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return v; }
  }
  return v;
}

export async function getPageDtoBySlug(slug) {
  const conn = await pool.getConnection();
  try {
    const [pRows] = await conn.execute(
      `SELECT HEX(id) AS id, slug, title, status
       FROM club_core.ui_pages
       WHERE slug = ? AND deleted_at IS NULL
       LIMIT 1`,
      [slug]
    );
    if (!pRows.length) return null;
    const page = pRows[0];

    const [cRows] = await conn.execute(
      `SELECT HEX(id) AS id, HEX(page_id) AS page_id, type, position
       FROM club_core.ui_containers
       WHERE page_id = UNHEX(?) AND deleted_at IS NULL
       ORDER BY position ASC`,
      [page.id]
    );

    const containerIds = cRows.map((r) => r.id);
    let cardsByContainer = {};

    if (containerIds.length) {
      const placeholders = containerIds.map(() => "UNHEX(?)").join(",");
      const [cardRows] = await conn.execute(
        `SELECT HEX(id) AS id, HEX(container_id) AS container_id, type, position, data
         FROM club_core.ui_cards
         WHERE container_id IN (${placeholders})
           AND deleted_at IS NULL
         ORDER BY container_id ASC, position ASC`,
        containerIds
      );

      cardsByContainer = cardRows.reduce((acc, r) => {
        (acc[r.container_id] ||= []).push({
          id: r.id,
          type: r.type,
          position: r.position,
          data: normalizeJson(r.data),
        });
        return acc;
      }, {});
    }

    const containers = cRows.map((c) => ({
      id: c.id,
      type: c.type,
      position: c.position,
      cards: cardsByContainer[c.id] || [],
    }));

    const [navRows] = await conn.execute(
      `SELECT
          HEX(i.id) AS id,
          HEX(i.parent_id) AS parent_id,
          i.label, i.href, i.target, i.rel, i.position, i.data
       FROM club_core.ui_menus m
       JOIN club_core.ui_menu_items i ON i.menu_id = m.id
       WHERE m.code = 'main_nav'
         AND m.deleted_at IS NULL
         AND i.deleted_at IS NULL
         AND i.is_active = 1
       ORDER BY (i.parent_id IS NOT NULL) ASC, i.parent_id ASC, i.position ASC`
    );
    const nav = buildTree(
      navRows.map((r) => ({ ...r, data: normalizeJson(r.data) }))
    );

    const [footerLinks] = await conn.execute(
      `SELECT i.label, i.href, i.position
       FROM club_core.ui_menus m
       JOIN club_core.ui_menu_items i ON i.menu_id=m.id
       WHERE m.code='footer_nav'
         AND m.deleted_at IS NULL
         AND i.deleted_at IS NULL
         AND i.is_active=1
         AND i.parent_id IS NULL
       ORDER BY i.position ASC`
    );

    const [sRows] = await conn.execute(
      `SELECT data
       FROM club_core.ui_site_settings
       WHERE code='site_default'
         AND deleted_at IS NULL
       LIMIT 1`
    );
    const settings = sRows.length ? normalizeJson(sRows[0].data) : null;

    return {
      page,
      nav,
      footer: { links: footerLinks, settings },
      containers,
    };
  } finally {
    conn.release();
  }
}
