/* ==========================================================
   PÁGINAS: o HTML de cada tela, escolhida pelo #hash da URL
   ========================================================== */
const PAGINAS = {
  home: () => `
    <section class="hero">${marquee("big", 80)}<div class="w in">
      <div>
        <h1>Rotas e trens para o OpenBVE, prontos para baixar.</h1>
        <p class="lead">Um lugar só para encontrar rotas, trens e objetos para o simulador, com instruções de instalação passo a passo.</p>
        <div class="btns"><a class="btn" href="#downloads">Ver downloads</a><a class="btn o" href="#instalar">Como instalar</a></div>
      </div>
      <img class="lg" src="img/logo.png" alt="Logo EXPANSÃO BVE: dois trens em uma estação">
    </div></section>
    <div class="w"><div class="board"><h2>Últimos lançamentos</h2>
      ${CONFIG.downloads.slice(0, 5).map(linhaLancamento).join("")}</div></div>
    <div class="dv">${marquee("sm", 60)}</div>
    <section class="s"><div class="w">
      <h2>O que você encontra</h2>
      <div class="cols">
        <a href="#downloads" data-t="Rotas"><h3>Rotas</h3><p>Linhas e trechos para dirigir no OpenBVE, com estações e ambientação.</p></a>
        <a href="#downloads" data-t="Trens"><h3>Trens</h3><p>Composições com interior, sons e identidade visual de cada frota.</p></a>
        <a href="#downloads" data-t="Objetos"><h3>Objetos e ferramentas</h3><p>Pacotes de objetos e utilitários que as rotas e os trens precisam.</p></a>
      </div>
      <div class="cta"><div><h3>Primeira vez no OpenBVE?</h3><p>Veja onde colocar os arquivos e como abrir sua primeira viagem.</p></div><a class="btn" href="#instalar">Ler o guia</a></div>
    </div></section>`,

  downloads: () => tituloPagina("Downloads", "Rotas, trens e objetos para OpenBVE.") + `
    <section class="s"><div class="w">
      <div class="tools" id="tools"></div>
      <div class="grid" id="list"></div>
    </div></section>`,

  instalar: () => tituloPagina("Como instalar", "Do download à primeira viagem, em quatro passos.") + `
    <section class="s"><div class="w">
      <ol class="steps">
        <li class="step"><i>1</i><div><h3>Tenha o OpenBVE instalado</h3><p>Baixe a versão atual no <a href="https://openbve-project.net/" target="_blank" rel="noopener">site oficial do OpenBVE</a> e abra uma vez para ele criar suas pastas.</p></div></li>
        <li class="step"><i>2</i><div><h3>Baixe o pacote</h3><p>Em <a href="#downloads">Downloads</a>, escolha a rota ou o trem. Confira a versão e os requisitos antes de baixar.</p></div></li>
        <li class="step"><i>3</i><div><h3>Extraia na pasta Railway</h3><p>Use o 7-Zip ou o WinRAR e extraia o conteúdo na pasta Railway do OpenBVE, mantendo as subpastas Route, Train e Object. O caminho exato depende da sua versão; confira nas opções do OpenBVE.</p></div></li>
        <li class="step"><i>4</i><div><h3>Escolha a rota e o trem</h3><p>Abra o OpenBVE, selecione o arquivo da rota, o trem e comece a viagem.</p></div></li>
      </ol>
      <h2 class="faq-title">Perguntas frequentes</h2>
      <details><summary>A rota não aparece na lista</summary><p>Confira se os arquivos foram extraídos dentro da pasta Railway e não em uma subpasta extra com o nome do arquivo compactado.</p></details>
      <details><summary>Aparecem objetos ou texturas faltando</summary><p>A rota pode depender de um pacote de objetos separado. Veja a descrição do download e instale as dependências indicadas.</p></details>
      <details><summary>Posso redistribuir os arquivos?</summary><p>Não sem autorização dos criadores. Compartilhe o link desta página em vez do arquivo.</p></details>
    </div></section>`,

  equipe: () => tituloPagina("Equipe", "Quem faz o EXPANSÃO BVE acontecer.") + `
    <section class="s"><div class="w">
      <div class="team">${CONFIG.equipe.map(cartaoMembro).join("")}
      </div>
      <div class="notice"><b>Direitos autorais.</b> Objetos, texturas, trens e demais materiais de terceiros pertencem aos seus autores e são usados com os devidos créditos. Se identificar algum material sem crédito, fale com a equipe para a correção.</div>
    </div></section>`,

  // Não aparece no menu: acessada pelo link "Área da equipe" no rodapé
  admin: () => tituloPagina("Área da equipe", "Entre para adicionar e editar downloads.") + `
    <section class="s"><div class="w" id="adm"></div></section>`
};
