import { useState, useMemo, useEffect } from "react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "HoneyB Original",
    tagline: "Para cabello normal",
    hair: "normal",
    scent: "miel",
    price: 28000,
    weight: "65 g",
    emoji: "🍯",
    description: "Limpieza suave con extracto de miel pura. Sin sulfatos ni plástico.",
    color: "#F5C842",
  },
  {
    id: 2,
    name: "HoneyB Avena",
    tagline: "Para cabello seco y frágil",
    hair: "seco",
    scent: "avena",
    price: 31000,
    weight: "65 g",
    emoji: "🌾",
    description: "Hidratación profunda con avena coloidal y aceite de argán.",
    color: "#D4A96A",
  },
  {
    id: 3,
    name: "HoneyB Menta",
    tagline: "Para cabello graso",
    hair: "graso",
    scent: "menta",
    price: 29000,
    weight: "65 g",
    emoji: "🌿",
    description: "Equilibra el sebo con menta piperita y té verde. Frescura duradera.",
    color: "#4CAF82",
  },
  {
    id: 4,
    name: "HoneyB Rosa",
    tagline: "Para cabello teñido",
    hair: "teñido",
    scent: "rosa",
    price: 34000,
    weight: "65 g",
    emoji: "🌸",
    description: "Protege el color con aceite de rosa mosqueta y keratina vegetal.",
    color: "#E87D9A",
  },
  {
    id: 5,
    name: "HoneyB Coco",
    tagline: "Para cabello rizado",
    hair: "rizado",
    scent: "coco",
    price: 33000,
    weight: "65 g",
    emoji: "🥥",
    description: "Define rizos con aceite de coco virgen y proteína de seda.",
    color: "#A0784A",
  },
  {
    id: 6,
    name: "HoneyB Limón",
    tagline: "Para cabello con caspa",
    hair: "caspa",
    scent: "limón",
    price: 30000,
    weight: "65 g",
    emoji: "🍋",
    description: "Controla la caspa con ácido cítrico y extracto de árbol de té.",
    color: "#C8D43A",
  },
];

const HAIR_TYPES = [
  { value: "all", label: "Todos" },
  { value: "normal", label: "Normal" },
  { value: "seco", label: "Seco" },
  { value: "graso", label: "Graso" },
  { value: "teñido", label: "Teñido" },
  { value: "rizado", label: "Rizado" },
  { value: "caspa", label: "Con caspa" },
];

