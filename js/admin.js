/* ==========================================================
   ÁREA DA EQUIPE: login e edição dos downloads
   - A lista pública fica no arquivo downloads.json do site.
   - O painel grava nesse arquivo pela API do GitHub, usando o token
     (a "senha") de quem está logado. O site se republica sozinho.
   - Quem não tem acesso de escrita ao repositório não consegue editar.
   ========================================================== */

// Lista do config.js: usada se o downloads.json não carregar
const DOWNLOADS_PADRAO = CONFIG.downloads.slice();

const GH = window.GH_CONFIG || {};
const GH_CONFIGURADO = !!(GH.dono && GH.repo);

const adm = {
  token: "",
  usuario: null,     // nome no GitHub (null = sem login)
  lista: [],         // downloads como estão no arquivo (com id)
  sha: null,         // versão do arquivo no GitHub (exigida para gravar)
  carregou: false,
  view: "lista",     // "lista" ou "form"
  editando: null,    // id do download em edição (null = novo)
  info: ""
};

const CAMPOS = ["nome", "tipo", "versao", "tamanho", "data", "img", "url", "desc"];

const esc = v => String(v ?? "").replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Aceita vazio, http(s):// ou caminho relativo (ex.: img/foto.jpg). Bloqueia javascript:, data: etc.
const enderecoValido = v => !v || /^https?:\/\//i.test(v) || !/^[a-z][a-z0-9+.-]*:/i.test(v);

const porDataDesc = (a, b) =>
  (b.data || "").localeCompare(a.data || "") || (a.nome || "").localeCompare(b.nome || "");

const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* ----- Lista pública: aplica os dados no site ----- */
function aplicarDownloads(lista) {
  adm.lista = lista.map(d => ({ ...d, id: d.id || novoId() })).sort(porDataDesc);

  // Versão escapada para o HTML público
  CONFIG.downloads = adm.lista.map(d => {
    const seguro = { id: d.id };
    CAMPOS.forEach(c => { seguro[c] = esc(d[c]); });
    return seguro;
  });

  const pagina = (location.hash || "#home").slice(1);
  if (pagina === "downloads") renderizarLista();
  else if (pagina === "admin") { if (adm.view === "lista") renderAdmin(); }
  else if (!PAGINAS[pagina] || pagina === "home") rotear(true);
}

// Carrega o downloads.json publicado; se falhar, o site segue com o config.js
fetch((GH.arquivo || "downloads.json"), { cache: "no-cache" })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(lista => { if (Array.isArray(lista)) { adm.carregou = true; aplicarDownloads(lista); } })
  .catch(() => {});

/* ----- API do GitHub ----- */
async function gh(caminho, opcoes = {}) {
  const r = await fetch(`https://api.github.com/${caminho}`, {
    ...opcoes,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${adm.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opcoes.headers || {})
    }
  });
  if (!r.ok) { const e = new Error("gh"); e.status = r.status; throw e; }
  return r.json();
}

const repoPath = `repos/${GH.dono}/${GH.repo}`;
const arqPath = () => `${repoPath}/contents/${encodeURIComponent(GH.arquivo || "downloads.json")}`;

const paraBase64 = txt => {
  let bin = "";
  new TextEncoder().encode(txt).forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin);
};
const deBase64 = b64 =>
  new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));

// Lê a lista atual direto do repositório (sempre a versão mais nova)
async function lerLista() {
  try {
    const arq = await gh(`${arqPath()}?ref=${encodeURIComponent(GH.branch || "main")}`);
    adm.sha = arq.sha;
    const lista = JSON.parse(deBase64(arq.content) || "[]");
    aplicarDownloads(Array.isArray(lista) ? lista : []);
  } catch (e) {
    if (e.status === 404) { adm.sha = null; aplicarDownloads(DOWNLOADS_PADRAO); }
    else throw e;
  }
  adm.carregou = true;
}

// Grava a lista inteira no repositório
async function gravarLista(novaLista, mensagem) {
  const limpa = novaLista.map(d => {
    const o = { id: d.id || novoId() };
    CAMPOS.forEach(c => { o[c] = d[c] || ""; });
    return o;
  }).sort(porDataDesc);

  const corpo = {
    message: mensagem,
    content: paraBase64(JSON.stringify(limpa, null, 2) + "\n"),
    branch: GH.branch || "main"
  };
  if (adm.sha) corpo.sha = adm.sha;

  try {
    const r = await gh(arqPath(), { method: "PUT", body: JSON.stringify(corpo) });
    adm.sha = r.content.sha;
    aplicarDownloads(limpa);
  } catch (e) {
    if (e.status === 409 || e.status === 422) {
      await lerLista(); // alguém alterou o arquivo: recarrega a lista mais nova
      e.conflito = true;
    }
    throw e;
  }
}

