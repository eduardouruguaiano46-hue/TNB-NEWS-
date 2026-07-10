# TNB News 📰 - Portal Oficial da Comunidade Tarot no Bolso (v33.33)

Bem-vindo ao repositório do **TNB News**, o portal oficial de notícias, artigos esotéricos, humor e bastidores da vibrante comunidade **Tarot no Bolso (TNB)**. Este projeto foi desenvolvido em **React (Vite) + Tailwind CSS** e está totalmente otimizado para produção.

---

## 🚀 O que é o TNB News?

O portal de notícias TNB News reúne as principais discussões internas da comunidade (fatos reais e descontraídos) e realiza uma varredura automática em mais de 39 portais de esoterismo confiáveis do Brasil para trazer leituras atualizadas de Tarot, Astrologia, Espiritualidade, Cristais, Mediunidade, Sonhos e Umbanda.

---

## 🎨 Principais Recursos do Portal

1. **Página Inicial Dinâmica**: Carrossel e grid de matérias comunitárias filtráveis com transições fluidas de estado (utilizando `motion`).
2. **Giro Esotérico Global**: Feed de notícias gerais sobre esoterismo com filtros rápidos de categoria (incluindo as novas seções de *Sonhos* e *Umbanda*).
3. **Escuta de Podcast Integrada**: Player de áudio dedicado com linha de tempo e suporte a controle de reprodução integrado.
4. **Modo Escuro / Claro Confortável**: Troca rápida de tema com armazenamento local persistente (`localStorage`) para conforto visual durante leituras noturnas.
5. **Seção de Comentários Funcional**: Discussões reais por artigo salvas no navegador do usuário para manter o engajamento sem necessidade de bancos complexos no protótipo de lançamento.
6. **Controle de Versão por Magnitude**: Changelog integrado demonstrando o histórico proporcional de entregas.

---

## 📂 Estrutura das 20 Matérias Oficiais (Consolidadas)

Seguindo rigorosamente as especificações de dados solicitadas, o portal conta com as seguintes matérias oficiais:

### 👥 Fatos da Comunidade (Principais)
* **Matéria #01**: Clara recebe críticas após participar de bolão interno da comunidade (Categoria: `Comunidade`, Imagem: `/images/bolao_clara_noruega_1783708704008.jpg`)
* **Matéria #02**: Repercussão do Bolão - Mensagens bem-humoradas movimentam a comunidade (Categoria: `Comunidade`, Imagem: `/images/humor_bolao_haaland_1783708715352.jpg`)
* **Matéria #03**: Autismo e Mistério: A história de Eduardo (Categoria: `Comunidade`, Imagem: `/images/eduardo_audio_autismo_1783708725187.jpg`)
* **Matéria #04**: O Caso Ioiô da Viih: Jejum, oração e baralho revelam "efeito amoroso" (Categoria: `Comunidade`, Imagem: `/images/caso_ioio_viih_1783708734188.jpg`)
* **Matéria #05**: O curioso caso de Moisés: Sumiço misterioso no grupo TNB (Categoria: `Comunidade`, Imagem: `/images/misterio_moises_1783708745879.jpg`)

### 🔮 Giro Esotérico Global (Feed de Artigos)
* **Matéria #06**: Tarô: Os Enamorados é a carta regente do segundo semestre de 2026 (Categoria: `Tarot`, Imagem: `/images/ext-1.jpg`)
* **Matéria #07**: Previsões de Tarot: A Torre em julho de 2026 sinaliza mudanças bruscas (Categoria: `Tarot`, Imagem: `/images/ext-2.jpg`)
* **Matéria #08**: Tarot Semanal: Ás de Paus traz energia de recomeços e iniciativa (Categoria: `Tarot`, Imagem: `/images/ext-3.jpg`)
* **Matéria #09**: Mercúrio Retrógrado em 2026: Datas e como se preparar para os desafios (Categoria: `Astrologia`, Imagem: `/images/ext-4.jpg`)
* **Matéria #10**: A Ascensão do Tarot de Marselha entre a Geração Z (Categoria: `Tarot`, Imagem: `/images/ext-5.jpg`)
* **Matéria #11**: A influência da Lua Cheia em Touro nas finanças (Categoria: `Astrologia`, Imagem: `/images/ext-6.jpg`)
* **Matéria #12**: Sincronicidade: O significado de ver números iguais como 11:11 (Categoria: `Espiritualidade`, Imagem: `/images/ext-7.jpg`)
* **Matéria #13**: Cristais de Proteção: Ametista e Turmalina Negra contra energias densas (Categoria: `Cristais`, Imagem: `/images/ext-8.jpg`)
* **Matéria #14**: Jejum Espiritual e os Chakras Superiores (Categoria: `Espiritualidade`, Imagem: `/images/ext-9.jpg`)
* **Matéria #15**: Mediunidade na Infância: Como acolher crianças altamente sensíveis (Categoria: `Mediunidade`, Imagem: `/images/ext-10.jpg`)
* **Matéria #16**: Métodos de Tiragem de Tarot: As 5 mais adequadas para cada situação (Categoria: `Tarot`, Imagem: `/images/ext-11.jpg`)
* **Matéria #17**: Significado Espiritual da Aranha: Criatividade e Destino (Categoria: `Espiritualidade`, Imagem: `/images/ext-12.jpg`)
* **Matéria #18**: Sonhar com Incêndio: Guia completo de interpretações (Categoria: `Sonhos`, Imagem: `/images/ext-13.jpg`)
* **Matéria #19**: Significado Espiritual do Rato: Inteligência e Sobrevivência (Categoria: `Espiritualidade`, Imagem: `/images/ext-14.jpg`)
* **Matéria #20**: Tipos de Pombagira na Umbanda e suas características (Categoria: `Umbanda`, Imagem: `/images/ext-15.jpg`)

