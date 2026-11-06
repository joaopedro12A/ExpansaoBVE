/* ==========================================================
   CONFIGURAÇÃO: edite aqui para adicionar conteúdo
   ========================================================== */
const CONFIG = {
  nome: "EXPANSÃO BVE",
  tipos: ["Rotas", "Trens"],

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
  // link: canal do YouTube (vazio deixa o ícone desativado)
  // instagram: opcional; só quem tiver esse campo mostra o botão do Instagram (vazio = desativado)
  equipe: [
    { nome: "Matheus Pictures", funcao: "",     foto: "./MP.jpg", link: "https://www.youtube.com/@matheuspictures" },
    { nome: "Nicolas Ferreira", funcao: "",           foto: "./NF.jpg", link: "https://www.youtube.com/@nicolasferreira2008", instagram: "https://www.instagram.com/nicolasfm2008/" },
    { nome: "TrenZL", funcao: "", foto: "./TrenZL.jpg", link: "https://www.youtube.com/@TrenZL" },
    { nome: "Nos Trilhos de São Paulo", funcao: "",           foto: "./NSP.jpg", link: "https://www.youtube.com/@NosTrilhosdeS%C3%A3oPaulo" },
    { nome: "Bus & Rail Brasil", funcao: "",      foto: "./BUS.jpg", link: "https://www.youtube.com/@bus..e..railbrasil/videos" },
    { nome: "José Barbosa", funcao: "",      foto: "", link: "" },
    { nome: "Mr.Paraty", funcao: "",      foto: "./MR.jpg", link: "https://www.youtube.com/@Mr.viacaoparaty" },
    { nome: "Hmmsim Mobilidade", funcao: "",      foto: "./HM.png", link: "https://www.youtube.com/@HmmsimMobilidade" },
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


