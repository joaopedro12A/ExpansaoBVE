# Painel de downloads (sem Firebase)

A lista de downloads fica no arquivo `downloads.json`. O painel (`#admin`) edita
esse arquivo direto no seu repositório do GitHub; o site (GitHub Pages, Netlify
ou Vercel) se republica sozinho em 1 a 2 minutos.

## Antes de tudo
O código do site precisa estar em um repositório do GitHub, e a hospedagem
(Pages, Netlify ou Vercel) precisa publicar a partir dele.

## 1. Configurar o repositório
Abra `js/github-config.js` e preencha:
- `dono`: seu usuário (ou organização) no GitHub
- `repo`: nome do repositório
- `branch`: ramo que o site publica (`main` ou `master`)

## 2. Gerar sua senha (token)
1. GitHub > foto > **Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token**.
2. Nome: `Painel Expansão BVE`. Validade: a que preferir (ex.: 1 ano).
3. **Repository access > Only select repositories**: escolha só o repositório do site.
4. **Permissions > Repository permissions > Contents: Read and write**.
5. Clique em **Generate token** e **copie** (ele só aparece uma vez). Guarde num gerenciador de senhas.

## 3. Usar
1. Abra o site, clique em **Área da equipe** (rodapé).
2. Cole o token como senha e entre.
3. **Novo download**, **Editar** e **Excluir**. Cada gravação vira um commit no repositório.

## Segurança
- Só quem tem acesso de escrita ao repositório (e o token) consegue editar.
- O token fica apenas no seu navegador; "Manter conectado" guarda no computador. Use só em computador seu.
- Se o token vazar ou for perdido: revogue em Settings > Developer settings e gere outro.
- Para dar acesso a outra pessoa: convide-a como colaboradora do repositório; ela gera o próprio token.
- Imagens: informe o endereço (`img/arquivo.jpg`, enviando o arquivo ao repositório, ou um link https).
