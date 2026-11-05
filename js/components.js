/* ==========================================================
   COMPONENTES: pedaços de HTML reutilizados nas páginas
   ========================================================== */
const $ = seletor => document.querySelector(seletor);

// "2026-11-20" -> "20/11/2026"
const formatarData = data =>
  data ? new Date(data + "T12:00:00").toLocaleDateString("pt-BR") : "";

// Mostra o valor ou, se estiver vazio, o texto reserva esmaecido
const valorOuReserva = (valor, reserva) =>
  valor ? valor : `<span class="dim">${reserva}</span>`;

const ICONE_LINK = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a3 3 0 1 1 4.2 4.2l-2 2-1.4-1.4 2-2a1 1 0 0 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4L9.9 15.5a3 3 0 1 1-4.2-4.2l2-2 1.4 1.4-2 2a1 1 0 0 0 1.4 1.4L12 10.6a1 1 0 0 1 1.4 0Z"/></svg>`;

/* Faixa de imagens que passa.
   cls "big" = silhuetas brancas grandes e esmaecidas (w-*), "sm" = logos coloridas (c-*),
   "wh" = logos brancas sem fundo (w-*), usadas no rodapé.
   segundos = duração da animação. */
function marquee(cls, segundos) {
  const prefixo = cls === "sm" ? "c-" : "w-";
  // "sm" (abaixo dos lançamentos) mostra só o logotipo do Expansão BVE; "big" e "wh" usam as 4 marcas
  const lista = cls === "sm" ? ["expansao"] : MQ;
  const imagens = Array.from({ length: 20 }, (_, i) =>
    `<img src="img/${prefixo}${lista[i % lista.length]}.png" alt="">`
  ).join("");
  const grupo = `<div class="mq-g">${imagens}</div>`;
  return `<div class="mq ${cls}" style="--d:${segundos || 70}s" aria-hidden="true"><div class="mq-t">${grupo}${grupo}</div></div>`;
}

// Faixa de título no topo das páginas internas
const tituloPagina = (titulo, subtitulo) => `
  <div class="pt">${marquee("big", 90)}
    <div class="w in"><h2>${titulo}</h2><p>${subtitulo}</p></div>
  </div>`;

// Botão "Baixar" ou "Em breve"
const botaoDownload = d => d.url
  ? `<a class="btn" href="${d.url}" rel="noopener">Baixar</a>`
  : `<button class="btn" disabled>Em breve</button>`;

// Card de download (página Downloads)
const cardDownload = d => `<article class="dc">
  <div class="im">${d.img
    ? `<img loading="lazy" src="${d.img}" alt="${d.nome}">`
    : `<img class="ph" src="img/logo.png" alt="">`}</div>
  <div class="bd"><span class="tag">${d.tipo}</span><h3>${d.nome}</h3><p>${d.desc || ""}</p>
  <div class="meta"><span>Versão <b>${valorOuReserva(d.versao, "—")}</b></span><span>Tamanho <b>${valorOuReserva(d.tamanho, "—")}</b></span>${d.data ? `<span>${d.url ? "Atualizado" : "Previsto"} <b>${formatarData(d.data)}</b></span>` : ""}</div>
  ${botaoDownload(d)}</div></article>`;

// Linha do quadro "Últimos lançamentos" (página inicial)
const linhaLancamento = d => `<div class="row"><span class="ty">${d.tipo}</span><div><b>${d.nome}</b><br><small>${d.data ? formatarData(d.data) : ""}</small></div><span class="vs">${d.versao || ""}</span><span class="pill ${d.url ? "" : "off"}">${d.url ? "Disponível" : "Em breve"}</span></div>`;

// Cartão de membro da equipe
const cartaoMembro = m => {
  const inicial = (m.nome.replace(/[^a-zA-Z0-9]/g, "")[0] || "?").toUpperCase();
  const avatar = m.foto
    ? `<img loading="lazy" src="${m.foto}" alt="Foto de ${m.nome}">`
    : inicial;
  const link = m.link
    ? `<a class="lk" href="${m.link}" target="_blank" rel="noopener" aria-label="Perfil de ${m.nome}">${ICONE_LINK}</a>`
    : `<span class="lk off" role="img" aria-label="Link ainda não informado">${ICONE_LINK}</span>`;
  return `
    <div class="cb"><div class="av">${avatar}</div>
    <div class="u">${m.nome}<small>${m.funcao}</small></div>
    ${link}</div>`;
};
