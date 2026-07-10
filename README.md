# 🔮 TNB News — Portal de Notícias Oficial da Comunidade TNB
> **O Jornalismo Verdade de Magnitude — Versão v20.00 (Lançamento Oficial)**

Bem-vindo ao repositório do **TNB News**, o portal oficial de notícias, fofocas esotéricas, bastidores e acontecimentos de magnitude da comunidade **Tarot no Bolso (TNB)**. Desenvolvido em **React**, **TypeScript**, **Tailwind CSS v4** e animado com **Motion**, este projeto oferece uma interface de altíssima fidelidade visual, com suporte nativo a temas e atualização dinâmica de informações.

---

## 📝 O que é o Site?

O **TNB News** é um portal de notícias dedicado a documentar os eventos cotidianos, as discussões espirituais, as fofocas dos bastidores místicos e os momentos marcantes da comunidade Tarot no Bolso (TNB). 

O portal foi construído sob uma proposta estética limpa, moderna e focada em leitura agradável. Ele combina o rigor do design de grandes jornais (usando fontes serifadas clássicas para títulos e tipografia mono para dados técnicos) com elementos dinâmicos interativos que simulam um ambiente editorial ativo e de alta magnitude.

---

## 🛠️ Todas as Funções Integradas no GitHub

O repositório do **TNB News** contém uma aplicação completa, modular e pronta para ser colocada no ar (deploy rápido). Abaixo estão detalhadas todas as funcionalidades implementadas no código:

### 1. 📰 Feed de Notícias Principal (Dinâmico)
* **Categorização em Abas**: Filtro rápido de matérias nas categorias:
  * **Todas**: Linha do tempo integrada.
  * **Factual**: Notícias reais e acontecimentos importantes.
  * **Fofoca**: Bastidores intrigantes da comunidade.
  * **Humor/Bolão**: O lado descontraído e apostas esportivas/místicas.
  * **Opinião**: Textos analíticos e editoriais.
  * **Giro Esotérico**: Notícias e insights espirituais rápidos.
* **Leitura na Íntegra**: Cada notícia possui um card customizado com imagens ilustrativas exclusivas de alta qualidade. Ao clicar em **"Ler na Íntegra"**, um modal imersivo abre para exibir a matéria completa formatada, incluindo metadados do autor, data e fonte.

### 2. 🌌 Quadro "Giro Esotérico Global"
* **Seção Dedicada**: Grid dinâmico que exibe notícias rápidas sobre *Astrologia, Tarot, Cristais, Espiritualidade e Mediunidade*.
* **21 Matérias Integradas**: Conteúdo rico e verídico baseado em 39+ portais confiáveis (como *Personare, Horóscopo Virtual, Bons Fluidos*, entre outros), disponível no arquivo modular `src/data/esotericNews.ts`.
* **Leitura Completa**: Integração de leitura rápida direto na interface, permitindo expandir cada detalhe místico sem sair do portal.

### 3. 📺 TNB TV & Mídia Integrada
* **Player de Vídeo**: Seção lateral com player embutido exibindo a entrega de prêmios reais para a comunidade, aproximando os leitores dos grandes acontecimentos.

### 4. 📱 Canal Oficial de Atendimento (Fale com a Redação)
* **Centralização WhatsApp**: Antiga seção de formulários simulados removida para evitar dispersão de dados.
* **Canal Único**: Direcionamento direto para o número oficial da redação: **(96) 99182-1516** via link do WhatsApp, ideal para:
  * Sugestões de matérias;
  * Informações sobre o grupo TNB;
  * Fofocas esotéricas;
  * Denúncias de supostos rituais inadequados;
  * Envio de relatos e acontecimentos.

### 5. 🌗 Personalização Visual & Dinâmica
* **Dark / Light Mode**: Alternância de tema com apenas um clique (ícones dinâmicos de sol/lua).
* **Data Dinâmica**: Exibição da data atual em formato brasileiro formal e horário UTC sincronizado.
* **Clima de Macapá/AP**: Informações meteorológicas em tempo real baseadas na localização principal de atendimento da redação.
* **Visualizadores Ativos**: Contador dinâmico que simula a audiência de magnitude do portal no momento.

---

## 📈 Log de Evolução e Atualizações (Regra de Ouro)

