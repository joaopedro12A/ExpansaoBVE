/* ==========================================================
   DOWNLOADS: filtro por tipo e busca por texto
   ========================================================== */
const filtro = { tipo: "Todos", busca: "" };

function renderizarLista() {
  const tipos = ["Todos", ...CONFIG.tipos];

  // Botões de tipo + campo de busca
  $("#tools").innerHTML = tipos.map(tipo => {
    const total = tipo === "Todos"
      ? CONFIG.downloads.length
      : CONFIG.downloads.filter(d => d.tipo === tipo).length;
    return `<button class="chip ${filtro.tipo === tipo ? "on" : ""}" data-t="${tipo}">${tipo} <small>${total}</small></button>`;
  }).join("") +
    `<input class="q" id="q" type="search" placeholder="Buscar download" aria-label="Buscar download" value="${filtro.busca}">`;

  // Cards filtrados
  const termo = filtro.busca.trim().toLowerCase();
  const resultado = CONFIG.downloads.filter(d =>
    (filtro.tipo === "Todos" || d.tipo === filtro.tipo) &&
    (!termo || (d.nome + " " + (d.desc || "")).toLowerCase().includes(termo))
  );

  $("#list").innerHTML =
    (resultado.length
      ? resultado.map(cardDownload).join("")
      : `<p class="lead">Nenhum download encontrado para este filtro.</p>`) +
    `<div class="dc add"><h3>Mais downloads a caminho</h3><p>Quer publicar uma rota ou um trem aqui? Fale com a equipe.</p><a class="btn o" href="#equipe">Ver a equipe</a></div>`;

  // Busca em tempo real, mantendo o foco e o cursor no campo
  const campo = $("#q");
  campo.oninput = () => {
    filtro.busca = campo.value;
    const cursor = campo.selectionStart;
    renderizarLista();
    const novoCampo = $("#q");
    novoCampo.focus();
    novoCampo.setSelectionRange(cursor, cursor);
  };
}
