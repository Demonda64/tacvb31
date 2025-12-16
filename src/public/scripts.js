async function main() {
  const slug = "accueil";
  const res = await fetch(`/api/pages/${slug}`);
  const dto = await res.json();

  document.getElementById("header").appendChild(renderNav(dto.nav));
  document.getElementById("content").appendChild(renderContainers(dto.containers));
  document.getElementById("footer").appendChild(renderFooter(dto.footer));
}

/* =========================
   NAV
   ========================= */

function renderNav(items = []) {
  const nav = document.createElement("nav");
  const ul = document.createElement("ul");
  items.forEach((it) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = it.label;
    a.href = it.href || "#";
    a.target = it.target || "_self";
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  return nav;
}

/* =========================
   CARD RENDERERS (blocks)
   ========================= */

function renderHero(card) {
  const el = document.createElement("div");
  el.dataset.card = card.type;

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
  el.dataset.card = card.type;
  el.className = "card card--richtext";

  // On suppose que l'API renvoie déjà du HTML nettoyé
  const html = card.data?.props?.html ?? "";
  el.innerHTML = html;

  return el;
}


function renderGallery(card) {
  const el = document.createElement("div");
  el.dataset.card = card.type;
  el.className = "card card--gallery";

  const imgs = card.data?.props?.images || [];
  imgs.forEach(img => {
    const figure = document.createElement("figure");

    const image = document.createElement("img");
    image.src = img.src;
    image.alt = img.alt || "";
    image.loading = "lazy"; // ✅
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
  el.dataset.card = card.type;
  el.textContent = "CTA (à implémenter)";
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
    el.dataset.card = card.type;
    el.textContent = `Card inconnue: ${card.type}`;
    return el;
  }
  return renderer(card);
}

/* =========================
   CONTAINER RENDERERS
   ========================= */

function renderSection(container) {
  const section = document.createElement("section");
  section.dataset.container = container.type;

  (container.cards || []).forEach((card) => {
    section.appendChild(renderCard(card));
  });

  return section;
}

function renderGrid(container) {
  const div = document.createElement("div");
  div.dataset.container = container.type;
  div.className = "container container--grid";

  const layout = container.data?.layout || {};

  const cols = layout.columns || {};
  div.style.setProperty("--grid-cols-desktop", cols.desktop ?? 3);
  div.style.setProperty("--grid-cols-tablet", cols.tablet ?? 2);
  div.style.setProperty("--grid-cols-mobile", cols.mobile ?? 1);
  div.style.setProperty("--grid-gap", layout.gap ?? "16px");

  (container.cards || []).forEach((card) => {
    div.appendChild(renderCard(card));
  });

  return div;
}


function renderTabs(container) {
  const root = document.createElement("div");
  root.dataset.container = container.type;
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
      .filter(card => (card.data?.props?.tabId ?? null) === active)
      .forEach(card => panel.appendChild(renderCard(card)));
  }

  tabs.forEach(t => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = t.label;
    btn.className = "tabs__btn";
    if (t.id === active) btn.classList.add("is-active");

    btn.addEventListener("click", () => {
      active = t.id;
      [...bar.querySelectorAll(".tabs__btn")].forEach(b => b.classList.remove("is-active"));
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

  containers.forEach((c) => {
    let section = document.createElement("section");

    if (c.type === "GRID") {
      section.classList.add("container--grid");

      const cols = c.data?.layout?.columns || {};
      const gap = c.data?.layout?.gap || "16px";

      section.style.setProperty("--grid-gap", gap);
      section.style.setProperty("--grid-cols-desktop", cols.desktop ?? 3);
      section.style.setProperty("--grid-cols-tablet", cols.tablet ?? 2);
      section.style.setProperty("--grid-cols-mobile", cols.mobile ?? 1);
    }

    (c.cards || []).forEach(card => {
      section.appendChild(renderCard(card));
    });

    wrap.appendChild(section);
  });

  return wrap;
}


/* =========================
   FOOTER
   ========================= */

function renderFooter(footer) {
  const wrap = document.createElement("div");
  const clubName = footer?.settings?.footer?.clubName ?? "Club";
  const tagline = footer?.settings?.footer?.tagline ?? "";
  wrap.innerHTML = `<div>${clubName} — ${tagline}</div>`;
  return wrap;
}

main().catch(console.error);