O versionamento deste aplicativo segue a **Lógica de Impacto por Magnitude**. Os saltos de versão representam a relevância das alterações visuais e estruturais para a experiência do usuário, em vez de uma sequência aritmética simples:

| Versão | Categoria de Impacto | Descrição das Entregas e Evoluções |
| :--- | :--- | :--- |
| **v20.00** | **Massiva (Atual)** | **Reorganização Estrutural para Lançamento**: Remoção de formulários internos e centralização exclusiva de pautas no canal oficial WhatsApp (96) 99182-1516. Desativação temporária do Painel de Discussão Comunitária para simplificação de banco de dados nesta fase de deploy inicial. |
| **v18.00** | **Substancial** | **Giro Esotérico Global**: Remoção de todos os dados de playground financeiro simulados. Criação do módulo de Giro Esotérico com 21 matérias exclusivas e ilustrações geradas por IA para todas as reportagens principais. |
| **v17.77** | **Histórica** | **Fatos de Magnitude**: Implementação do layout de jornal de prestígio, reorganização tipográfica baseada em fontes elegantes e suporte completo a temas claro e escuro. |
| **v12.9** | **Manutenção** | Versões anteriores do sistema de testes de templates e rascunhos iniciais da interface de rádio/TV. |

---

## 🚀 Guia de Lançamento no GitHub

Para colocar o seu site **TNB News** no ar e publicado no GitHub, siga as instruções passo a passo abaixo:

### 1. Inicializando o Repositório Localmente
Abra o seu terminal no diretório do projeto e execute os seguintes comandos para configurar o Git:

```bash
# Inicializar o Git
git init

# Adicionar todos os arquivos do projeto (respeitando o .gitignore)
git add .

# Criar o primeiro commit de lançamento oficial
git commit -m "feat: lançamento oficial do TNB News v20.00"

# Definir o branch principal como main
git branch -M main
```

### 2. Vinculando ao seu GitHub
1. Vá até o seu [GitHub](https://github.com) e clique em **New Repository** (Novo Repositório).
2. Dê o nome de `tnb-news` (ou o nome de sua preferência) e mantenha como **Public**. *Não marque as opções de adicionar README, .gitignore ou licença*, pois seu projeto já possui esses arquivos.
3. Copie o link do repositório gerado e vincule no terminal:

```bash
# Vincular o repositório remoto (substitua com o seu link do GitHub)
git remote add origin https://github.com/SEU_USUARIO/tnb-news.git

# Enviar o código para o GitHub
git push -u origin main
```

---

## 🌐 Como Hospedar o Site de Graça (Deploy)

Como o **TNB News** é uma SPA (Single Page Application) estática moderna compilada pelo Vite, ele pode ser hospedado **100% de graça** e de forma automática em plataformas de ponta.

### Opção A: Vercel (Recomendado pela facilidade)
1. Crie uma conta gratuita em [Vercel](https://vercel.com).
2. Clique em **Add New** > **Project** e conecte sua conta do GitHub.
3. Selecione o repositório `tnb-news` e clique em **Import**.
4. A Vercel detectará automaticamente que o projeto usa **Vite**. Basta clicar em **Deploy**!
5. Em menos de 1 minuto, seu site estará no ar com um link seguro HTTPS (ex: `tnb-news.vercel.app`).

### Opção B: Netlify
1. Crie uma conta gratuita em [Netlify](https://netlify.com).
2. Clique em **Add new site** > **Import from Git** e selecione o GitHub.
3. Escolha o repositório `tnb-news`.
4. As configurações de Build serão preenchidas automaticamente:
   * **Build Command**: `npm run build`
   * **Publish directory**: `dist`
5. Clique em **Deploy Site**. Seu portal estará online instantaneamente.

---

## 💻 Execução e Desenvolvimento Local

Para rodar ou modificar o projeto no seu computador:

### Pré-requisitos
* Ter o [Node.js](https://nodejs.org) instalado (versão 18 ou superior).

### Instalação e Execução
No diretório do projeto, execute:

```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento local
npm run dev
```

Abra o navegador em `http://localhost:3000` para visualizar o portal rodando localmente com hot-reload ativo.

Para gerar a versão otimizada de produção (arquivos estáticos finais em `/dist`):
```bash
npm run build
```

---

> 🔮 **TNB News** — Desenvolvido com carinho e focado em entregar jornalismo de verdade, magnitude e sofisticação para toda a comunidade Tarot no Bolso.
