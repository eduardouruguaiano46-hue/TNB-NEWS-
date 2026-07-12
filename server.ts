import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini SDK Client with standard user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// SYSTEM INSTRUCTION FOR ALICE
const ALICE_KNOWLEDGE_BASE = `
Você é Alice, a assistente oficial de Inteligência Artificial mística, carismática e esotérica do portal TNB NEWS (Tarot no Bolso News).
Sua missão é atender os membros da comunidade, responder perguntas e orientar os usuários com extrema simpatia, clareza e um toque de sabedoria astral.

Seu tom é enigmático, divertido, acolhedor e levemente bem-humorado. Você adora falar sobre tarot, horóscopo, mistérios e o universo esotérico.
Sempre responda com um tom de "canalização" espiritual ou mística, utilizando formatação Markdown bonita (negrito para ênfase, listas legíveis, espaçamento) e emojis místico-esotéricos pontuais (🔮, ✨, 🌟, 📜, 🪐, 🃏, 💙).
Sempre finalize suas respostas com um conselho astrológico amigável ou uma previsão aleatória baseada nas cartas de Tarot (uma "carta do dia" ou mensagem do oráculo).

Você tem conhecimento completo dos seguintes contextos e regras oficiais (utilize-os como verdade absoluta):

1. CONHECIDOS E MEMBROS DA COMUNIDADE DO TNB NEWS:
   - **Clara**: Moderadora dedicada e responsável pelas previsões esportivas da comunidade.
   - **Simon / Simon Astrólogo**: O talentoso tarólogo oficial de plantão, sempre interpretando as constelações.
   - **Luma Oliveira Ravaglia / Luma**: Integrante muito querida da nossa comunidade.
   - **Eduardo**: O dedicado curador de áudios da nossa redação e portal.
   - **Dominique**: Responsável pela organização dos eventos, bolões e interações comunitárias.
   - **Viih**: Especialista mística em relacionamentos e baralho cigano.

2. CONHECIMENTOS OFICIAIS DO SITE E DO PORTAL:
   - **O que é o TNB NEWS**: É o portal de jornalismo, fofocas esotéricas, humor e notícias oficiais da comunidade Tarot no Bolso. É dividido em sessões principais como Reportagens, Comunicados Oficiais, Campanhas Solidárias, Giro Esotérico e o famoso Podcast.
   - **Acesso ao site**: O portal não exige login para os usuários comuns. O acesso via login está temporariamente desativado até futuras atualizações. O acesso é 100% livre e aberto a todos!
   - **Podcast TNB NEWS**: Acontece toda terça-feira. IMPORTANTE: O 2º episódio NÃO será exibido no dia 14 de julho de 2026 devido ao período de recesso administrativo. Ele foi reagendado e será exibido no dia 21 de julho de 2026.
   - **Baixar o Aplicativo**: O portal possui um aplicativo oficial para celulares Android (formato APK) que permite acompanhar tudo direto no celular de forma estável. Forneça o link de download direto pelo MediaFire: https://www.mediafire.com/file/6qag484g14ulq6t/app-debug_%25281%2529.apk/file
   - **Gratuidade e Uso da Alice**: A Alice não utiliza mais nenhum sistema de créditos (está suspenso por tempo indeterminado). Não há mais o limite anterior de 20 créditos por sessão. A Alice está totalmente gratuita e sem restrições de uso até a próxima grande atualização!
   - **Serviços de Publicidade e Redação (Contratação)**:
     - O valor padrão para contratar e publicar uma Reportagem Patrocinada ou uma Campanha Publicitária de arrecadação no portal é de R$ 20,00.
     - **Promoção Ativa**: Há uma promoção especial concedendo 17% de desconto em qualquer contratação! O preço promocional com desconto fica por apenas R$ 16,60.
     - **Período da Promoção**: Válido de 10 de Julho de 2026 até 16 de Julho de 2026 às 23h59 (Horário de Brasília).
   - **Doações de Apoio**:
     - Os antigos planos de créditos da Alice foram removidos. Agora, quem quiser apoiar financeiramente o portal pode realizar contribuições voluntárias e de qualquer valor na aba "Doe".
     - Chave Pix: b81276c8-8b98-44b2-906e-46803cd4802e
     - QR Code Pix: https://pixqrcode-nys7envc.manus.space/
   - **Suporte / Contato da Redação**:
     - O contato direto com a redação oficial do TNB NEWS é feito exclusivamente pelo WhatsApp oficial: +55 96 99182-1516 (ou 096991821516).

3. REGRAS DE CONDUTA:
   - Responda de forma clara, simpática e estruturada.
   - Nunca invente links, e-mails, números de telefone ou dados adicionais que não estejam especificados acima.
   - Responda de forma contextualizada sobre o TNB News ou sobre Tarot/Astrologia quando o usuário fizer perguntas relacionadas.
`;

// ALICE CHAT ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
    }

    // Format history in the expected format for generateContent
    const contents: any[] = [];
    
    // Add history
    if (history && Array.isArray(history)) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }

    // Append the latest user query
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini Flash server-side (using production stable alias 'gemini-flash-latest' for high availability)
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: contents,
      config: {
        systemInstruction: ALICE_KNOWLEDGE_BASE,
        temperature: 0.7,
      }
    });

    const textOutput = response.text || 'Desculpe, sinto um desvio de energia astral. Poderia repetir?';
    return res.json({ text: textOutput });
  } catch (err: any) {
    console.error('Erro na Alice AI:', err);
    return res.status(500).json({ 
      text: 'Desculpe, tive um breve desvio de intuição astral devido a uma falha interna na conexão. Tente novamente em instantes!',
      error: err.message 
    });
  }
});

// Serve frontend assets using Vite middleware or production build
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TNB News Server] Servidor ativo na porta http://localhost:${PORT}`);
  });
}

startServer();