/* ----- Sessão (o token fica só neste navegador) ----- */
const guardarToken = (token, lembrar) => {
  try {
    (lembrar ? localStorage : sessionStorage).setItem("gh_token", token);
    (lembrar ? sessionStorage : localStorage).removeItem("gh_token");
  } catch (e) {}
};
const apagarToken = () => {
  try { localStorage.removeItem("gh_token"); sessionStorage.removeItem("gh_token"); } catch (e) {}
};
const tokenGuardado = () => {
  try { return sessionStorage.getItem("gh_token") || localStorage.getItem("gh_token") || ""; } catch (e) { return ""; }
};

async function entrar(token, lembrar) {
  adm.token = token;
  const repo = await gh(repoPath);
  if (!repo.permissions || !repo.permissions.push) { const e = new Error("sem-permissao"); e.status = 403; throw e; }
  let nome = "GitHub";
  try { nome = (await gh("user")).login || nome; } catch (e) {}
  await lerLista();
  adm.usuario = nome;
  adm.view = "lista";
  adm.info = "";
  guardarToken(token, lembrar);
}

function sair() {
  adm.token = ""; adm.usuario = null; adm.view = "lista"; adm.info = "";
  apagarToken();
  renderAdmin();
}

/* ----- Mensagens de erro em português ----- */
function msgErro(e) {
  if (e && e.conflito) return "A lista foi alterada por outra pessoa. Recarregamos a versão mais nova; confira e tente de novo.";
  const s = e && e.status;
  if (s === 401) return "Token inválido ou expirado. Gere um novo no GitHub.";
  if (s === 403 || s === 404) return "Sem acesso ao repositório. Confira o token e se ele tem permissão de escrita em Contents.";
  if (s) return `O GitHub respondeu com erro ${s}. Tente novamente.`;
  return "Sem conexão com o GitHub. Verifique sua internet.";
}

/* ----- Telas ----- */
const htmlAviso = (titulo, texto) => `<div class="anote"><h3>${titulo}</h3><p>${texto}</p></div>`;

function htmlLogin() {
  return `<form class="af" id="af">
    <h3>Entrar</h3>
    <label>Senha (token de acesso do GitHub)<input type="password" id="at" required autocomplete="off" spellcheck="false"></label>
    <label class="ck"><input type="checkbox" id="alembrar"> Manter conectado neste computador</label>
    <p class="aerr" id="aerr" role="alert"></p>
    <div class="btns"><button class="btn" type="submit">Entrar</button></div>
  </form>`;
}

function htmlLista() {
  const linhas = adm.lista.map(d => `
    <div class="arow">
      <div><b>${esc(d.nome)}</b><small>${esc(d.tipo)}${d.data ? " · " + formatarData(d.data) : ""}${d.versao ? " · v" + esc(d.versao) : ""}</small></div>
      <span class="pill ${d.url ? "" : "off"}">${d.url ? "Disponível" : "Em breve"}</span>
      <div class="acts">
        <button class="btn o sm" data-a="editar" data-id="${esc(d.id)}">Editar</button>
        <button class="btn del sm" data-a="excluir" data-id="${esc(d.id)}">Excluir</button>
      </div>
    </div>`).join("");

  return `
    <div class="abar">
      <span class="who">Conectado como <b>${esc(adm.usuario)}</b></span>
      <button class="btn" data-a="novo">Novo download</button>
      <button class="btn o" data-a="sair">Sair</button>
    </div>
    <p class="ainfo" id="ainfo">${esc(adm.info)}</p>
    <div class="alist">${linhas || `<p class="lead">Nenhum download cadastrado ainda.</p>`}</div>`;
}

function htmlForm() {
  const d = adm.lista.find(x => x.id === adm.editando) || {};
  const opcoesTipo = CONFIG.tipos.map(t => `<option ${d.tipo === t ? "selected" : ""}>${esc(t)}</option>`).join("");
  return `<form class="df" id="df">
    <h3 class="full">${adm.editando ? "Editar download" : "Novo download"}</h3>
    <label class="full">Nome<input name="nome" required maxlength="200" value="${esc(d.nome)}"></label>
    <label>Tipo<select name="tipo">${opcoesTipo}</select></label>
    <label>Data<input type="date" name="data" value="${esc(d.data)}"></label>
    <label>Versão<input name="versao" maxlength="30" placeholder="1.0" value="${esc(d.versao)}"></label>
    <label>Tamanho<input name="tamanho" maxlength="30" placeholder="250 MB" value="${esc(d.tamanho)}"></label>
    <label class="full">Link do download <small>Deixe vazio para aparecer "Em breve"</small>
      <input name="url" placeholder="https://..." value="${esc(d.url)}"></label>
    <label class="full">Imagem <small>Endereço da imagem (https://... ou img/arquivo.jpg)</small>
      <input name="img" placeholder="img/linha5.jpg" value="${esc(d.img)}"></label>
    <label class="full">Descrição<textarea name="desc" maxlength="1900">${esc(d.desc)}</textarea></label>
    <p class="aerr full" id="aerr" role="alert"></p>
    <div class="btns full"><button class="btn" type="submit" id="asalvar">Salvar</button>
    <button class="btn o" type="button" data-a="cancelar">Cancelar</button></div>
  </form>`;
}

