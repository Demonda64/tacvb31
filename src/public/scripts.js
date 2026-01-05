/**
 * Project   : TACVB31
 * Module    : CMS (Vanilla renderer)
 * Author    : Freezer64
 * Created   : 2025-12-25
 * Layer     : FRONT (public)
 *
 * Notes:
 * - 100% data-driven: rendu uniquement depuis le PageDTO
 * - Zéro logique métier front
 * - Registry containers + cards (migration React facilitée)
 */

import { sanitizeHtml } from "./js/sanitizeHtml.js";

/* =========================
   BOOTSTRAP
   ========================= */

async function main() {
  const slug = "accueil";
  const res = await fetch(`/api/pages/${slug}`);
  const dto = await res.json();

  document.getElementById("header").appendChild(renderNav(dto.nav));
  document.getElementById("content").appendChild(renderContainers(dto.containers));
  document.getElementById("footer").appendChild(renderFooter(dto.footer));
}

main().catch(console.error);

/* =========================
   NAV
   ========================= */

function renderNav(items = []) {
  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  items.forEach((it) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.textContent = it.label ?? "";
    a.href = it.href || "#";
    a.target = it.target || "_self";
    if (it.rel) a.rel = it.rel;

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

/* =========================
   CONTAINER RENDERERS
   ========================= */

function renderSection(container) {
  const section = document.createElement("section");
  section.dataset.container = container.type || "SECTION";
  section.className = "container container--section";

  (container.cards || []).forEach((card) => {
    section.appendChild(renderCard(card));
  });

  return section;
}

function renderGrid(container) {
  const div = document.createElement("div");
  div.dataset.container = container.type || "GRID";
  div.className = "container container--grid";

  const layout = container.data?.layout || {};
  const cols = layout.columns || {};

  // CSS vars pilotées par la BDD
  div.style.setProperty("--grid-cols-desktop", String(cols.desktop ?? 3));
  div.style.setProperty("--grid-cols-tablet", String(cols.tablet ?? 2));
  div.style.setProperty("--grid-cols-mobile", String(cols.mobile ?? 1));
  div.style.setProperty("--grid-gap", String(layout.gap ?? "16px"));

  (container.cards || []).forEach((card) => {
    div.appendChild(renderCard(card));
  });

  return div;
}

function renderTabs(container) {
  const root = document.createElement("div");
  root.dataset.container = container.type || "TABS";
  root.className = "container container--tabs";

  const tabs = container.data?.tabs || [];
  const defaultTabId = container.data?.defaultTabId || (tabs[0]?.id ?? null);
  let active = defaultTabId;

  const bar = document.createElement("div");
  bar.className = "tabs__bar";

  const panel = document.createElement("div");
  panel.className = "tabs__panel";

  function renderPanel() {
    panel.innerHTML = "";

    (container.cards || [])
      .filter((card) => (card.data?.props?.tabId ?? null) === active)
      .forEach((card) => panel.appendChild(renderCard(card)));
  }

  tabs.forEach((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = t.label ?? "Tab";
    btn.className = "tabs__btn";

    if (t.id === active) btn.classList.add("is-active");

    btn.addEventListener("click", () => {
      active = t.id;

      [...bar.querySelectorAll(".tabs__btn")].forEach((b) =>
        b.classList.remove("is-active")
      );
      btn.classList.add("is-active");

      renderPanel();
    });

    bar.appendChild(btn);
  });

  root.appendChild(bar);
  root.appendChild(panel);

  renderPanel();
  return root;
}

const containerRegistry = {
  SECTION: renderSection,
  GRID: renderGrid,
  TABS: renderTabs,
};

function renderContainers(containers = []) {
  const wrap = document.createElement("div");
  wrap.className = "page";

  containers.forEach((c) => {
    const renderer = containerRegistry[c.type] || renderSection;
    wrap.appendChild(renderer(c));
  });

  return wrap;
}

/* =========================
   CARD RENDERERS (blocks)
   ========================= */

function renderHero(card) {
  const el = document.createElement("div");
  el.dataset.card = card.type || "HERO";
  el.className = "card card--hero";

  const h1 = document.createElement("h1");
  h1.textContent = card.data?.props?.headline ?? "HERO";

  const p = document.createElement("p");
  p.textContent = card.data?.props?.subheadline ?? "";

  el.appendChild(h1);
  el.appendChild(p);

  const cta = card.data?.props?.cta;
  if (cta?.href && cta?.label) {
    const a = document.createElement("a");
    a.href = cta.href;
    a.textContent = cta.label;
    el.appendChild(a);
  }

  return el;
}

function renderRichText(card) {
  const el = document.createElement("div");
  el.dataset.card = "RICHTEXT";
  el.className = `card card--richtext card--variant-${
    card.data?.props?.variant ?? "default"
  }`;

  const html = card.data?.props?.html ?? "";
  // ✅ sécurité front (double barrière avec sanitization backend)
  el.innerHTML = sanitizeHtml(html);

  return el;
}

function renderGallery(card) {
  const el = document.createElement("div");
  el.dataset.card = card.type || "GALLERY";
  el.className = "card card--gallery";

  const imgs = card.data?.props?.images || [];
  imgs.forEach((img) => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.alt || "";
    image.loading = "lazy";
    figure.appendChild(image);

    if (img.caption) {
      const cap = document.createElement("figcaption");
      cap.textContent = img.caption;
      figure.appendChild(cap);
    }

    el.appendChild(figure);
  });

  return el;
}

function renderCTA(card) {
  const el = document.createElement("div");
  el.dataset.card = card.type || "CTA";
  el.className = "card card--cta";

  const label = card.data?.props?.label ?? "Action";
  const href = card.data?.props?.href ?? "#";

  const a = document.createElement("a");
  a.textContent = label;
  a.href = href;

  el.appendChild(a);
  return el;
}

const cardRegistry = {
  HERO: renderHero,
  RICHTEXT: renderRichText,
  GALLERY: renderGallery,
  CTA: renderCTA,
};

function renderCard(card) {
  const renderer = cardRegistry[card.type];

  if (!renderer) {
    const el = document.createElement("div");
    el.dataset.card = card.type || "UNKNOWN";
    el.className = "card card--unknown";
    el.textContent = `Card inconnue: ${card.type}`;
    return el;
  }

  return renderer(card);
}

/* =========================
   FOOTER
   ========================= */

function renderFooter(footer) {
  const wrap = document.createElement("div");
  wrap.className = "footer";

  const clubName = footer?.settings?.footer?.clubName ?? "Club";
  const tagline = footer?.settings?.footer?.tagline ?? "";
  const email = footer?.settings?.footer?.email ?? "";

  const top = document.createElement("div");
  top.className = "footer__brand";
  top.textContent = `${clubName} — ${tagline}`;
  wrap.appendChild(top);

  if (email) {
    const mail = document.createElement("a");
    mail.href = `mailto:${email}`;
    mail.textContent = email;
    wrap.appendChild(mail);
  }

  const links = footer?.links || [];
  if (links.length) {
    const ul = document.createElement("ul");
    ul.className = "footer__links";

    links.forEach((l) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = l.label ?? "";
      a.href = l.href || "#";
      li.appendChild(a);
      ul.appendChild(li);
    });

    wrap.appendChild(ul);
  }

  return wrap;
}
