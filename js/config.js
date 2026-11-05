/* ==========================================================
   CONFIGURAÇÃO: edite aqui para adicionar conteúdo
   ========================================================== */
const CONFIG = {
  nome: "EXPANSÃO BVE",
  tipos: ["Rotas", "Trens", "Objetos", "Ferramentas"],

  // url vazia = "Em breve". Preencha url (e versão/tamanho) para liberar o download.
  downloads: [
    {
      nome: "Linha 5-Lilás — Padrão Motiva",
      tipo: "Rotas",
      versao: "",
      tamanho: "",
      data: "2026-11-20",
      img: "img/linha5.jpg",
      url: "",
      desc: "A Linha 5-Lilás do Metrô de São Paulo no padrão visual Motiva, com a Frota P, estações atualizadas e ambientação."
    }
  ],

  // foto: caminho da imagem (vazio mostra a inicial)
  // link: canal ou perfil (vazio deixa o ícone desativado)
  equipe: [
    { nome: "Nome do membro", funcao: "Coordenação",      foto: "", link: "" },
    { nome: "Nome do membro", funcao: "Rotas e cenários", foto: "", link: "" },
    { nome: "Nome do membro", funcao: "Modelagem 3D",     foto: "", link: "" },
    { nome: "Nome do membro", funcao: "Testes",           foto: "", link: "" }
  ]
};

// Páginas do menu: [id na URL (#id), texto exibido]
const PAGES = [
  ["home", "Início"],
  ["downloads", "Downloads"],
  ["instalar", "Como instalar"],
  ["equipe", "Equipe"]
];

// Imagens da faixa que passa: img/w-<nome>.png (silhuetas) e img/c-<nome>.png (logos coloridas); w-expansao e c-expansao = logo do Expansão BVE
const MQ = ["metro", "cptm", "motiva", "l6"]; // a faixa "sm" usa só o "expansao"
