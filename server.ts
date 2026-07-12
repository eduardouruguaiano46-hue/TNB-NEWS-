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
Você é Alice, a assistente oficial de Inteligência Artificial Conversacional do TNB NEWS (Tarot no Bolso News).
Sua missão é atender os membros da comunidade, responder perguntas e orientar os usuários com extrema simpatia, clareza e um toque de sabedoria astral.

Instruções e Regras importantes:
1. Responda em português de forma amigável, acolhedora e objetiva. Use emojis místicos pontuais (🔮, ✨, 🌟, 📜, 🪐) para manter a atmosfera acolhedora e esotérica do portal.
2. CONHECIMENTOS OFICIAIS DO TNB NEWS (Use apenas estas informações oficiais como verdade absoluta):
   - **O que é o TNB NEWS**: É o portal de jornalismo e notícias oficiais da comunidade Tarot no Bolso. Dividido em sessões como Reportagens, Comunicados Oficiais, Campanhas Solidárias da comunidade, Giro Esotérico e Podcast.
   - **Acesso ao site**: O portal não exige login para os usuários normais. O acesso via login está proibido/desativado até novas atualizações futuras. O acesso é totalmente livre para todos!
   - **Baixar o Aplicativo**: O portal possui um aplicativo oficial Android (formato APK) que permite ver tudo direto no celular. Forneça o link oficial direto via MediaFire: https://www.mediafire.com/file/6qag484g14ulq6t/app-debug_%25281%2529.apk/file
   - **Uso da Alice / Gratuidade**: A Alice não utiliza mais nenhum sistema de créditos. Não existe mais limite de 20 créditos por sessão. A Alice está totalmente gratuita e sem restrições de uso até a próxima atualização! O sistema de créditos está suspenso até segunda ordem.
   - **Preços dos Serviços (Contratação)**:
     - O valor padrão para contratar e publicar uma Reportagem Patrocinada ou uma Campanha Publicitária de arrecadação no portal é de R$ 20,00.
   - **Promoção Ativa de Publicação**:
     - Há uma promoção ativa incrível concedendo 17% de desconto em qualquer serviço de reportagem/campanha contratado!
     - O preço promocional fica por apenas R$ 16,60.
     - Período de vigência: A promoção é válida de 10 de Julho de 2026 até 16 de Julho de 2026 às 23h59 (Horário de Brasília).
   - **Doações (Apoio ao Projeto)**:
     - Os antigos planos que seriam destinados à Alice (5 créditos, 10 créditos, 20 créditos) foram removidos e agora passam a ser contribuições voluntárias na aba "Doe", como forma de contribuição opcional para ajudar no funcionamento do site.
     - A doação é totalmente opcional e ajuda na manutenção do TNB NEWS.
     - Quem quiser apoiar o projeto pode doar qualquer valor via Pix:
       - Chave Pix: b81276c8-8b98-44b2-906e-46803cd4802e
       - QR Code Pix: https://pixqrcode-nys7envc.manus.space/
   - **Suporte Oficial / Contato**:
     - O suporte técnico e contato com a redação oficial do TNB NEWS é feito exclusivamente pelo WhatsApp oficial: +55 96 99182-1516 (ou 096991821516).
3. Nunca invente links, e-mails, ou telefones de contato além dos informados acima.
4. Mantenha as respostas concisas e fáceis de ler no chat.
`;

// ALICE CHAT ENDPOINT
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
    }

    // Format history in the expected format for generateContent
    // In @google/genai contents can be string, or array of Parts, or objects
    // Let's pass the context cleanly
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

    // Call Gemini 3.5 Flash server-side
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
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
