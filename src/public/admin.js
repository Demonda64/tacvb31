/**
 * Project   : TACVB31
 * Module    : CMS Admin (MVP)
 * Author    : Freezer64
 * Created   : 2025-12-25
 * Layer     : FRONT (public)
 *
 * Purpose:
 * - UI minimale pour PATCH /api/admin/containers/:id/grid-layout
 */

function qs(id) {
  return document.getElementById(id);
}

function writeResult(objOrText) {
  const el = qs("result");
  el.textContent =
    typeof objOrText === "string"
      ? objOrText
      : JSON.stringify(objOrText, null, 2);
}

function normalizeHexId(v) {
  return String(v || "").trim().toUpperCase();
}

async function patchGridLayout(containerId, payload) {
  const res = await fetch(`/api/admin/containers/${containerId}/grid-layout`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error ? `API_ERROR: ${data.error}` : `HTTP_${res.status}`;
    throw new Error(msg);
  }
  return data;
}

async function onSave() {
  try {
    writeResult("...");

    const containerId = normalizeHexId(qs("containerId").value);
    if (!containerId || containerId.length < 10) {
      writeResult("Erreur: containerId vide ou invalide.");
      return;
    }

    const desktop = Number(qs("colDesktop").value);
    const tablet = Number(qs("colTablet").value);
    const mobile = Number(qs("colMobile").value);
    const gap = String(qs("gap").value || "").trim();

    const payload = {
      columns: { desktop, tablet, mobile },
      gap,
    };

    const out = await patchGridLayout(containerId, payload);
    writeResult(out);

    // Optionnel: refresh page publique dans un autre onglet
    // (le DTO reflète directement la BDD)
  } catch (e) {
    writeResult({ ok: false, message: e?.message || String(e) });
  }
}

function main() {
  // astuce: pré-remplir avec le dernier container que tu utilises souvent
  // qs("containerId").value = "6EC9FDA0DA5711F0A58F00155DFFEAF1";

  qs("btnSave").addEventListener("click", onSave);
  writeResult("Prêt. Renseigne un Container ID (HEX) puis Enregistrer.");
}

main();
