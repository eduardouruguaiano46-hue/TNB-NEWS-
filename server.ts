import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { generateAliceResponse } from './src/lib/alice';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ==================== ALICE LOCAL ENDPOINT ====================
// NO EXTERNAL API CALLS - Everything is local!
app.post('/api/alice', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida ou ausente.' });
    }

    // Generate response locally (no API call needed)
    const textOutput = generateAliceResponse(message.trim());
    
    return res.json({ 
      text: textOutput,
      source: 'alice-local', // Identify as local engine
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Erro na Alice AI:', err);
    return res.status(500).json({ 
      text: 'Desculpe, tive um breve desvio de intuição astral devido a uma falha interna. Tente novamente em instantes! 🔮',
      error: err.message,
      source: 'alice-local'
    });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'alive',
    alice: 'operational',
    gemini_dependency: 'REMOVED',
    timestamp: new Date().toISOString(),
  });
});

// ==================== FRONTEND SERVING ====================
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
    console.log(`\n🤖 TNB News Server - Alice Local Engine`);
    console.log(`📍 Servidor ativo em http://localhost:${PORT}`);
    console.log(`✨ Alice IA (Local) - Funcionando sem dependência da API Gemini!\n`);
  });
}

startServer();
