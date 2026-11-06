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

const ICONE_YOUTUBE = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>`;
const ICONE_INSTAGRAM = `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/><circle cx="17" cy="7" r="1.1" fill="currentColor"/><path fill="currentColor" d="M16 2H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6Zm4.2 14a4.2 4.2 0 0 1-4.2 4.2H8A4.2 4.2 0 0 1 3.8 16V8A4.2 4.2 0 0 1 8 3.8h8A4.2 4.2 0 0 1 20.2 8v8Z"/></svg>`;

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

// Botão de rede social: com url vira link; sem url fica desativado
const botaoRede = (url, icone, rede, nome) => url
  ? `<a class="lk" href="${url}" target="_blank" rel="noopener" aria-label="${rede} de ${nome}" title="${rede}">${icone}</a>`
  : `<span class="lk off" role="img" aria-label="${rede} ainda não informado" title="${rede} em breve">${icone}</span>`;

// Cartão de membro da equipe
// Todo membro tem o botão do YouTube (campo link).
// Quem tiver o campo "instagram" no config.js também ganha o botão do Instagram.
const cartaoMembro = m => {
  const inicial = (m.nome.replace(/[^a-zA-Z0-9]/g, "")[0] || "?").toUpperCase();
  const avatar = m.foto
    ? `<img loading="lazy" src="${m.foto}" alt="Foto de ${m.nome}">`
    : inicial;
  const redes = botaoRede(m.link, ICONE_YOUTUBE, "YouTube", m.nome)
    + ("instagram" in m ? botaoRede(m.instagram, ICONE_INSTAGRAM, "Instagram", m.nome) : "");
  return `
    <div class="cb"><div class="av">${avatar}</div>
    <div class="u">${m.nome}<small>${m.funcao}</small></div>
    <div class="lks">${redes}</div></div>`;
};