/* ─────────────────────────────────────────────
   UTILS
───────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

/* ─────────────────────────────────────────────
   STYLES (injected once)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:     #1A1208;
    --gold:    #C8960A;
    --honey:   #F5C842;
    --cream:   #FDF8EE;
    --paper:   #FAF4E2;
    --muted:   #8A7A5A;
    --border:  #E8D8A8;
    --white:   #FFFFFF;
    --shadow:  0 2px 16px rgba(26,18,8,.10);
    --r:       12px;
    --font-display: 'Playfair Display', serif;
    --font-body:    'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--cream); color: var(--ink); font-family: var(--font-body); }

  /* ── Header ── */
  .hb-header {
    position: sticky; top: 0; z-index: 100;
    background: var(--ink);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(1rem, 5vw, 3rem);
    height: 64px;
  }
  .hb-logo {
    font-family: var(--font-display);
    font-size: 1.5rem; font-style: italic;
    color: var(--honey); letter-spacing: .02em;
    text-decoration: none;
  }
  .hb-logo span { color: var(--white); font-style: normal; font-size: .85em; margin-left: .25rem; }
  .hb-cart-btn {
    position: relative; cursor: pointer;
    background: var(--honey); border: none; border-radius: 999px;
    padding: .45rem 1.1rem .45rem .85rem;
    display: flex; align-items: center; gap: .5rem;
    font-family: var(--font-body); font-size: .9rem; font-weight: 500;
    color: var(--ink); transition: background .2s;
  }
  .hb-cart-btn:hover { background: #e6b80e; }
  .hb-cart-badge {
    position: absolute; top: -6px; right: -6px;
    background: #E85D3A; color: #fff;
    font-size: .7rem; font-weight: 700; line-height: 1;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: transform .25s cubic-bezier(.34,1.56,.64,1);
  }
  .hb-cart-badge.pop { transform: scale(1.5); }

  /* ── Hero ── */
  .hb-hero {
    background: var(--ink);
    color: var(--white);
    padding: clamp(3rem,8vw,6rem) clamp(1rem,5vw,3rem);
    display: flex; flex-direction: column; gap: 1.25rem;
    position: relative; overflow: hidden;
  }
  .hb-hero::after {
    content: '🍯';
    position: absolute; right: -1rem; bottom: -2rem;
    font-size: clamp(8rem,18vw,15rem); opacity: .07;
    pointer-events: none; line-height: 1;
  }
  .hb-hero-eyebrow {
    font-size: .78rem; letter-spacing: .15em; text-transform: uppercase;
    color: var(--honey); font-weight: 500;
  }
  .hb-hero-h1 {
    font-family: var(--font-display); font-size: clamp(2.2rem,6vw,4.5rem);
    font-weight: 700; line-height: 1.05; max-width: 14ch;
  }
  .hb-hero-h1 em { color: var(--honey); font-style: italic; }
  .hb-hero-sub {
    color: #C8BFA8; max-width: 48ch;
    font-size: clamp(.9rem,2vw,1.05rem); line-height: 1.65; font-weight: 300;
  }
  .hb-hero-pills { display: flex; flex-wrap: wrap; gap: .5rem; }
  .hb-hero-pill {
    border: 1px solid rgba(245,200,66,.35);
    border-radius: 999px; padding: .3rem .9rem;
    font-size: .78rem; color: var(--honey);
  }

  /* ── Filter bar ── */
  .hb-filter-bar {
    background: var(--paper);
    border-bottom: 1px solid var(--border);
    padding: 1rem clamp(1rem,5vw,3rem);
    display: flex; flex-wrap: wrap; gap: .75rem; align-items: center;
  }
  .hb-filter-label {
    font-size: .78rem; letter-spacing: .1em; text-transform: uppercase;
    color: var(--muted); font-weight: 500;
  }
  .hb-filter-chip {
    cursor: pointer; padding: .35rem .9rem; border-radius: 999px;
    border: 1.5px solid var(--border); background: transparent;
    font-family: var(--font-body); font-size: .85rem; color: var(--muted);
    transition: all .15s;
  }
  .hb-filter-chip:hover { border-color: var(--gold); color: var(--gold); }
  .hb-filter-chip.active {
    background: var(--gold); border-color: var(--gold); color: var(--white); font-weight: 500;
  }

  /* ── Search ── */
  .hb-search-wrap {
    padding: 1.25rem clamp(1rem,5vw,3rem) 0;
  }
  .hb-search {
    width: 100%; max-width: 380px;
    border: 1.5px solid var(--border); border-radius: var(--r);
    background: var(--white); padding: .65rem 1rem;
    font-family: var(--font-body); font-size: .95rem; color: var(--ink);
    outline: none; transition: border-color .15s;
  }
  .hb-search:focus { border-color: var(--gold); }
  .hb-search::placeholder { color: var(--muted); }

  /* ── Product grid ── */
  .hb-grid-wrap {
    padding: 1.5rem clamp(1rem,5vw,3rem) 4rem;
  }
  .hb-results-count {
    font-size: .82rem; color: var(--muted); margin-bottom: 1.25rem;
  }
  .hb-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
    gap: 1.5rem;
  }

  /* ── Product card ── */
  .hb-card {
    background: var(--white); border-radius: var(--r);
    border: 1px solid var(--border);
    overflow: hidden; display: flex; flex-direction: column;
    box-shadow: var(--shadow);
    transition: transform .2s, box-shadow .2s;
  }
  .hb-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(26,18,8,.13); }
  .hb-card-visual {
    height: 160px; display: flex; align-items: center; justify-content: center;
    font-size: 5rem; position: relative;
  }
  .hb-card-badge-hair {
    position: absolute; bottom: .6rem; right: .7rem;
    background: rgba(255,255,255,.85); backdrop-filter: blur(4px);
    border-radius: 999px; padding: .2rem .65rem;
    font-size: .72rem; color: var(--ink); font-weight: 500;
  }
  .hb-card-body { padding: 1.1rem; flex: 1; display: flex; flex-direction: column; gap: .45rem; }
  .hb-card-name { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; }
  .hb-card-tagline { font-size: .82rem; color: var(--muted); }
  .hb-card-desc { font-size: .85rem; line-height: 1.6; color: #4A3E28; flex: 1; }
  .hb-card-footer {
    border-top: 1px solid var(--border);
    padding: .9rem 1.1rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .hb-card-price { font-size: 1.05rem; font-weight: 500; color: var(--ink); }
  .hb-card-weight { font-size: .75rem; color: var(--muted); }
  .hb-add-btn {
    cursor: pointer; background: var(--ink); color: var(--honey);
    border: none; border-radius: 8px; padding: .5rem 1rem;
    font-family: var(--font-body); font-size: .85rem; font-weight: 500;
    transition: background .15s, transform .1s;
  }
  .hb-add-btn:hover { background: #2D2410; }
  .hb-add-btn:active { transform: scale(.96); }
  .hb-add-btn.added { background: var(--gold); color: var(--white); }

  /* ── Empty state ── */
  .hb-empty {
    text-align: center; padding: 4rem 1rem; color: var(--muted);
    grid-column: 1/-1;
  }
  .hb-empty-icon { font-size: 3rem; margin-bottom: .75rem; }
  .hb-empty-msg { font-size: 1rem; }

  /* ── Cart Drawer ── */
  .hb-overlay {
    position: fixed; inset: 0; background: rgba(26,18,8,.45);
    z-index: 200; opacity: 0; pointer-events: none;
    transition: opacity .3s;
  }
  .hb-overlay.open { opacity: 1; pointer-events: all; }
  .hb-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(420px, 100vw);
    background: var(--white); z-index: 201;
    display: flex; flex-direction: column;
    transform: translateX(100%); transition: transform .35s cubic-bezier(.4,0,.2,1);
    box-shadow: -4px 0 40px rgba(26,18,8,.18);
  }
  .hb-drawer.open { transform: translateX(0); }
  .hb-drawer-header {
    background: var(--ink); color: var(--white);
    padding: 1.1rem 1.4rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .hb-drawer-title { font-family: var(--font-display); font-size: 1.2rem; font-style: italic; }
  .hb-drawer-close {
    cursor: pointer; background: none; border: none;
    color: var(--honey); font-size: 1.5rem; line-height: 1;
    padding: .2rem; transition: transform .15s;
  }
  .hb-drawer-close:hover { transform: rotate(90deg); }
  .hb-drawer-items { flex: 1; overflow-y: auto; padding: 1rem 1.4rem; display: flex; flex-direction: column; gap: 1rem; }
  .hb-drawer-empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: .75rem; color: var(--muted); text-align: center;
  }
  .hb-drawer-empty-icon { font-size: 3.5rem; }

  /* ── Cart item ── */
  .hb-item {
    display: grid; grid-template-columns: 52px 1fr auto;
    gap: .85rem; align-items: center;
    padding: .85rem; border-radius: var(--r);
    background: var(--cream); border: 1px solid var(--border);
  }
  .hb-item-icon {
    width: 52px; height: 52px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
  }
  .hb-item-name { font-size: .9rem; font-weight: 500; }
  .hb-item-price { font-size: .8rem; color: var(--muted); margin-top: .1rem; }
  .hb-item-qty {
    display: flex; align-items: center; gap: .4rem;
    margin-top: .4rem;
  }
  .hb-qty-btn {
    width: 26px; height: 26px; border-radius: 50%;
    border: 1.5px solid var(--border); background: var(--white);
    cursor: pointer; font-size: 1rem; line-height: 1;
    display: flex; align-items: center; justify-content: center;
    transition: background .15s;
  }
  .hb-qty-btn:hover { background: var(--honey); border-color: var(--honey); }
  .hb-qty-num { font-size: .9rem; font-weight: 500; min-width: 20px; text-align: center; }
  .hb-item-subtotal { font-size: .95rem; font-weight: 600; }
  .hb-item-remove {
    background: none; border: none; cursor: pointer;
    color: #C4A07A; font-size: .75rem; margin-top: .25rem;
    padding: 0; text-decoration: underline; font-family: var(--font-body);
  }
  .hb-item-remove:hover { color: #E85D3A; }

  /* ── Cart footer ── */
  .hb-drawer-footer { padding: 1.25rem 1.4rem; border-top: 1px solid var(--border); }
  .hb-cart-summary { display: flex; flex-direction: column; gap: .45rem; margin-bottom: 1rem; }
  .hb-summary-row {
    display: flex; justify-content: space-between;
    font-size: .88rem; color: var(--muted);
  }
  .hb-summary-row.total {
    font-size: 1.05rem; font-weight: 600; color: var(--ink);
    padding-top: .5rem; border-top: 1px solid var(--border);
  }
  .hb-checkout-btn {
    width: 100%; padding: .9rem; border: none; border-radius: var(--r);
    background: var(--gold); color: var(--white);
    font-family: var(--font-body); font-size: 1rem; font-weight: 600;
    cursor: pointer; transition: background .15s;
    letter-spacing: .02em;
  }
  .hb-checkout-btn:hover { background: #B8860A; }
  .hb-eco-note {
    text-align: center; font-size: .75rem; color: var(--muted);
    margin-top: .75rem;
  }

  /* ── Toast ── */
  .hb-toast {
    position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%) translateY(80px);
    background: var(--ink); color: var(--white);
    padding: .65rem 1.4rem; border-radius: 999px;
    font-size: .88rem; font-weight: 500;
    z-index: 300; transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    pointer-events: none; white-space: nowrap;
  }
  .hb-toast.show { transform: translateX(-50%) translateY(0); }
  .hb-toast-honey { color: var(--honey); }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .hb-hero-h1 { font-size: 2rem; }
    .hb-drawer { width: 100vw; }
  }
`;

/* ─────────────────────────────────────────────
   HOOK — CART
───────────────────────────────────────────── */
function useCart() {
  const [items, setItems] = useState([]);

  const add = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const change = (id, delta) => {
    setItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = count > 0 ? 8000 : 0;
  const total = subtotal + shipping;

  return { items, add, remove, change, count, subtotal, shipping, total };
}

/* ─────────────────────────────────────────────
   COMPONENT — CartItem
───────────────────────────────────────────── */
function CartItem({ item, onRemove, onChange }) {
  return (
    <div className="hb-item">
      <div className="hb-item-icon" style={{ background: item.color + "22" }}>
        {item.emoji}
      </div>
      <div>
        <div className="hb-item-name">{item.name}</div>
        <div className="hb-item-price">{fmt(item.price)} / unidad</div>
        <div className="hb-item-qty">
          <button className="hb-qty-btn" onClick={() => onChange(item.id, -1)}>−</button>
          <span className="hb-qty-num">{item.qty}</span>
          <button className="hb-qty-btn" onClick={() => onChange(item.id, +1)}>+</button>
        </div>
        <button className="hb-item-remove" onClick={() => onRemove(item.id)}>Eliminar</button>
      </div>
      <div className="hb-item-subtotal">{fmt(item.price * item.qty)}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPONENT — ProductCard
───────────────────────────────────────────── */
function ProductCard({ product, onAdd }) {
  const [flash, setFlash] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 700);
  };

  return (
    <div className="hb-card">
      <div className="hb-card-visual" style={{ background: product.color + "22" }}>
        {product.emoji}
        <span className="hb-card-badge-hair">{product.hair}</span>
      </div>
      <div className="hb-card-body">
        <div className="hb-card-name">{product.name}</div>
        <div className="hb-card-tagline">{product.tagline}</div>
        <div className="hb-card-desc">{product.description}</div>
      </div>
      <div className="hb-card-footer">
        <div>
          <div className="hb-card-price">{fmt(product.price)}</div>
          <div className="hb-card-weight">{product.weight}</div>
        </div>
        <button
          className={`hb-add-btn ${flash ? "added" : ""}`}
          onClick={handleAdd}
        >
          {flash ? "✓ Agregado" : "Agregar"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const cart = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hairFilter, setHairFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [badge, setBadge] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "" });

  // Filtered products — live, no reload
  const visible = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchHair = hairFilter === "all" || p.hair === hairFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.scent.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchHair && matchSearch;
    });
  }, [hairFilter, search]);

  // Badge pop animation on cart change
  useEffect(() => {
    if (cart.count === 0) return;
    setBadge(true);
    const t = setTimeout(() => setBadge(false), 350);
    return () => clearTimeout(t);
  }, [cart.count]);

  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: "" }), 2000);
  };

  const handleAdd = (product) => {
    cart.add(product);
    showToast(`${product.emoji} ${product.name} agregado al carrito`);
  };

  return (
    <>
      {/* Inject CSS */}
      <style>{CSS}</style>

      {/* ── Header — cart count synced ── */}
      <header className="hb-header">
        <a className="hb-logo" href="#">
          HoneyB<span>Shampoo Sólido</span>
        </a>
        <button className="hb-cart-btn" onClick={() => setDrawerOpen(true)}>
          🛒 Carrito
          {cart.count > 0 && (
            <span className={`hb-cart-badge ${badge ? "pop" : ""}`}>
              {cart.count}
            </span>
          )}
        </button>
      </header>

      {/* ── Hero ── */}
      <section className="hb-hero">
        <p className="hb-hero-eyebrow">100 % Natural · Zero plástico</p>
        <h1 className="hb-hero-h1">
          El champú que cuida tu cabello <em>y el planeta</em>
        </h1>
        <p className="hb-hero-sub">
          Cada barra HoneyB reemplaza hasta 3 botellas de champú líquido. Sin sulfatos,
          sin parabenos, sin envases de un solo uso. Formulado con ingredientes colombianos.
        </p>
        <div className="hb-hero-pills">
          {["Sin plástico", "Vegano", "Sin sulfatos", "Hecho en Colombia", "Dura 80+ lavados"].map((t) => (
            <span key={t} className="hb-hero-pill">{t}</span>
          ))}
        </div>
      </section>

      {/* ── Filter bar — live filter ── */}
      <div className="hb-filter-bar">
        <span className="hb-filter-label">Tipo de cabello:</span>
        {HAIR_TYPES.map((t) => (
          <button
            key={t.value}
            className={`hb-filter-chip ${hairFilter === t.value ? "active" : ""}`}
            onClick={() => setHairFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="hb-search-wrap">
        <input
          className="hb-search"
          type="search"
          placeholder="Buscar por nombre, aroma, tipo de cabello…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Product grid ── */}
      <div className="hb-grid-wrap">
        <p className="hb-results-count">
          {visible.length} producto{visible.length !== 1 ? "s" : ""} encontrado{visible.length !== 1 ? "s" : ""}
        </p>
        <div className="hb-grid">
          {visible.length === 0 ? (
            <div className="hb-empty">
              <div className="hb-empty-icon">🔍</div>
              <p className="hb-empty-msg">Ningún producto coincide con tu búsqueda.</p>
            </div>
          ) : (
            visible.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={handleAdd} />
            ))
          )}
        </div>
      </div>

      {/* ── Overlay ── */}
      <div
        className={`hb-overlay ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* ── Cart Drawer — state synced in 3 points: badge, panel items, total ── */}
      <aside className={`hb-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="hb-drawer-header">
          <span className="hb-drawer-title">Tu carrito</span>
          <button className="hb-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        <div className="hb-drawer-items">
          {cart.items.length === 0 ? (
            <div className="hb-drawer-empty">
              <div className="hb-drawer-empty-icon">🧴</div>
              <p>Tu carrito está vacío.</p>
              <p style={{ fontSize: ".82rem" }}>Agrega un HoneyB para empezar.</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={cart.remove}
                onChange={cart.change}
              />
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="hb-drawer-footer">
            <div className="hb-cart-summary">
              <div className="hb-summary-row">
                <span>Subtotal ({cart.count} unidad{cart.count !== 1 ? "es" : ""})</span>
                <span>{fmt(cart.subtotal)}</span>
              </div>
              <div className="hb-summary-row">
                <span>Envío</span>
                <span>{fmt(cart.shipping)}</span>
              </div>
              <div className="hb-summary-row total">
                <span>Total</span>
                <span>{fmt(cart.total)}</span>
              </div>
            </div>
            <button
              className="hb-checkout-btn"
              onClick={() => showToast("¡Pedido en camino! 🍯")}
            >
              Finalizar compra
            </button>
            <p className="hb-eco-note">
              🌿 Tu pedido viaja en empaque 100 % biodegradable
            </p>
          </div>
        )}
      </aside>

      {/* ── Toast ── */}
      <div className={`hb-toast ${toast.show ? "show" : ""}`}>
        <span className="hb-toast-honey">{toast.text}</span>
      </div>
    </>
  );
}
