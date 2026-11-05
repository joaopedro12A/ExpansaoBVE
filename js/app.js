/* ==========================================================
   APP: rotas por #hash, menu mobile e tema claro/escuro
   ========================================================== */

/* ----- Roteamento ----- */
function rotear() {
  const hash = (location.hash || "#home").slice(1);
  const pagina = PAGINAS[hash] ? hash : "home";

  $("#app").innerHTML = `<div class="pg">${PAGINAS[pagina]()}</div>`;
  $("#nav").innerHTML = PAGES.map(([id, texto]) =>
    `<a href="#${id}" class="${id === pagina ? "on" : ""}">${texto}</a>`
  ).join("");
  $("#nav").classList.remove("open");
  $("#fn").innerHTML = PAGES.map(([id, texto]) => `<a href="#${id}">${texto}</a>`).join("");

  const nomePagina = PAGES.find(p => p[0] === pagina)[1];
  document.title = (pagina === "home" ? "" : nomePagina + " · ") + CONFIG.nome;

  window.scrollTo(0, 0);
  if (pagina === "downloads") renderizarLista();
}

$("#fm").innerHTML = marquee("wh", 70);
addEventListener("hashchange", rotear);
rotear();

/* ----- Cliques nos filtros (chips) e nos atalhos da home ----- */
document.addEventListener("click", e => {
  const alvo = e.target.closest(".chip, .cols a[data-t]");
  if (!alvo) return;
  filtro.tipo = alvo.dataset.t;
  if (alvo.classList.contains("chip")) renderizarLista();
});

/* ----- Menu mobile ----- */
$("#mn").onclick = () => $("#nav").classList.toggle("open");

/* ----- Tema claro/escuro ----- */
const raiz = document.documentElement;
try {
  const salvo = localStorage.getItem("tema");
  if (salvo) raiz.dataset.theme = salvo;
} catch (e) {}

$("#tg").onclick = () => {
  const escuro = raiz.dataset.theme
    ? raiz.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme:dark)").matches;
  const novo = escuro ? "light" : "dark";
  raiz.dataset.theme = novo;
  try { localStorage.setItem("tema", novo); } catch (e) {}
};
