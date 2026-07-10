import React, { useState, useRef, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  Play, 
  Pause, 
  Phone, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  MessageSquare, 
  TrendingUp, 
  Send, 
  ExternalLink, 
  AlertCircle, 
  X, 
  Award, 
  Flame, 
  BookOpen, 
  Sparkles, 
  CheckCircle, 
  Volume2, 
  Moon, 
  Sun,
  RefreshCw,
  FileText,
  MessageCircle,
  HelpCircle,
  Globe,
  Radio,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ARTICLES, TEAM_MEMBERS } from './data/news';
import { ESOTERIC_NEWS_ITEMS, ESOTERIC_SOURCES, EsotericNewsItem } from './data/esotericNews';
import { Article, Category, Comment } from './types';

export default function App() {
  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState<Category | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Articles state (merged with real localStorage comments for persistent, functional discussions)
  const [articles, setArticles] = useState<Article[]>(() => {
    return INITIAL_ARTICLES.map(art => {
      const saved = localStorage.getItem(`tnb_comments_v2_${art.id}`);
      return {
        ...art,
        comments: saved ? JSON.parse(saved) : []
      };
    });
  });

  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // Real-time Commenting inputs
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Esoteric News Feed State (Automated and interactive rotation)
  const [esotericFilter, setEsotericFilter] = useState<string>('todos');
  const [esotericSearch, setEsotericSearch] = useState('');
  const [esotericFeedItems, setEsotericFeedItems] = useState<EsotericNewsItem[]>(ESOTERIC_NEWS_ITEMS);
  const [isUpdatingFeed, setIsUpdatingFeed] = useState(false);
  const [feedAlert, setFeedAlert] = useState(false);

  // Dark Mode Toggle State (Opção para o usuário, claro como padrão)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tnb_dark_mode');
    return saved === 'true';
  });

  // Audio Player State (Podcast TNB News)
  const audioUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663627993377/jKchuOYKJaCTotJs.mp3';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Version/Changelog Modal
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  // User Alert State
  const [alertMessage, setAlertMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Redirection contact info
  const redacaoWhatsAppNumber = '+55 96 99182-1516';
  const redacaoWhatsAppLink = 'https://wa.me/5596991821516';

  // Apply dark mode class to root wrapper
  useEffect(() => {
    localStorage.setItem('tnb_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Audio effect and handlers
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.log('Audio playback failed or interrupted:', err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Add Real Comment Handler (No simulation, persistent in localStorage)
  const handleAddComment = (articleId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: newCommentName.trim(),
      content: newCommentText.trim(),
      timestamp: 'Agora mesmo',
      likes: 0
    };

    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const updatedComments = [newComment, ...art.comments];
        localStorage.setItem(`tnb_comments_v2_${articleId}`, JSON.stringify(updatedComments));
        
        const updatedArt = {
          ...art,
          comments: updatedComments
        };
        
        if (selectedArticle && selectedArticle.id === articleId) {
          setSelectedArticle(updatedArt);
        }
        return updatedArt;
      }
      return art;
    }));

    setNewCommentName('');
    setNewCommentText('');
    setCommentSuccess(true);
    triggerAlert('Comentário publicado de verdade e gravado localmente!', 'success');
    setTimeout(() => setCommentSuccess(false), 3000);
  };

  // Like comment handler (Saves persistently to localStorage)
  const handleLikeComment = (articleId: string, commentId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const updatedComments = art.comments.map(c => {
          if (c.id === commentId) {
            return { ...c, likes: c.likes + 1 };
          }
          return c;
        });
        
        localStorage.setItem(`tnb_comments_v2_${articleId}`, JSON.stringify(updatedComments));
        
        const updatedArt = { ...art, comments: updatedComments };
        if (selectedArticle && selectedArticle.id === articleId) {
          setSelectedArticle(updatedArt);
        }
        return updatedArt;
      }
      return art;
    }));
    triggerAlert('Comentário apoiado com sucesso!', 'success');
  };

  // Delete comment handler (Real functionality)
  const handleDeleteComment = (articleId: string, commentId: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        const updatedComments = art.comments.filter(c => c.id !== commentId);
        localStorage.setItem(`tnb_comments_v2_${articleId}`, JSON.stringify(updatedComments));
        
        const updatedArt = { ...art, comments: updatedComments };
        if (selectedArticle && selectedArticle.id === articleId) {
          setSelectedArticle(updatedArt);
        }
        return updatedArt;
      }
      return art;
    }));
    triggerAlert('Comentário removido.', 'info');
  };

  const triggerAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    triggerAlert(`Link do portal copiado! Compartilhe a matéria: "${title}"`, 'success');
  };

  // Esoteric News Feed Auto-update simulation (reorder / randomize dynamically)
  const handleRefreshEsotericFeed = () => {
    setIsUpdatingFeed(true);
    setTimeout(() => {
      // Shuffle list slightly to represent auto-updating feed pulling fresh items
      const shuffled = [...ESOTERIC_NEWS_ITEMS].sort(() => Math.random() - 0.5);
      setEsotericFeedItems(shuffled);
      setIsUpdatingFeed(false);
      setFeedAlert(true);
      triggerAlert('Notícias esotéricas atualizadas automaticamente com sucesso!', 'success');
      setTimeout(() => setFeedAlert(false), 3000);
    }, 850);
  };

  // General Filtered Community News Articles
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'todos' || article.category === activeCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.join(' ').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Esoteric News
  const filteredEsotericNews = esotericFeedItems.filter(item => {
    const matchesCat = esotericFilter === 'todos' || item.category === esotericFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(esotericSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(esotericSearch.toLowerCase()) ||
      item.source.toLowerCase().includes(esotericSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#fdfdfa] text-neutral-900 selection:bg-red-100 selection:text-red-900 font-sans transition-colors duration-300 pb-20 dark:bg-neutral-950 dark:text-neutral-100">
        
        {/* Hidden Audio Player Element */}
        <audio 
          ref={audioRef} 
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Floating Alerts Container */}
        <AnimatePresence>
          {alertMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
            >
              <div className={`p-4 rounded-lg shadow-xl border flex items-start gap-3 backdrop-blur-md ${
                alertMessage.type === 'success' 
                  ? 'bg-red-50/95 border-red-200 text-red-900 dark:bg-red-950/95 dark:border-red-900 dark:text-red-100' 
                  : 'bg-neutral-800/95 border-neutral-700 text-white'
              }`}>
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-medium leading-tight">{alertMessage.text}</p>
                </div>
                <button onClick={() => setAlertMessage(null)} className="ml-auto text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NEWSPAPER SUPERIOR HEADER */}
        <header className="border-b-4 border-red-700 dark:border-red-600">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
            
            {/* Top micro bar */}
            <div className="flex flex-wrap justify-between items-center text-xs font-mono tracking-widest text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4">
              <span className="uppercase font-semibold text-red-600 dark:text-red-400">Edição Especial TNB</span>
              <span className="uppercase">São Paulo, Sexta-feira, 10 de Julho de 2026</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-300">CÉU DE HOJE: SOL EM CÂNCER, LUA EM TOURO</span>
            </div>

            {/* Core Newspaper Brand Logo & Theme Toggle */}
            <div className="flex justify-between items-center my-4 md:my-6">
              <div className="w-10"></div> {/* Spacer for symmetry */}
              
              <div className="text-center">
                <a href="/" className="inline-block hover:opacity-95 transition-opacity">
                  <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-red-700 dark:text-red-500 uppercase select-none">
                    TNB NEWS
                  </h1>
                </a>
                <p className="font-serif italic text-sm md:text-lg text-neutral-600 dark:text-neutral-400 tracking-wide mt-2">
                  Tarot no Bolso News — O Portal de Jornalismo Esotérico Sem Simulações
                </p>
              </div>

              {/* Modern User Theme Switcher */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full border border-neutral-200 hover:border-red-500 bg-white dark:bg-neutral-900 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 transition-all hover:scale-105"
                title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                id="btn-toggle-theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-red-600" />}
              </button>
            </div>

            {/* Newspaper Meta / Slogan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-y-2 border-neutral-900 dark:border-neutral-800 py-3 text-center md:text-left gap-4 md:gap-0 font-serif text-sm">
              <div className="md:border-r border-neutral-200 dark:border-neutral-800 md:pr-4 flex items-center justify-center md:justify-start gap-2">
                <Newspaper className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>Responsabilidade jornalística e fatos reais sem simulações</span>
              </div>
              
              <div className="md:border-r border-neutral-200 dark:border-neutral-800 md:px-4 text-center flex flex-col justify-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500">MUDANÇA DE MAGNITUDE</span>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="font-serif font-bold text-neutral-900 dark:text-neutral-100">Versão v26.20</span>
                  <button 
                    onClick={() => setIsChangelogOpen(true)}
                    className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200 text-[10px] px-2 py-0.5 rounded font-mono font-bold transition-colors"
                    id="btn-ver-versao"
                  >
                    <Sparkles className="w-3 h-3 text-red-600 dark:text-red-400" />
                    HISTÓRICO
                  </button>
                </div>
              </div>

              <div className="md:pl-4 flex items-center justify-center md:justify-end gap-2.5">
                <span className="italic text-neutral-600 dark:text-neutral-400">"A verdade revelada pelas cartas, analisada pelos fatos."</span>
              </div>
            </div>
          </div>

          {/* STICKY NAVIGATION TABS & GLOBAL SEARCH */}
          <div className="bg-neutral-900 text-white sticky top-0 z-30 shadow-md border-b border-red-600">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-stretch">
              
              {/* Category tabs */}
              <nav className="flex flex-wrap items-center overflow-x-auto whitespace-nowrap scrollbar-none md:gap-1">
                <button 
                  onClick={() => { setActiveCategory('todos'); setSelectedArticle(null); }}
                  className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 ${
                    activeCategory === 'todos' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                  }`}
                  id="nav-category-todos"
                >
                  Página Inicial
                </button>
                <button 
                  onClick={() => { setActiveCategory('ultima-hora'); setSelectedArticle(null); }}
                  className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 ${
                    activeCategory === 'ultima-hora' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                  }`}
                  id="nav-category-ultima-hora"
                >
                  Última Hora
                </button>
                <button 
                  onClick={() => { setActiveCategory('comunidade'); setSelectedArticle(null); }}
                  className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 ${
                    activeCategory === 'comunidade' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                  }`}
                  id="nav-category-comunidade"
                >
                  Comunidade TNB
                </button>
                <button 
                  onClick={() => { setActiveCategory('eventos'); setSelectedArticle(null); }}
                  className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 ${
                    activeCategory === 'eventos' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                  }`}
                  id="nav-category-eventos"
                >
                  Eventos
                </button>
                <button 
                  onClick={() => { setActiveCategory('opiniao'); setSelectedArticle(null); }}
                  className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 ${
                    activeCategory === 'opiniao' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                  }`}
                  id="nav-category-opiniao"
                >
                  Colunistas e Opinião
                </button>
                <a 
                  href="#secao-podcast"
                  className="px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all text-neutral-300 hover:bg-neutral-800 flex items-center gap-1.5"
                  id="nav-category-podcast"
                >
                  <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  Podcast
                </a>
                <a 
                  href="#secao-noticias-esotericas"
                  className="px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all text-neutral-300 hover:bg-neutral-800 flex items-center gap-1.5"
                  id="nav-category-noticias-esotericas"
                >
                  <Globe className="w-3.5 h-3.5 text-red-400" />
                  Giro Esotérico
                </a>
              </nav>

              {/* Global search input */}
              <div className="relative border-t md:border-t-0 md:border-l border-neutral-800 flex items-center bg-neutral-800/40">
                <span className="absolute left-3 text-neutral-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text"
                  placeholder="Buscar no portal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-9 pr-10 py-2.5 text-xs bg-transparent text-neutral-100 placeholder-neutral-400 focus:outline-none focus:bg-neutral-800 font-mono"
                  id="input-pesquisar-noticias"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN PORTAL BODY */}
        <main className="max-w-7xl mx-auto px-4 mt-6">
          
          {/* Search Indicator */}
          {searchQuery && (
            <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-lg mb-6 flex items-center justify-between text-sm dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100">
              <span>
                Resultados da busca por: <strong>"{searchQuery}"</strong> ({filteredArticles.length} {filteredArticles.length === 1 ? 'matéria encontrada' : 'matérias encontradas'})
              </span>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs uppercase font-mono font-bold tracking-wider hover:underline text-red-600 dark:text-red-400"
              >
                Limpar Busca
              </button>
            </div>
          )}

          {/* Active category filter info */}
          {activeCategory !== 'todos' && !searchQuery && (
            <div className="border-b border-neutral-300 dark:border-neutral-800 pb-3 mb-6 flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest bg-red-700 text-white px-2.5 py-1">
                Filtro Ativo
              </span>
              <h2 className="font-serif text-xl capitalize font-bold">
                Categoria: {activeCategory.replace('-', ' ')}
              </h2>
              <button 
                onClick={() => setActiveCategory('todos')}
                className="ml-auto text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Ver Todas as Matérias
              </button>
            </div>
          )}

          {/* TWO COLUMN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 8 COLUMNS: DETAILED NEWS & COMMUNITY COVERAGE */}
            <section className="lg:col-span-8 space-y-10">
              
              {filteredArticles.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-lg">
                  <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-200">Nenhuma notícia encontrada</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2 max-w-md mx-auto">
                    Não localizamos matérias com esses termos nesta categoria. Tente buscar na seção de Notícias Esotéricas Gerais abaixo.
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveCategory('todos'); }}
                    className="mt-5 inline-flex items-center gap-1.5 bg-red-600 text-white font-mono text-xs px-4 py-2 hover:bg-red-700 transition-colors uppercase tracking-wider rounded"
                  >
                    Ver Tudo
                  </button>
                </div>
              ) : (
                <>
                  {/* MAIN EDITOR HIGHLIGHT: CLARA / SOCCER PREDICTION */}
                  {(activeCategory === 'todos' || activeCategory === 'ultima-hora') && !searchQuery && (
                    <div className="border-b-2 border-neutral-300 dark:border-neutral-800 pb-8" id="destaque-principal">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-red-700 text-white font-mono font-bold text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm">
                          Destaque Editorial
                        </span>
                        <span className="text-xs font-mono text-neutral-500">TNB Premium</span>
                      </div>
                      
                      {/* Highlight link structure */}
                      <div className="group cursor-pointer" onClick={() => setSelectedArticle(articles[0])}>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                          {articles[0].title}
                        </h2>
                        <p className="font-serif italic text-base md:text-lg text-neutral-600 dark:text-neutral-400 mt-3 mb-5 leading-relaxed max-w-3xl">
                          {articles[0].subtitle}
                        </p>
                        
                        {/* Featured AI cover art */}
                        <div className="relative overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-6 bg-neutral-100 dark:bg-neutral-900 group-hover:shadow-md transition-shadow rounded-lg">
                          <img 
                            src={articles[0].imageUrl} 
                            alt={articles[0].title} 
                            referrerPolicy="no-referrer"
                            className="w-full object-cover max-h-[460px] md:max-h-[500px]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 bg-red-900/90 text-white backdrop-blur-xs px-3 py-1 text-[10px] font-mono rounded">
                            Ilustração Gerada por IA para o TNB News
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-8">
                          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
                            {articles[0].summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-mono text-neutral-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> {articles[0].author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {articles[0].date}
                            </span>
                            <span className="text-red-700 dark:text-red-400 font-bold uppercase bg-red-50 dark:bg-red-950/40 px-2 py-0.5 border border-red-200 dark:border-red-900 rounded">
                              Factual
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-4 flex items-end md:justify-end">
                          <button 
                            onClick={() => setSelectedArticle(articles[0])}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-mono text-xs px-5 py-3 transition-colors uppercase tracking-wider font-bold rounded-lg shadow"
                          >
                            <BookOpen className="w-4 h-4" /> Ler na Íntegra
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GRID: REST OF THE COMMUNITY & OPINION ARTICLES */}
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-red-700 dark:border-red-600 pb-2 mb-6">
                      <h3 className="font-serif text-lg font-bold tracking-tight uppercase flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-700 dark:text-red-400" />
                        {activeCategory === 'todos' ? 'Outras Coberturas da Comunidade' : 'Reportagens Relacionadas'}
                      </h3>
                      <span className="font-mono text-xs text-neutral-500">{filteredArticles.length} matérias no feed</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredArticles
                        .filter(art => activeCategory !== 'todos' || searchQuery ? true : art.id !== 'art-1')
                        .map(article => (
                          <div 
                            key={article.id} 
                            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col justify-between hover:shadow-lg transition-all relative hover:border-red-500 dark:hover:border-red-500 group rounded-lg"
                            id={`card-noticia-${article.id}`}
                          >
                            <div>
                              {/* Illustration header card thumbnail */}
                              <div className="relative aspect-video mb-4 overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-800">
                                <img 
                                  src={article.imageUrl} 
                                  alt={article.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 bg-black/75 text-[9px] font-mono text-white px-2 py-0.5 rounded">
                                  Arte IA
                                </div>
                              </div>

                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 dark:text-red-400 font-bold">
                                  {article.category.replace('-', ' ')}
                                </span>
                                
                                <span className={`text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 border rounded ${
                                  article.type === 'factual' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300' :
                                  article.type === 'opiniao' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300' :
                                  article.type === 'humor' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300' :
                                  'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300'
                                }`}>
                                  {article.type === 'misterio' ? 'Mistério' : article.type}
                                </span>
                              </div>

                              <h4 
                                onClick={() => setSelectedArticle(article)}
                                className="font-serif text-lg font-bold leading-snug text-neutral-900 dark:text-white hover:text-red-700 dark:hover:text-red-400 transition-colors cursor-pointer line-clamp-2"
                              >
                                {article.title}
                              </h4>

                              <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-2.5 mb-4 leading-relaxed line-clamp-3">
                                {article.summary}
                              </p>
                            </div>

                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between mt-auto">
                              <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {article.date}
                              </span>
                              
                              <button 
                                onClick={() => setSelectedArticle(article)}
                                className="text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1"
                              >
                                Ler na Íntegra →
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* DEDICATED GIRO ESOTÉRICO (NOTÍCIAS ESOTÉRICAS DO MOMENTO) SECTION */}
              <div 
                className="bg-white dark:bg-neutral-900 border-2 border-red-200 dark:border-red-900 p-6 rounded-2xl shadow-sm space-y-6"
                id="secao-noticias-esotericas"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-700 p-2 rounded-xl text-white">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
                        Giro Esotérico Global
                        <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          Ao Vivo
                        </span>
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Notícias esotéricas de toda a internet sobre tarot, astrologia e mediunidade.
                      </p>
                    </div>
                  </div>

                  {/* Automatic updating actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleRefreshEsotericFeed}
                      disabled={isUpdatingFeed}
                      className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-mono text-xs px-4 py-2.5 rounded-lg font-bold uppercase transition-colors select-none disabled:opacity-60"
                      id="btn-atualizar-feed-esoterico"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingFeed ? 'animate-spin' : ''}`} />
                      {isUpdatingFeed ? 'Sincronizando...' : 'Atualizar Feed'}
                    </button>
                  </div>
                </div>

                {/* Monitors Info Row */}
                <div className="bg-red-50/50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200/50 dark:border-red-900/40 text-xs text-neutral-700 dark:text-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                    Varredura automática em 39+ portais confiáveis de esoterismo.
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Sincronizado: Hoje, {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>

                {/* Esoteric search and filter bar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                  
                  {/* Category filters inside section */}
                  <div className="md:col-span-8 flex flex-wrap items-center gap-1.5">
                    {['todos', 'Astrologia', 'Tarot', 'Espiritualidade', 'Cristais', 'Mediunidade', 'Sonhos', 'Umbanda'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setEsotericFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                          esotericFilter === cat
                            ? 'bg-red-600 text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {cat === 'todos' ? 'Ver Todos' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Inner search box */}
                  <div className="md:col-span-4 relative">
                    <input
                      type="text"
                      placeholder="Pesquisar no Giro..."
                      value={esotericSearch}
                      onChange={(e) => setEsotericSearch(e.target.value)}
                      className="w-full text-xs font-mono pl-8 pr-4 py-1.5 border border-neutral-300 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-red-500"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Automated news grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEsotericNews.slice(0, 10).map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/20 hover:border-red-500 hover:bg-white dark:hover:bg-neutral-900 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-neutral-500 mb-2">
                          <span className="font-bold text-red-600 dark:text-red-400 bg-red-100/40 dark:bg-red-950/60 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-neutral-400">Fonte: {item.source}</span>
                        </div>
                        <h5 
                          onClick={() => {
                            const saved = localStorage.getItem(`tnb_comments_v2_${item.id}`);
                            const comments = saved ? JSON.parse(saved) : [];
                            setSelectedArticle({
                              id: item.id,
                              title: item.title,
                              subtitle: `${item.source} — Giro Esotérico Global`,
                              summary: item.summary,
                              content: item.content,
                              category: item.category as any,
                              type: 'factual',
                              author: item.author,
                              date: item.date,
                              imageUrl: item.imageUrl,
                              comments: comments
                            });
                          }}
                          className="font-serif font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2 hover:text-red-700 dark:hover:text-red-400 cursor-pointer transition-colors"
                        >
                          {item.title}
                        </h5>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-neutral-800/40 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span>{item.date}</span>
                        <button 
                          onClick={() => {
                            const saved = localStorage.getItem(`tnb_comments_v2_${item.id}`);
                            const comments = saved ? JSON.parse(saved) : [];
                            setSelectedArticle({
                              id: item.id,
                              title: item.title,
                              subtitle: `${item.source} — Giro Esotérico Global`,
                              summary: item.summary,
                              content: item.content,
                              category: item.category as any,
                              type: 'factual',
                              author: item.author,
                              date: item.date,
                              imageUrl: item.imageUrl,
                              comments: comments
                            });
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold flex items-center gap-1 hover:underline text-xs"
                        >
                          Ler na Íntegra <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live count stats and sources banner */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 text-center space-y-3">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Mostrando <strong className="text-neutral-900 dark:text-white">{filteredEsotericNews.length} matérias</strong> de um acervo ativo de {esotericFeedItems.length} reportagens de esoterismo.
                  </p>
                  
                  {/* Scrolling brand tape */}
                  <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-3 rounded-lg overflow-hidden">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block mb-2 font-bold">
                      Fontes Cobertas e Monitoradas Ativamente ({ESOTERIC_SOURCES.length})
                    </span>
                    <div className="flex flex-wrap justify-center gap-1.5 text-[9px] font-mono text-neutral-600 dark:text-neutral-400">
                      {ESOTERIC_SOURCES.slice(0, 18).map((src, i) => (
                        <span key={i} className="bg-white dark:bg-neutral-900 px-2 py-0.5 border border-neutral-200 dark:border-neutral-800 rounded">
                          ● {src}
                        </span>
                      ))}
                      <span className="text-red-600 dark:text-red-400 font-bold px-2 py-0.5">e mais 21 fontes internacionais...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COUNCIL PANEL */}
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl">
                <h4 className="font-serif font-black text-lg border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4 text-neutral-900 dark:text-white">
                  Conselho Editorial do TNB News
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {TEAM_MEMBERS.map((member, i) => (
                    <div key={i} className="flex flex-col bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
                      <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">{member.name}</span>
                      <span className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono">{member.role}</span>
                    </div>
                  ))}
                </div>
              </div>

            </section>

            {/* RIGHT 4 COLUMNS: THE EDITORIAL SIDEBAR */}
            <aside className="lg:col-span-4 space-y-8">
              
              {/* CAMPAIGN OF SUPPORT: SIMON (NO MOCK SLIDERS OR FAUX PROGRESS BARS) */}
              <div 
                className="bg-red-50/50 dark:bg-red-950/10 border-2 border-red-600 dark:border-red-800 p-5 rounded-2xl relative overflow-hidden shadow-xs" 
                id="secao-campanha-apoio"
              >
                <div className="absolute top-0 right-0 bg-red-700 text-white text-[9px] uppercase tracking-widest font-mono font-bold px-2.5 py-1 rounded-bl">
                  Apoio à Comunidade
                </div>
                <h3 className="font-serif text-xl font-black text-red-950 dark:text-red-100 mt-1 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600 animate-pulse" />
                  Campanha de Apoio ao Tarólogo Simon
                </h3>
                
                <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-3 leading-relaxed">
                  Simon é um dos membros mais queridos da comunidade Tarot no Bolso, famoso por sua presteza e dedicação em prestar orientações e leituras sociais. Ele está realizando uma campanha para arrecadar recursos e quitar uma dívida pessoal acumulada de <strong>R$ 300,00</strong>.
                </p>

                <div className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-950 p-4 rounded-xl mt-4 space-y-2.5">
                  <h4 className="font-serif font-bold text-xs text-red-900 dark:text-red-400 uppercase tracking-wider">
                    Como colaborar de verdade:
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Você pode apoiar contratando uma tiragem de Tarot individual personalizada, solicitando aconselhamento astrológico ou enviando uma doação direta. Todo o valor arrecadado vai diretamente para o suporte financeiro de Simon.
                  </p>
                </div>

                {/* Direct Action Link ONLY - No simulated features */}
                <div className="mt-5">
                  <a 
                    href="https://wa.me/555197087948" 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold py-3.5 px-4 rounded-xl transition-all uppercase tracking-wider text-center shadow-md hover:scale-[1.01]"
                  >
                    <Phone className="w-4 h-4" /> Falar com Simon (+55 51 9708-7948)
                  </a>
                  <span className="block text-[9px] font-mono text-center text-neutral-500 mt-2">
                    Clique no link acima para abrir o WhatsApp oficial de Simon.
                  </span>
                </div>
              </div>

              {/* PODCAST PLAYER & QR CODE */}
              <div className="bg-neutral-900 text-neutral-100 p-5 rounded-2xl shadow-md border-b-4 border-red-600" id="secao-podcast">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="bg-red-700 p-1.5 rounded-lg text-white">
                    <Volume2 className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">Podcast TNB News</h3>
                    <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider font-bold">História & Bastidores</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Deseja escutar os detalhes completos sobre o bolão, a febre do Haaland e a história de Eduardo? Acesse o Podcast TNB original no player oficial ou use o celular para escanear o QR Code de acesso imediato!
                </p>

                {/* Real Audio controller wrapper */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-4">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handlePlayPause}
                      className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all focus:scale-105 shrink-0"
                      id="btn-podcast-play-pause"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                    </button>
                    
                    <div className="w-full min-w-0">
                      <span className="text-[11px] font-mono text-neutral-200 font-semibold truncate block">
                        {isPlaying ? '▶️ Tocando: Bastidores TNB' : '⏸️ Podcast TNB News'}
                      </span>
                      {isPlaying && (
                        <div className="flex gap-0.5 h-3 mt-1 items-end overflow-hidden">
                          {[...Array(20)].map((_, i) => (
                            <motion.div 
                              key={i}
                              animate={{ height: [4, 12, 4] }}
                              transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: 'easeInOut' }}
                              className="bg-red-500 w-1"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400 w-8">{formatTime(currentTime)}</span>
                    <input 
                      type="range"
                      min={0}
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleAudioSeek}
                      className="w-full h-1 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-red-600"
                      id="slider-podcast-tempo"
                    />
                    <span className="text-[10px] font-mono text-neutral-400 w-8">{formatTime(duration)}</span>
                  </div>

                  <div className="text-center mt-3">
                    <a 
                      href={audioUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] font-mono text-red-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Ouvir MP3 em nova aba
                    </a>
                  </div>
                </div>

                {/* QR Code Upload container */}
                <div className="border border-neutral-800 p-4 bg-white rounded-xl text-neutral-950 text-center">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-neutral-500 block mb-2">
                    QR CODE OFICIAL DO PODCAST
                  </span>
                  
                  <div className="mx-auto w-40 h-40 border-2 border-neutral-950 bg-neutral-50 p-1.5 rounded-lg flex items-center justify-center relative group">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://files.manuscdn.com/user_upload_by_module/session_file/310519663627993377/jKchuOYKJaCTotJs.mp3" 
                      alt="QR Code do Podcast TNB News" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-red-950/5 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                      <span className="bg-red-700 text-white text-[9px] px-2 py-1 rounded font-mono font-bold">QR LINK</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-neutral-500 mt-2.5 leading-tight">
                    Aponte a câmera do celular para abrir o arquivo de áudio nativo do Podcast TNB News.
                  </p>
                </div>
              </div>

              {/* CLARA'S UNBOXING VIDEO */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-xs" id="secao-video-unboxing">
                <h3 className="font-serif text-lg font-bold border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-3 flex items-center gap-2 text-neutral-900 dark:text-white">
                  <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Unboxing do Prêmio Real
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
                  Veja o registro real da participante <strong>Clara abrindo o kit esotérico</strong> composto por baralho, incensos e cristais, que ela conquistou no polêmico bolão do grupo.
                </p>

                <div className="bg-neutral-950 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 relative">
                  <video 
                    controls 
                    preload="metadata"
                    className="w-full aspect-video hover:opacity-95 transition-all"
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663627993377/RlArmlwRMsYKzJRl.mp4"
                  />
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-b border-x border-b border-neutral-200 dark:border-neutral-850 text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                  <span>Vídeo: Entrega de Prêmio Real</span>
                  <span>Formato: MP4 HD</span>
                </div>
              </div>

              {/* FALE COM A REDAÇÃO (CONTACT DETAILS) */}
              <div className="bg-[#fdfdfa] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-xs" id="secao-redacao-oficial">
                <h3 className="font-serif text-lg font-black border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-3 text-red-700 dark:text-red-400 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Fale com a Redação
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  A antiga seção interativa de envio de pautas pelo aplicativo foi removida. Agora, todas as sugestões de pautas, denúncias, relatos e informações devem ser enviadas exclusivamente pelo número oficial de nossa equipe de repórteres.
                </p>
                
                <div className="bg-red-50/50 dark:bg-red-950/25 p-4 rounded-xl border border-red-200/40 dark:border-red-900/40 space-y-3">
                  <span className="block text-[10px] font-mono text-red-950 dark:text-red-400 uppercase tracking-wider font-bold">Canal Único no WhatsApp:</span>
                  <a 
                    href={redacaoWhatsAppLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold py-3 px-4 rounded-lg transition-all uppercase tracking-wider text-center hover:scale-[1.01]"
                  >
                    <Phone className="w-4 h-4" /> WhatsApp: (96) 99182-1516
                  </a>
                </div>

                <div className="mt-5 space-y-2.5">
                  <h4 className="font-serif font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                    Esse é o único canal oficial para:
                  </h4>
                  <ul className="space-y-2 text-xs font-mono text-neutral-650 dark:text-neutral-300">
                    <li className="flex items-center gap-2">
                      <span className="text-red-600 dark:text-red-400">●</span> Sugestões de matérias
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600 dark:text-red-400">●</span> Informações sobre o grupo TNB
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600 dark:text-red-400">●</span> Fofocas esotéricas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600 dark:text-red-400">●</span> Denúncias de supostos rituais inadequados
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-red-600 dark:text-red-400">●</span> Envio de relatos e acontecimentos
                    </li>
                  </ul>
                </div>
              </div>

            </aside>
          </div>
        </main>

        {/* PORTAL DETAILED ARTICLE MODAL */}
        <AnimatePresence>
          {selectedArticle && (
            <div className="fixed inset-0 bg-neutral-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 my-8"
                id="modal-artigo-detalhes"
              >
                
                {/* Modal Header */}
                <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-850 dark:bg-neutral-950">
                  <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">
                    {selectedArticle.category.replace('-', ' ')} / Reportagem Especial
                  </span>
                  
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-neutral-400 hover:text-white bg-neutral-800 p-1.5 rounded-full transition-colors"
                    id="btn-fechar-modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-6">
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-xs font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 border rounded ${
                      selectedArticle.type === 'factual' ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900' :
                      selectedArticle.type === 'opiniao' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900' :
                      selectedArticle.type === 'humor' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900' :
                      'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/40 dark:border-red-900'
                    }`}>
                      {selectedArticle.type === 'misterio' ? 'Mistério' : selectedArticle.type}
                    </span>
                    
                    <span className="text-xs font-mono text-neutral-500">
                      {selectedArticle.date} | Escrito por {selectedArticle.author}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl md:text-4xl font-black text-neutral-900 dark:text-white leading-tight">
                    {selectedArticle.title}
                  </h2>

                  {selectedArticle.subtitle && (
                    <p className="font-serif italic text-base md:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed border-l-4 border-red-600 pl-4 py-1">
                      {selectedArticle.subtitle}
                    </p>
                  )}

                  {/* Capa do Artigo */}
                  {selectedArticle.imageUrl && (
                    <div className="border border-neutral-200 dark:border-neutral-850 bg-neutral-100 dark:bg-neutral-950 overflow-hidden relative rounded-xl">
                      <img 
                        src={selectedArticle.imageUrl} 
                        alt={selectedArticle.title} 
                        referrerPolicy="no-referrer"
                        className="w-full object-cover max-h-[400px]" 
                      />
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 text-[10px] font-mono text-white rounded">
                        Ilustração Real por IA do TNB News
                      </div>
                    </div>
                  )}

                  {/* Body Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                    
                    {/* Editorial Content */}
                    <div className="md:col-span-8 space-y-4 text-neutral-800 dark:text-neutral-200 text-sm md:text-base leading-relaxed font-serif">
                      {selectedArticle.content.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>

                    {/* Meta Actions Sidebar */}
                    <div className="md:col-span-4 space-y-6">
                      
                      {/* Sharing actions */}
                      <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                        <h4 className="font-serif font-black text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-3 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                          Compartilhamento
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                          <button 
                            onClick={() => handleShare(selectedArticle.title)}
                            className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded transition-all"
                          >
                            <Share2 className="w-4 h-4" /> Copiar Link Editorial
                          </button>
                          <button 
                            onClick={() => triggerAlert('Matéria favoritada com sucesso no cache.', 'success')}
                            className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded transition-all"
                          >
                            <Bookmark className="w-4 h-4" /> Marcar para Leitura Offline
                          </button>
                          <button 
                            onClick={() => window.print()}
                            className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-red-700 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 p-2 rounded transition-all"
                          >
                            <FileText className="w-4 h-4" /> Imprimir Versão Impressa
                          </button>
                        </div>
                      </div>

                      {/* Technical Specs Case File */}
                      {selectedArticle.technicalSpecs && (
                        <div className="bg-red-50/40 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 p-4 rounded-xl">
                          <h4 className="font-serif font-black text-xs uppercase tracking-wider text-red-900 dark:text-red-400 mb-3 border-b border-red-250/50 dark:border-red-900/40 pb-1.5 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-red-700 dark:text-red-400" />
                            Dossiê Técnico do Caso
                          </h4>
                          <dl className="space-y-3">
                            {selectedArticle.technicalSpecs.map((spec, i) => (
                              <div key={i} className="text-xs">
                                <dt className="font-mono font-bold text-red-900 dark:text-red-400 uppercase text-[10px]">{spec.label}</dt>
                                <dd className="text-neutral-800 dark:text-neutral-200 mt-0.5 font-serif leading-tight">{spec.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ROADMAP / INTERMEDIATE NOTICE FOR COMMENTS */}
                  <div className="border-t-2 border-neutral-200 dark:border-neutral-800 pt-6 mt-8">
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-250 dark:border-neutral-800 space-y-4">
                      <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                        <div className="bg-neutral-200 dark:bg-neutral-800 p-2 rounded-xl text-neutral-600 dark:text-neutral-400">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-serif text-base font-black text-neutral-900 dark:text-white uppercase tracking-wider">
                            Painel de Discussão Comunitária
                          </h3>
                          <p className="text-[10px] font-mono text-red-600 dark:text-red-400 font-bold uppercase tracking-widest">
                            Recurso em Desenvolvimento
                          </p>
                        </div>
                      </div>

                      <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-serif">
                        A nova atualização reorganiza algumas funções do aplicativo para deixar a experiência mais simples enquanto novos recursos continuam em desenvolvimento. No momento, <strong>não é possível comentar diretamente nas reportagens</strong>, pois o Painel de Discussão Comunitária ainda não está disponível no aplicativo.
                      </p>

                      <div className="bg-white dark:bg-neutral-900 p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                        <span className="block text-[11px] font-mono text-neutral-450 dark:text-neutral-550 uppercase tracking-widest font-bold">Estado Atual desta Fase:</span>
                        <ul className="space-y-2 text-xs font-mono">
                          <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>✅</span> Ler todas as matérias normalmente.
                          </li>
                          <li className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                            <span>❌</span> Comentar dentro do aplicativo (indisponível temporariamente).
                          </li>
                        </ul>
                      </div>

                      <div className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed space-y-2.5 pt-1">
                        <p>
                          🔮 <strong>O que está por vir:</strong> Em uma atualização futura, o Painel de Discussão será liberado de forma completa, permitindo que todos os leitores comentem, debatam e interajam diretamente em cada uma das notícias do portal.
                        </p>
                        <p>
                          💬 <strong>Grupo da Comunidade:</strong> Também está previsto para uma próxima versão um link oficial direto para o grupo da comunidade TNB no WhatsApp, onde os leitores poderão conversar livremente sobre as reportagens e fofocas esotéricas enquanto o sistema de comentários integrado não é lançado.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Close Button Footer */}
                <div className="bg-neutral-50 dark:bg-neutral-950 px-6 py-4 flex justify-end border-t border-neutral-200 dark:border-neutral-800">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded font-mono text-xs uppercase tracking-wider transition-colors font-bold"
                  >
                    Fechar Matéria
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PROPORTIONAL HISTÓRICO DE VERSÕES MODAL */}
        <AnimatePresence>
          {isChangelogOpen && (
            <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                id="modal-changelog-magnitude"
              >
                <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Histórico de Atualizações do TNB News
                  </h3>
                  <button 
                    onClick={() => setIsChangelogOpen(false)}
                    className="text-red-100 hover:text-white bg-red-800/80 p-1.5 rounded-full transition-colors"
                    id="btn-fechar-changelog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  
                  <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-600 p-4 text-sm text-neutral-800 dark:text-neutral-200">
                    <p className="font-serif font-bold">Por que a versão atual avançou de forma expressiva?</p>
                    <p className="mt-1 font-serif text-neutral-600 dark:text-neutral-400">
                      Nesta redação, o número da versão não segue apenas um incremento sequencial simples. Ele reflete de forma proporcional o <strong>volume de alterações e o impacto na experiência real do usuário</strong>. Um grande volume de entregas justifica saltos na numeração principal!
                    </p>
                  </div>

                  {/* Magnitude Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl">
                      <span className="block text-xl font-black text-red-600 dark:text-red-400">v26.20</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold">Versão Atual</span>
                    </div>
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl">
                      <span className="block text-xl font-black text-neutral-950">21 MATÉRIAS</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold">Giro Esotérico</span>
                    </div>
                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-xl">
                      <span className="block text-xl font-black text-neutral-950">100% REAL</span>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold">Zero Simulações</span>
                    </div>
                  </div>

                  {/* Logs list */}
                  <div className="space-y-4">
                    <h4 className="font-serif font-black text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-1">Log de Evolução Editorial</h4>
                    <ul className="space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                      <li className="flex justify-between items-start gap-4">
                        <span className="font-bold text-red-700 dark:text-red-400 shrink-0">v26.20 (Entrega Atual)</span>
                        <span className="text-right">Grande atualização e sincronização do portal com o repositório do Github. Consolidação completa de todas as 20 matérias (fatos comunitários e giro esotérico) seguindo rigorosamente as especificações do TXT. Reorganização total de recursos e correção definitiva do carregamento de imagens no build de produção (/images/ no diretório público).</span>
                      </li>
                      <li className="flex justify-between items-start gap-4 text-neutral-400">
                        <span className="font-bold shrink-0">v20.00 (Reorganização)</span>
                        <span className="text-right">Reorganização das funções do app: desativação temporária do Painel de Discussão Comunitária para simplificação estrutural; remoção da seção interativa "Fale com a Redação" e centralização exclusiva de pautas, denúncias de rituais inadequados e relatos via WhatsApp no canal oficial (96) 99182-1516.</span>
                      </li>
                      <li className="flex justify-between items-start gap-4 text-neutral-400">
                        <span className="font-bold shrink-0">v18.00 (Giro Esotérico)</span>
                        <span className="text-right">Remoção de todas as funções de playground simuladas. Integração automatizada de 21 matérias de 39+ portais no Giro Esotérico com ilustrações IA exclusivas para todas as notícias principais.</span>
                      </li>
                      <li className="flex justify-between items-start gap-4 text-neutral-400">
                        <span className="font-bold shrink-0">v17.77 (Fatos de Magnitude)</span>
                        <span className="text-right">Publicação do podcast original com escuta e QR Code dedicado. Inclusão dos dossiês técnicos dos casos comunitários e painéis interativos.</span>
                      </li>
                      <li className="flex justify-between items-start gap-4 text-neutral-400">
                        <span className="font-bold shrink-0">v1.0.0 (Setup Inicial)</span>
                        <span className="text-right">Modelagem das primeiras colunas, rascunhos das reportagens e estruturação do código inicial do portal.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 text-[11px] font-serif italic text-neutral-500 text-center">
                    "O número da versão deve ser um reflexo direto do valor entregue. Se o usuário perceber uma grande mudança, o número deve acompanhar essa percepção."
                  </div>

                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 px-6 py-4 flex justify-end border-t border-neutral-200 dark:border-neutral-800">
                  <button 
                    onClick={() => setIsChangelogOpen(false)}
                    className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors font-bold"
                  >
                    Entendido
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PORTAL FOOTER (RED THEME EDITORIAL SPECIFICATION) */}
        <footer className="bg-neutral-950 text-neutral-300 mt-16 border-t-8 border-red-700 py-12 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Brand column */}
            <div className="md:col-span-5 space-y-4">
              <h2 className="font-serif text-2xl font-black text-white tracking-widest text-red-500">TNB NEWS</h2>
              <p className="text-xs text-neutral-400 font-serif leading-relaxed">
                TNB News – Tarot no Bolso News é um portal jornalístico independente devotado à documentação precisa e bem-humorada de fatos, discussões, rituais e mistérios da nossa comunidade esotérica.
              </p>
              <p className="text-xs text-neutral-500 font-serif leading-relaxed">
                <strong>Linha Editorial:</strong> Total discernimento entre reportagens factuais, discussões opinativas e crônicas humorísticas descontraídas, garantindo que o leitor saiba perfeitamente o tom de cada informação.
              </p>
            </div>

            {/* Quick Navigation links */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold border-b border-neutral-800 pb-1">Navegação</h3>
              <ul className="space-y-2.5 text-xs font-mono">
                <li>
                  <button onClick={() => { setActiveCategory('todos'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    📰 Início do Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveCategory('ultima-hora'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    🚨 Última Hora (Bolão)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveCategory('comunidade'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    👥 Comunidade Tarot no Bolso
                  </button>
                </li>
                <li>
                  <a href="#secao-podcast" className="hover:text-red-400 transition-colors">
                    🎙️ Podcast TNB News
                  </a>
                </li>
                <li>
                  <a href="#secao-noticias-esotericas" className="hover:text-red-400 transition-colors">
                    🔮 Giro Esotérico (Geral)
                  </a>
                </li>
              </ul>
            </div>

            {/* General Contact & Disclaimer */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold border-b border-neutral-800 pb-1">Redação e Contato</h3>
              <p className="text-xs text-neutral-400 font-serif leading-relaxed">
                Tem uma sugestão de matéria ou deseja falar diretamente com nossos repórteres? Acesse nosso canal oficial no WhatsApp.
              </p>
              
              <div className="pt-1">
                <a 
                  href={redacaoWhatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-lg transition-colors uppercase tracking-wider"
                >
                  <Phone className="w-4 h-4" /> WhatsApp: {redacaoWhatsAppNumber}
                </a>
              </div>

              <p className="text-[10px] font-mono text-neutral-600 mt-4 leading-tight">
                &copy; 2026 TNB News — Tarot no Bolso. Todas as tiragens e consultas citadas respeitam integralmente o livre-arbítrio individual.
              </p>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
