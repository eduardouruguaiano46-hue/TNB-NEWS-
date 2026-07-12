import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  Settings, 
  History, 
  RefreshCw, 
  Download, 
  Plus, 
  Coins, 
  BarChart2, 
  AlertCircle, 
  ChevronRight, 
  Trash2, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AliceTabProps {
  user: any | null;
  onOpenAuth: () => void;
  onSwitchTab: (tab: string) => void;
}

interface Message {
  role: 'user' | 'alice';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
  tone: 'profissional' | 'casual' | 'criativo';
  specialty: 'vendas' | 'atendimento' | 'marketing';
}

export default function AliceTab({ user, onOpenAuth, onSwitchTab }: AliceTabProps) {
  // Navigation internal
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'history' | 'settings'>('chat');
  
  // Track free messages usage count in localStorage (max 20 messages limit)
  const [usageCount, setUsageCount] = useState<number>(0);
  
  // Current chat state
  const [activeSessionId, setActiveSessionId] = useState<string>('default');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'alice',
      text: 'Olá! Sou a Alice, sua assistente de inteligência artificial esotérica e profissional do TNB NEWS. Estou aqui para te ajudar em suas consultas, estratégias de marketing, atendimento ao cliente ou simplesmente para responder suas dúvidas astrológicas! O site agora possui acesso 100% livre sem exigência de login, e eu estou gratuita por tempo limitado! Como posso ajudar você hoje? 🔮✨',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Configuration values
  const [selectedTone, setSelectedTone] = useState<'profissional' | 'casual' | 'criativo'>('profissional');
  const [selectedSpecialty, setSelectedSpecialty] = useState<'vendas' | 'atendimento' | 'marketing'>('atendimento');

  // Statistics
  const [stats, setStats] = useState({
    conversasHoje: 1,
    mensagensTrocadas: 1,
    economiaTempo: '15min'
  });

  // Load configuration and usage from local storage on mount
  useEffect(() => {
    const savedTone = localStorage.getItem('alice_selected_tone') as any;
    const savedSpecialty = localStorage.getItem('alice_selected_specialty') as any;
    if (savedTone) setSelectedTone(savedTone);
    if (savedSpecialty) setSelectedSpecialty(savedSpecialty);

    const savedUsage = localStorage.getItem('tnb_alice_free_usage_v3');
    if (savedUsage) {
      setUsageCount(parseInt(savedUsage, 10));
    }
  }, []);

  // Load dynamic stats based on local storage
  const updateStats = () => {
    const savedSessions = localStorage.getItem('tnb_alice_conversations_v1');
    if (savedSessions) {
      const sessions: Conversation[] = JSON.parse(savedSessions);
      let totalMessages = 0;
      sessions.forEach(s => totalMessages += s.messages.length);
      
      setStats({
        conversasHoje: Math.max(1, sessions.length),
        mensagensTrocadas: Math.max(1, totalMessages),
        economiaTempo: `${Math.max(15, Math.floor(totalMessages * 2.5))}min`
      });
    }
  };

  useEffect(() => {
    updateStats();
  }, [messages, activeSessionId]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSubTab]);

  // Auto-save conversations in LocalStorage when messages update
  useEffect(() => {
    const savedSessions = localStorage.getItem('tnb_alice_conversations_v1');
    let sessions: Conversation[] = savedSessions ? JSON.parse(savedSessions) : [];
    
    const existingIndex = sessions.findIndex(s => s.id === activeSessionId);
    if (existingIndex >= 0) {
      sessions[existingIndex].messages = messages;
      sessions[existingIndex].updatedAt = new Date().toLocaleString('pt-BR');
      sessions[existingIndex].tone = selectedTone;
      sessions[existingIndex].specialty = selectedSpecialty;
    } else {
      // Create fresh one
      const newSession: Conversation = {
        id: activeSessionId,
        title: messages[1]?.text?.substring(0, 30) || 'Nova Consulta com Alice',
        messages: messages,
        updatedAt: new Date().toLocaleString('pt-BR'),
        tone: selectedTone,
        specialty: selectedSpecialty
      };
      sessions.unshift(newSession);
    }

    localStorage.setItem('tnb_alice_conversations_v1', JSON.stringify(sessions));
  }, [messages, activeSessionId, selectedTone, selectedSpecialty]);

  const handleSendMessage = async (e?: React.FormEvent, predefinedMessage?: string) => {
    if (e) e.preventDefault();

    const messageToSend = predefinedMessage || inputMessage;
    if (!messageToSend.trim() || loading) return;

    // O sistema de créditos foi suspenso até segunda ordem. Alice está 100% gratuita sem limites de consultas!
    const userText = messageToSend.trim();
    if (!predefinedMessage) setInputMessage('');

    const userMsg: Message = {
      role: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Increment and persist usage count locally
      const nextUsage = usageCount + 1;
      setUsageCount(nextUsage);
      localStorage.setItem('tnb_alice_free_usage_v3', nextUsage.toString());

      // Map history for Gemini API payload
      const historyPayload = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      // Add a customized instruction injected into context based on settings
      const personaInstruction = `Responda utilizando um tom de voz "${selectedTone}" e como especialista em "${selectedSpecialty}".`;
      const finalMessageWithContext = `${userText} (${personaInstruction})`;

      // Request response from backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: finalMessageWithContext, history: historyPayload })
      });

      if (!response.ok) {
        throw new Error('Falha astral ao contatar a Alice.');
      }

      const data = await response.json();
      
      const aliceMsg: Message = {
        role: 'alice',
        text: data.text || 'Desculpe, sinto um desvio de energia astral. Poderia repetir?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aliceMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: Message = {
        role: 'alice',
        text: 'Sinto muito, houve uma instabilidade em meus circuitos espirituais devido a uma falha na canalização. Tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewConversation = () => {
    const newId = `session_${Date.now()}`;
    setActiveSessionId(newId);
    setMessages([
      {
        role: 'alice',
        text: `Olá! Iniciamos uma nova sessão com tom "${selectedTone}" e especialidade "${selectedSpecialty}". Como posso lhe guiar nesta jornada?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setActiveSubTab('chat');
  };

  const handleLoadSession = (session: Conversation) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setSelectedTone(session.tone || 'profissional');
    setSelectedSpecialty(session.specialty || 'atendimento');
    setActiveSubTab('chat');
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const savedSessions = localStorage.getItem('tnb_alice_conversations_v1');
    if (savedSessions) {
      let sessions: Conversation[] = JSON.parse(savedSessions);
      sessions = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem('tnb_alice_conversations_v1', JSON.stringify(sessions));
      
      if (activeSessionId === sessionId) {
        handleStartNewConversation();
      } else {
        updateStats();
      }
    }
  };

  const handleExportConversation = () => {
    const content = messages.map(m => `${m.role === 'user' ? 'Você' : 'Alice'} [${m.timestamp}]: ${m.text}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversa_alice_ai_${activeSessionId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('alice_selected_tone', selectedTone);
    localStorage.setItem('alice_selected_specialty', selectedSpecialty);
    alert('Configurações de personalidade da Alice salvas com sucesso! As próximas mensagens seguirão esta calibração.');
  };

  // Predefined prompt suggestions
  const SUGGESTED_PROMPTS = [
    { title: "Previsão do Signo", text: "Qual a previsão astrológica para o meu signo hoje?" },
    { title: "Apoiar Projeto", text: "Como posso apoiar o TNB NEWS com uma doação Pix?" },
    { title: "Como Publicar", text: "Como faço para anunciar ou publicar no portal TNB NEWS?" },
    { title: "Aplicativo Oficial", text: "Onde posso baixar o APK oficial do app do TNB NEWS?" }
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl overflow-hidden mb-12">
      
      {/* 1. BRAND HEADER WITH VIBRANT IDENTITY */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-indigo-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-500 p-0.5 shadow-lg flex items-center justify-center animate-pulse shrink-0">
            <div className="w-full h-full rounded-2xl bg-indigo-950 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl md:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-200">
                Alice AI
              </h2>
              <span className="bg-pink-500/20 text-pink-300 font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-pink-500/20">
                Oficial v89.99
              </span>
            </div>
            <p className="text-indigo-200 text-xs font-serif mt-1 max-w-lg leading-relaxed">
              O oráculo cibernético e assistente estratégica do TNB NEWS. Acesso 100% livre, sem login e totalmente gratuita.
            </p>
          </div>
        </div>

        {/* Real-time Usage status indicator */}
        <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto bg-indigo-950/40 p-3 rounded-2xl border border-indigo-500/20 shrink-0">
          <div className="bg-gradient-to-r from-indigo-500/20 to-pink-500/20 p-2.5 rounded-xl border border-indigo-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider block font-bold">Uso da Alice IA</span>
            <span className="text-sm font-mono font-bold text-green-400 flex items-center gap-1.5">
              Uso Gratuito & Ilimitado
            </span>
          </div>
          <button
            onClick={() => onSwitchTab('contratar')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 active:scale-95 text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            id="btn-alice-apoie-topo"
          >
            Doe
          </button>
        </div>
      </div>

      {/* 2. TAB SUB-NAVIGATION */}
      <div className="px-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-wrap items-center justify-between gap-4">
        <nav className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none gap-2" id="nav-alice-subtabs">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'chat' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
            }`}
            id="subnav-alice-chat"
          >
            <MessageSquare className="w-4 h-4" />
            Chat com Alice
          </button>
          
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'history' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
            }`}
            id="subnav-alice-history"
          >
            <History className="w-4 h-4" />
            Histórico
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeSubTab === 'settings' 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
            }`}
            id="subnav-alice-settings"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>
        </nav>

        {/* Personality indicators */}
        <div className="py-2 flex items-center gap-2.5 font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
          <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">Personalidade ativa:</span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded capitalize font-bold">
            {selectedTone}
          </span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded capitalize font-bold">
            {selectedSpecialty}
          </span>
        </div>
      </div>

      {/* 3. SUB-TAB VIEWPORT PORTAL */}
      <div className="p-6">
        
        {/* ==================== SUB-TAB 1: ACTIVE CHAT ==================== */}
        {activeSubTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT COLUMN: ACTIVE CHAT AREA */}
            <div className="lg:col-span-8 flex flex-col border border-neutral-150 dark:border-neutral-850 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30 overflow-hidden min-h-[500px]">
              
              {/* Chat subheader */}
              <div className="bg-white dark:bg-neutral-900 border-b border-neutral-150 dark:border-neutral-850 px-4 py-3.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    Sessão Ativa: <span className="text-indigo-600 dark:text-indigo-400">{activeSessionId === 'default' ? 'Sessão Inicial' : 'Sessão Personalizada'}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportConversation}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Exportar conversa"
                    id="btn-alice-export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStartNewConversation}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer"
                    title="Iniciar nova consulta"
                    id="btn-alice-nova-sessao"
                  >
                    <Plus className="w-3 h-3" />
                    Nova
                  </button>
                </div>
              </div>

              {/* Chat Message Lists */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px] min-h-[280px]">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex gap-2.5 max-w-[85%] items-start">
                      {msg.role === 'alice' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shrink-0 mt-0.5 animate-pulse">
                          <Sparkles className="w-4.5 h-4.5" />
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs font-serif whitespace-pre-line ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-white rounded-tr-none'
                              : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-150 dark:border-neutral-800 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div className={`text-[9px] font-mono text-neutral-400 px-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {msg.timestamp}
                        </div>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shrink-0 mt-0.5 font-mono text-xs font-bold border border-neutral-300 dark:border-neutral-700">
                          U
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2.5 max-w-[85%] items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white shrink-0 animate-spin-slow">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                        <span className="animate-pulse">Canalizando intuição astral...</span>
                        <div className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Quick bar */}
              <div className="px-4 py-2 bg-white dark:bg-neutral-900/80 border-t border-neutral-150 dark:border-neutral-850 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(undefined, prompt.text)}
                    className="px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-950 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-100/60 dark:hover:bg-indigo-950/40 font-bold transition-all cursor-pointer shrink-0"
                    id={`btn-alice-prompt-${idx}`}
                  >
                    {prompt.title}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-150 dark:border-neutral-850 flex gap-2">
                <input
                  type="text"
                  placeholder="Pergunte à Alice... (Ex: 'Qual meu signo hoje?')"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-850 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-neutral-900 text-neutral-800 dark:text-neutral-100 disabled:opacity-60 font-mono"
                  id="input-alice-chat"
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  id="btn-alice-enviar"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar
                </button>
              </form>

              {/* Bottom Warning disclaimer bar */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 px-4 py-2 border-t border-neutral-150 dark:border-neutral-850 text-[10px] font-mono text-indigo-700 dark:text-indigo-400 flex justify-between items-center">
                <span>⚡ Uso da IA: Totalmente Gratuito & Ilimitado ({usageCount} consultas realizadas)</span>
                <span>Chave PIX e QR Code na aba Apoio & Serviços</span>
              </div>
            </div>

            {/* RIGHT COLUMN: ANALYTICS & STATS & QUICK INFO */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Box 1: Stats Panel */}
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-white">
                    Uso da Alice AI
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-150 dark:border-neutral-850">
                    <span className="text-[9px] text-neutral-400 font-mono uppercase block">Sessões Ativas</span>
                    <span className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {stats.conversasHoje}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-150 dark:border-neutral-850">
                    <span className="text-[9px] text-neutral-400 font-mono uppercase block">Mensagens</span>
                    <span className="text-lg font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {stats.mensagensTrocadas}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-150 dark:border-neutral-850 col-span-2">
                    <span className="text-[9px] text-neutral-400 font-mono uppercase block">Status de Gratuidade</span>
                    <span className="text-xs font-mono font-bold text-green-500 block mt-0.5 uppercase">
                      Totalmente Gratuita & Ilimitada 🎉
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-serif text-neutral-500 leading-relaxed">
                  Consulte a Alice livremente. O histórico de mensagens é persistido de forma segura no seu navegador.
                </div>
              </div>

              {/* Box 2: Plans Showcase converted to Donation Showcase */}
              <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-4.5 h-4.5 text-pink-500" />
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                    Apoiar via Doação
                  </h3>
                </div>

                <p className="text-xs font-serif text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Como forma de manter o portal independente e a Alice gratuita, removemos as cobranças por créditos. Agora você pode apoiar voluntariamente de forma opcional:
                </p>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-150 dark:border-neutral-850">
                    <span className="text-neutral-800 dark:text-neutral-200">Contribuição Simples</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">R$ 5,00</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-150 dark:border-neutral-850">
                    <span className="text-neutral-800 dark:text-neutral-200">Contribuição Especial</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">R$ 10,00</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-150 dark:border-neutral-850">
                    <span className="text-neutral-800 dark:text-neutral-200">Contribuição Generosa</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">R$ 20,00</span>
                  </div>
                </div>

                <button
                  onClick={() => onSwitchTab('contratar')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider text-center transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  id="btn-alice-doe-sidebar"
                >
                  Ir para a Área de Doações
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ==================== SUB-TAB 2: HISTORICAL CONVERSATIONS ==================== */}
        {activeSubTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-bold text-neutral-800 dark:text-white uppercase tracking-tight">
                Histórico de Consultas com Alice AI
              </h3>
              <button
                onClick={handleStartNewConversation}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                id="btn-history-nova-conversa"
              >
                <Plus className="w-4 h-4" />
                Nova Conversa
              </button>
            </div>

            {/* List of sessions saved */}
            {(() => {
              const saved = localStorage.getItem('tnb_alice_conversations_v1');
              const sessions: Conversation[] = saved ? JSON.parse(saved) : [];
              
              if (sessions.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-neutral-200 dark:border-neutral-850 rounded-2xl text-center p-6 bg-neutral-50/50 dark:bg-neutral-950/10">
                    <History className="w-12 h-12 text-neutral-350 dark:text-neutral-600 mb-3 animate-pulse" />
                    <h4 className="font-serif text-sm font-bold text-neutral-700 dark:text-neutral-300">Nenhum histórico encontrado</h4>
                    <p className="text-neutral-500 text-xs font-serif mt-1 max-w-sm leading-relaxed">
                      Suas interações com a Alice serão salvas automaticamente nesta máquina para consultas e revisões posteriores.
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleLoadSession(session)}
                      className={`p-5 border rounded-2xl bg-white dark:bg-neutral-900 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between gap-4 ${
                        activeSessionId === session.id 
                          ? 'border-indigo-500 ring-1 ring-indigo-500' 
                          : 'border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-serif text-sm font-bold text-neutral-850 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {session.title}
                          </h4>
                          <button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                            title="Apagar esta conversa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-neutral-500 text-xs font-serif line-clamp-2 leading-relaxed">
                          {session.messages[session.messages.length - 1]?.text || 'Sem mensagens nesta conversa.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-850 font-mono text-[9px] text-neutral-400">
                        <span>Atualizado em {session.updatedAt.split(' ')[0]}</span>
                        <div className="flex gap-1.5">
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded uppercase font-bold">
                            {session.tone}
                          </span>
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-1.5 py-0.5 rounded uppercase font-bold">
                            {session.specialty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ==================== SUB-TAB 3: ALICE CONFIGURATIONS ==================== */}
        {activeSubTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-neutral-800 dark:text-white uppercase tracking-tight">
                Ajustar Calibração de Personalidade
              </h3>
              <p className="text-neutral-500 text-xs font-serif leading-relaxed">
                Personalize o tom de voz e a especialidade de negócios da Alice para receber respostas personalizadas e alinhadas com as suas necessidades mercadológicas ou esotéricas.
              </p>
            </div>

            {/* Config: Tone of voice */}
            <div className="space-y-3">
              <label className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                1. Tom de Voz da Alice
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'profissional', title: 'Profissional', desc: 'Respostas formais, claras, diretas e objetivas.' },
                  { value: 'casual', title: 'Casual', desc: 'Amigável, descontraído e de fácil compreensão.' },
                  { value: 'criativo', title: 'Criativo', desc: 'Metáforas profundas, inspiração astrológica e rica oratória.' }
                ].map((item) => (
                  <div
                    key={item.value}
                    onClick={() => setSelectedTone(item.value as any)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedTone === item.value 
                        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20' 
                        : 'border-neutral-200 dark:border-neutral-800 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono font-bold text-neutral-850 dark:text-white">{item.title}</span>
                      {selectedTone === item.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[10px] font-serif text-neutral-500 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Config: Specialty */}
            <div className="space-y-3">
              <label className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                2. Especialidade / Atuação Principal
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'vendas', title: 'Vendas', desc: 'Estratégias de conversão de clientes e copywriting persuasivo.' },
                  { value: 'atendimento', title: 'Atendimento', desc: 'Garantia de suporte refinado, empático e resolutivo.' },
                  { value: 'marketing', title: 'Marketing', desc: 'Especialista em redes sociais, atração de leads e branding.' }
                ].map((item) => (
                  <div
                    key={item.value}
                    onClick={() => setSelectedSpecialty(item.value as any)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedSpecialty === item.value 
                        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20' 
                        : 'border-neutral-200 dark:border-neutral-800 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-mono font-bold text-neutral-850 dark:text-white">{item.title}</span>
                      {selectedSpecialty === item.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[10px] font-serif text-neutral-500 leading-normal">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex justify-center items-center gap-1.5"
              id="btn-alice-gravar-config"
            >
              Gravar Calibração
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