---

## 🛠️ Portabilidade & Resolução de Erros em Produção (Netlify/Vercel)

Para evitar quaisquer problemas de carregamento de imagens no build de produção (como erros `404 Not Found` no Netlify ou Vercel por conta de caminhos locais relativos), todas as imagens do portal foram totalmente migradas para um CDN de alta performance.

**Resolução Definitiva aplicada (v33.33):**
- Todas as 20 matérias (fatos comunitários e notícias esotéricas) utilizam URLs absolutas hospedadas diretamente em CDN.
- Isso garante 100% de estabilidade de carregamento em qualquer ambiente de hospedagem estática, sem depender de assets locais no diretório do projeto e proporcionando carregamento ultra-rápido para os usuários do portal.
- **Aviso de Recesso e Contador Regressivo:** Implementação na página inicial do Comunicado Oficial sobre o Recesso de uma semana da comunidade e do site TNB News, acompanhado de um contador regressivo em tempo real programado para o encerramento em 17 de Julho de 2026 às 00h00.

---

## 💻 Como rodar o projeto localmente?

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Construa o projeto para produção:
   ```bash
   npm run build
   ```

---

## 🔗 Como Exportar para o GitHub a partir do Google AI Studio?

Para enviar todos os arquivos prontos e as novas alterações para o seu repositório do GitHub, siga o passo a passo abaixo:

1. No canto superior direito da interface do **Google AI Studio Build**, clique em **Configurações (ícone de engrenagem)**.
2. Selecione a opção **Exportar para o GitHub** (ou clique no botão correspondente de sincronização com o GitHub).
3. Conecte sua conta do GitHub caso ainda não esteja autenticado.
4. Escolha se deseja atualizar um repositório existente ou criar um novo repositório dedicado (ex: `TNB-News-Portal`).
5. Confirme o envio. O Google AI Studio irá empacotar todas as modificações consolidadas deste ambiente sandboxed diretamente para o seu repositório no GitHub!

---

## 🤖 Automação de Deploy Contínuo com GitHub Actions (Netlify)

O repositório já conta com um workflow automatizado em `.github/workflows/deploy.yml` que compila e publica o site automaticamente na Netlify a cada `git push` na branch `main`.

### Como Configurar as Credenciais no seu GitHub:

Para que a automação envie o build correto para o seu site na Netlify, você precisa adicionar dois **Secrets** no seu repositório do GitHub em `Settings` > `Secrets and variables` > `Actions` > `New repository secret`:

1.  **`NETLIFY_AUTH_TOKEN`**: Seu token pessoal de acesso Netlify. Obtenha em *User settings > Applications > Personal access tokens* no painel da Netlify.
2.  **`NETLIFY_SITE_ID`**: O ID exclusivo do seu site na Netlify. Encontre nas *Site settings > General > Site information* na Netlify.

Com esses dois Secrets salvos, qualquer nova atualização exportada pelo AI Studio para o seu GitHub disparará automaticamente o processo de build (`npm run build`) e atualizará o site em produção no Netlify sem que você precise fazer nada de forma manual!

---

## 📜 Licença

Este portal é um projeto exclusivo e proprietário da comunidade **Tarot no Bolso (TNB)**. Todos os direitos reservados.