function renderAdmin() {
  const el = $("#adm");
  if (!el) return;

  if (!GH_CONFIGURADO) {
    el.innerHTML = htmlAviso("Painel ainda não configurado",
      "Preencha o dono e o nome do repositório em <b>js/github-config.js</b>. O passo a passo está em <b>LEIA-ME.md</b>.");
    return;
  }
  el.innerHTML = !adm.usuario ? htmlLogin() : adm.view === "form" ? htmlForm() : htmlLista();
}

// Se já havia um token guardado neste navegador, entra sozinho
const tokenLembrado = () => { try { return !!localStorage.getItem("gh_token"); } catch (e) { return false; } };
if (GH_CONFIGURADO && tokenGuardado()) {
  entrar(tokenGuardado(), tokenLembrado())
    .then(() => { if ((location.hash || "").slice(1) === "admin") renderAdmin(); })
    .catch(() => { adm.token = ""; apagarToken(); });
}

/* ----- Ações ----- */
function mostrarErro(msg) {
  const alvo = $("#aerr");
  if (alvo) alvo.textContent = msg;
}

document.addEventListener("submit", async e => {
  const f = e.target;

  if (f.id === "af") {
    e.preventDefault();
    const botao = f.querySelector("button[type=submit]");
    botao.disabled = true;
    mostrarErro("Entrando…");
    try {
      await entrar($("#at").value.trim(), $("#alembrar").checked);
      renderAdmin();
    } catch (err) {
      adm.token = "";
      mostrarErro(msgErro(err));
      botao.disabled = false;
    }
  }

  if (f.id === "df") {
    e.preventDefault();
    const dados = {};
    CAMPOS.forEach(c => { dados[c] = (f.elements[c].value || "").trim(); });
    if (!dados.nome) return mostrarErro("Informe o nome do download.");
    if (!enderecoValido(dados.url) || !enderecoValido(dados.img))
      return mostrarErro("Os links precisam começar com https:// (ou ser um caminho como img/foto.jpg).");

    const botao = $("#asalvar");
    botao.disabled = true;
    mostrarErro("Salvando…");
    try {
      const nova = adm.editando
        ? adm.lista.map(d => d.id === adm.editando ? { ...d, ...dados } : d)
        : [...adm.lista, { id: novoId(), ...dados }];
      await gravarLista(nova, `${adm.editando ? "Edita" : "Adiciona"} download: ${dados.nome}`);
      adm.view = "lista";
      adm.info = "Download salvo. Pode levar de 1 a 2 minutos para aparecer no site.";
      renderAdmin();
    } catch (err) {
      if (err.conflito) { adm.view = "lista"; adm.info = msgErro(err); renderAdmin(); }
      else { mostrarErro(msgErro(err)); botao.disabled = false; }
    }
  }
});

document.addEventListener("click", async e => {
  const b = e.target.closest("[data-a]");
  if (!b) return;
  const acao = b.dataset.a;

  if (acao === "sair") sair();

  else if (acao === "novo") { adm.view = "form"; adm.editando = null; adm.info = ""; renderAdmin(); }

  else if (acao === "editar") { adm.view = "form"; adm.editando = b.dataset.id; adm.info = ""; renderAdmin(); }

  else if (acao === "cancelar") { adm.view = "lista"; adm.info = ""; renderAdmin(); }

  else if (acao === "excluir") {
    const d = adm.lista.find(x => x.id === b.dataset.id);
    if (!d || !confirm(`Excluir "${d.nome}"? Isso não pode ser desfeito.`)) return;
    adm.info = "Excluindo…"; renderAdmin();
    try {
      await gravarLista(adm.lista.filter(x => x.id !== d.id), `Remove download: ${d.nome}`);
      adm.info = "Download excluído. Pode levar de 1 a 2 minutos para sumir do site.";
    } catch (err) { adm.info = msgErro(err); }
    renderAdmin();
  }
});
