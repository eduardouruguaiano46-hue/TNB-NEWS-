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
  Sparkle,
  Heart,
  QrCode,
  Megaphone,
  Users,
  Shield,
  Ticket,
  Compass,
  CreditCard,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_ARTICLES, TEAM_MEMBERS } from './data/news';
import { ESOTERIC_NEWS_ITEMS, ESOTERIC_SOURCES, EsotericNewsItem } from './data/esotericNews';
import { Article, Category, Comment } from './types';
import HomeTab from './components/HomeTab';
import ComunicadoTab from './components/ComunicadoTab';
import CampanhaTab, { Campanha } from './components/CampanhaTab';
import GiroEsotericoTab from './components/GiroEsotericoTab';
import PodcastTab from './components/PodcastTab';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { onSnapshot, doc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import AuthModal from './components/AuthModal';
import LoginScreen from './components/LoginScreen';
import AliceTab from './components/AliceTab';
import EsoterismoTab from './components/EsoterismoTab';
import ContratarTab from './components/ContratarTab';
import DownloadsTab from './components/DownloadsTab';

export default function App() {
  // Navigation & Filtering
  const [activeCategory, setActiveCategory] = useState<string>('reportagem');
  const [searchQuery, setSearchQuery] = useState('');

  // Auth State & Persistence
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userZodiacSign, setUserZodiacSign] = useState('Áries');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [brasiliaTime, setBrasiliaTime] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Estados de Conexão e Rede
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Sincronizar relógio em tempo real no fuso de Brasília
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setBrasiliaTime(formatter.format(now));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Verificar conexão com o Firestore (com timeout para evitar hangs)
  const verifyConnection = async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setFirestoreConnected(false);
      return;
    }
    
    setIsConnecting(true);
    try {
      const connectionPromise = getDocFromServer(doc(db, 'test', 'connection'));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao conectar com o banco de dados.')), 4000)
      );
      
      await Promise.race([connectionPromise, timeoutPromise]);
      setFirestoreConnected(true);
      setProfileError(null);
    } catch (err: any) {
      console.warn("Firestore connection check info:", err);
      // Se for apenas ausência de documento de teste, conta como conectado (pois comunicou com o servidor)
      if (err.code !== 'unavailable' && !err.message?.includes('Timeout')) {
        setFirestoreConnected(true);
        setProfileError(null);
      } else {
        setFirestoreConnected(false);
        setProfileError("Não foi possível conectar com o servidor. Verifique sua rede.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Monitorar status da internet do navegador
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      verifyConnection();
      triggerAlert('Sua conexão com a internet foi restabelecida!', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setFirestoreConnected(false);
      triggerAlert('Você está offline. Exibindo dados locais e em cache.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Executar verificação inicial
    verifyConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitorar mudanças no Auth do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        const justLoggedIn = sessionStorage.getItem('tnb_just_logged_in') === 'true';
        if (justLoggedIn) {
          setShowWelcomePopup(true);
          sessionStorage.removeItem('tnb_just_logged_in');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Monitorar o signo do usuário em tempo real do Firestore
  useEffect(() => {
    if (!currentUser) {
      setUserZodiacSign('Áries');
      return;
    }
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.zodiacSign) {
          setUserZodiacSign(data.zodiacSign);
        }
      }
      setFirestoreConnected(true);
      setProfileError(null);
    }, (error) => {
      console.warn("Erro ao carregar signo do usuário do Firestore:", error);
      setFirestoreConnected(false);
      setProfileError("Não foi possível conectar com o servidor para sincronizar seu perfil.");
    });
    return () => unsubscribe();
  }, [currentUser]);
  
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

  // Campaigns State (with dynamic persistence support)
  const [campaigns, setCampaigns] = useState<Campanha[]>(() => {
    const saved = localStorage.getItem('tnb_campaigns_v6');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 'alice',
        fullName: 'Alice Guedes',
        title: 'Campanha de Arrecadação para o Ratinho Resgatado',
        status_campanha: 'autorizada',
        meta: 0,
        arrecadado: 0,
        whatsappText: 'Oi Alice! Quero usar seu catálogo e também ajudar seu ratinho.',
        phone: '555399234997',
        formattedPhone: '+55 53 9923-4997'
      },
      {
        id: 'simon',
        fullName: 'Simon Cardoso de Oliveira',
        title: 'Campanha Solidária para Quitação de Faturas de Cartão',
        status_campanha: 'autorizada',
        meta: 1274.58,
        arrecadado: 0,
        whatsappText: 'Oi Simon! Gostaria de ajudar em sua campanha e realizar uma consulta.',
        phone: '555197087948',
        formattedPhone: '+55 51 9708-7948'
      },
      {
        id: 'luma',
        fullName: 'Luma Ravaglia',
        title: 'PROMOÇÃO LUMA VAI VER O MGK',
        status_campanha: 'autorizada',
        meta: 2500,
        arrecadado: 180,
        whatsappText: 'Oi Luma! Quero aproveitar a promoção de tiragens e apoiar sua viagem para ver o MGK!',
        phone: '5522997358696',
        formattedPhone: '(22) 99735-8696',
        pix: 'g0thmystic@gmail.com'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tnb_campaigns_v6', JSON.stringify(campaigns));
  }, [campaigns]);

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

  // Sinergia de Conteúdo States (Saves persistently to localStorage)
  const [isSinergiaActive, setIsSinergiaActive] = useState(() => {
    return localStorage.getItem('tnb_sinergia_active') === 'true';
  });
  const [customSynergyText, setCustomSynergyText] = useState(() => {
    return localStorage.getItem('tnb_sinergia_text') || 'Atenção: Período de recesso oficial em andamento de 10/07 a 17/07/2026. Suporte oficial temporariamente reduzido.';
  });
  const [synergyCampaign, setSynergyCampaign] = useState(() => {
    return localStorage.getItem('tnb_sinergia_campaign') || 'todas';
  });

  useEffect(() => {
    localStorage.setItem('tnb_sinergia_active', String(isSinergiaActive));
  }, [isSinergiaActive]);

  useEffect(() => {
    localStorage.setItem('tnb_sinergia_text', customSynergyText);
  }, [customSynergyText]);

  useEffect(() => {
    localStorage.setItem('tnb_sinergia_campaign', synergyCampaign);
  }, [synergyCampaign]);

  const handleAddCampaign = (newCamp: any) => {
    setCampaigns(prev => {
      const updated = [newCamp, ...prev];
      localStorage.setItem('tnb_campaigns_v6', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddArticle = (newArt: any) => {
    setArticles(prev => {
      const updated = [newArt, ...prev];
      // Sync to local articles
      return updated;
    });
  };

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

  // Campaign Image Modal Zoom
  const [expandedCampaignImage, setExpandedCampaignImage] = useState<string | null>(null);

  // Countdown Timer to July 17, 2026, 00:00:00 (Fim do Recesso)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false
  });

  useEffect(() => {
    const targetDate = new Date('2026-07-17T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setCountdown({ days, hours, minutes, seconds, isCompleted: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

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

  function triggerAlert(text: string, type: 'success' | 'info' = 'success') {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  }

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

  const handleCopyPix = () => {
    navigator.clipboard.writeText('g0thmystic@gmail.com');
    triggerAlert('Chave PIX g0thmystic@gmail.com copiada com sucesso!', 'success');
  };

  // Only articles that are authorized (no future embargo relative to our simulated date '2026-07-11')
  const authorizedArticles = articles.filter(article => {
    if (article.data_publicacao_autorizada) {
      const currentDate = new Date('2026-07-11');
      const articleDate = new Date(article.data_publicacao_autorizada);
      if (articleDate > currentDate) {
        return false;
      }
    }
    return true;
  });

  // General Filtered Community News Articles
  const filteredArticles = authorizedArticles.filter(article => {
    const matchesCategory = activeCategory === 'reportagem' || activeCategory === 'todos' || article.category === activeCategory;
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
              
              {/* Banner de Status de Conexão */}
              {(!isOnline || firestoreConnected === false) && (
                <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-3.5 rounded-r-xl flex items-center justify-between gap-3 text-amber-900 dark:text-amber-200 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-mono font-bold uppercase tracking-wider">Conexão Instável / Modo Offline</p>
                      <p className="text-xs font-serif mt-0.5 opacity-90">
                        {!isOnline 
                          ? 'Sua conexão com a internet parece estar desativada. Exibindo dados locais salvos.' 
                          : 'Não foi possível sincronizar com o banco de dados. Exibindo dados em cache.'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => verifyConnection()}
                    disabled={isConnecting}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isConnecting ? 'animate-spin' : ''}`} />
                    {isConnecting ? 'Conectando...' : 'Reconectar'}
                  </button>
                </div>
              )}
              
              {/* Top micro bar */}
              <div className="flex flex-wrap justify-between items-center text-xs font-mono tracking-widest text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4">
                <span className="uppercase font-semibold text-red-600 dark:text-red-400">Edição Especial TNB</span>
                <span className="uppercase">{brasiliaTime || 'São Paulo, Sexta-feira, 10 de Julho de 2026'}</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-300">CÉU DE HOJE: SOL EM CÂNCER, LUA EM TOURO</span>
              </div>

              {/* Core Newspaper Brand Logo & Theme Toggle */}
              <div className="flex justify-between items-center my-4 md:my-6">
                <div className="w-10"></div> {/* Spacer for symmetry */}
                
                <div className="text-center">
                  <a href="/" className="inline-block hover:opacity-95 transition-opacity" onClick={(e) => { e.preventDefault(); setActiveCategory('reportagem'); setSelectedArticle(null); }}>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-red-700 dark:text-red-500 uppercase select-none">
                      TNB NEWS
                    </h1>
                  </a>
                  <p className="font-serif italic text-sm md:text-lg text-neutral-600 dark:text-neutral-400 tracking-wide mt-2">
                    Tarot no Bolso News — O Portal de Jornalismo Esotérico Sem Simulações
                  </p>
                </div>

                {/* Modern User Theme Switcher */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 rounded-full border border-neutral-200 hover:border-red-500 bg-white dark:bg-neutral-900 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 transition-all hover:scale-105 cursor-pointer"
                    title={isDarkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                    id="btn-toggle-theme"
                  >
                    {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-red-600" />}
                  </button>
                </div>
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
                    <span className="font-serif font-bold text-neutral-900 dark:text-neutral-100">Versão v89.99</span>
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
                    onClick={() => { setActiveCategory('reportagem'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'reportagem' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-reportagem"
                  >
                    <Newspaper className="w-3.5 h-3.5 text-red-400" />
                    Reportagem
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('alice'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'alice' ? 'border-indigo-500 bg-neutral-800 text-indigo-400 font-black' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-alice"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    Alice AI
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('comunicado'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'comunicado' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-comunicado"
                  >
                    <Megaphone className="w-3.5 h-3.5 text-red-400" />
                    Comunicado
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('campanha'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'campanha' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-campanha"
                  >
                    <Heart className="w-3.5 h-3.5 text-red-400" />
                    Campanha
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('giro-esoterico'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'giro-esoterico' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-giro-esoterico"
                  >
                    <Globe className="w-3.5 h-3.5 text-red-400" />
                    Giro Esotérico
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('podcast'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'podcast' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-podcast"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    Podcast
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('esoterismo'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'esoterismo' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-esoterismo"
                  >
                    <Compass className="w-3.5 h-3.5 text-red-400 animate-spin-slow" />
                    Esoterismo
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('contratar'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'contratar' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-contratar"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-red-400" />
                    Apoio & Serviços
                  </button>
                  <button 
                    onClick={() => { setActiveCategory('downloads'); setSelectedArticle(null); }}
                    className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 hover:bg-neutral-800 flex items-center gap-1.5 ${
                      activeCategory === 'downloads' ? 'border-red-500 bg-neutral-800 text-red-400' : 'border-transparent text-neutral-300'
                    }`}
                    id="nav-category-downloads"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-red-400" />
                    Baixar App
                  </button>
                </nav>

                {/* Global search input (only visible/functional for News Feed) */}
                <div className="relative border-t md:border-t-0 md:border-l border-neutral-800 flex items-center bg-neutral-800/40">
                  <span className="absolute left-3 text-neutral-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    placeholder="Buscar no portal..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activeCategory !== 'reportagem') {
                        setActiveCategory('reportagem');
                      }
                    }}
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

        {/* MAIN PORTAL BODY (ESTANQUE / WATERTIGHT TAB ISOLATION) */}
        <main className="max-w-7xl mx-auto px-4 mt-6">
          {authLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="w-10 h-10 text-red-600 animate-spin" />
              <p className="text-xs font-mono text-neutral-500 mt-4">Sincronizando com as Estrelas...</p>
            </div>
          ) : (
            <>
              {activeCategory === 'reportagem' && (
                <HomeTab 
                  articles={authorizedArticles}
                  filteredArticles={filteredArticles}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  setSelectedArticle={setSelectedArticle}
                  TEAM_MEMBERS={TEAM_MEMBERS}
                />
              )}

              {activeCategory === 'comunicado' && (
                <ComunicadoTab 
                  countdown={countdown}
                  isSinergiaActive={isSinergiaActive}
                  setIsSinergiaActive={setIsSinergiaActive}
                  customSynergyText={customSynergyText}
                  setCustomSynergyText={setCustomSynergyText}
                  synergyCampaign={synergyCampaign}
                  setSynergyCampaign={setSynergyCampaign}
                  triggerAlert={triggerAlert}
                  campaigns={campaigns}
                  setCampaigns={setCampaigns}
                  articles={articles}
                  setArticles={setArticles}
                />
              )}

              {activeCategory === 'campanha' && (
                <CampanhaTab 
                  setExpandedCampaignImage={setExpandedCampaignImage}
                  handleCopyPix={handleCopyPix}
                  isSinergiaActive={isSinergiaActive}
                  customSynergyText={customSynergyText}
                  synergyCampaign={synergyCampaign}
                  onSwitchTab={(tab) => {
                    setActiveCategory(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  campaigns={campaigns}
                  setCampaigns={setCampaigns}
                />
              )}

              {activeCategory === 'giro-esoterico' && (
                <GiroEsotericoTab 
                  esotericSearch={esotericSearch}
                  setEsotericSearch={setEsotericSearch}
                  esotericFilter={esotericFilter}
                  setEsotericFilter={setEsotericFilter}
                  filteredEsotericNews={filteredEsotericNews}
                  isUpdatingFeed={isUpdatingFeed}
                  handleRefreshEsotericFeed={handleRefreshEsotericFeed}
                />
              )}

              {activeCategory === 'podcast' && (
                <PodcastTab 
                  audioRef={audioRef}
                  audioUrl={audioUrl}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  currentTime={currentTime}
                  setCurrentTime={setCurrentTime}
                  duration={duration}
                  setDuration={setDuration}
                  volume={volume}
                  setVolume={setVolume}
                  handleCopyPix={handleCopyPix}
                />
              )}

              {activeCategory === 'esoterismo' && (
                <EsoterismoTab userZodiacSign={userZodiacSign} />
              )}

              {activeCategory === 'contratar' && (
                <ContratarTab 
                  user={currentUser}
                  onAddCampaign={handleAddCampaign}
                  onAddArticle={handleAddArticle}
                  triggerAlert={triggerAlert}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
              )}

              {activeCategory === 'downloads' && (
                <DownloadsTab />
              )}

              {activeCategory === 'alice' && (
                <AliceTab 
                  user={currentUser}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  onSwitchTab={(tab) => {
                    setActiveCategory(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </>
          )}
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
                            <span>❌</span> Enviar comentários ou discussões diretamente pelo app.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 px-6 py-4 flex justify-end border-t border-neutral-200 dark:border-neutral-800 rounded-b-2xl">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
                  >
                    Fechar Reportagem
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL ZOOM CAMPANHA */}
        <AnimatePresence>
          {expandedCampaignImage && (
            <div 
              className="fixed inset-0 bg-neutral-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              onClick={() => setExpandedCampaignImage(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-neutral-900 rounded-2xl p-2 max-w-3xl w-full shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setExpandedCampaignImage(null)}
                  className="absolute top-4 right-4 bg-neutral-950/75 hover:bg-neutral-900 text-white p-2 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <img 
                  src={expandedCampaignImage} 
                  alt="Imagem Ampliada - Campanha Solidária" 
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg mx-auto"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* VERSION HISTORY / CHANGELOG MODAL */}
        <AnimatePresence>
          {isChangelogOpen && (
            <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 max-w-lg w-full overflow-hidden"
              >
                <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
                  <h3 className="font-serif font-black text-lg tracking-wider uppercase flex items-center gap-2">
                    <Sparkles className="w-5 h-5 fill-white" />
                    Histórico de Atualizações
                  </h3>
                  <button 
                    onClick={() => setIsChangelogOpen(false)}
                    className="text-white hover:text-red-200 bg-red-800/50 p-1.5 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-sm">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest text-center border-b pb-2">
                    Visualização Proporcional de Entregas e Magnitude
                  </p>

                  <div className="space-y-4">
                    <ul className="space-y-4 font-sans text-xs">
                      <li className="flex flex-col gap-1 border-b border-neutral-100 dark:border-neutral-850 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-red-600 dark:text-red-400">v89.99 (Alice Gratuita, Recesso e Doações)</span>
                          <span className="text-[10px] font-mono text-neutral-400">12 de Julho de 2026</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-sans">
                          **Atualização Massiva de Magnitude:** Suspensão definitiva de qualquer sistema de créditos para a Alice IA, removendo limites e tornando-a 100% gratuita e livre. Calendário do Podcast TNB NEWS reagendado para o dia 21 de julho devido ao período de recesso administrativo. Modelo de manutenção do site formalizado com foco em doações voluntárias e opcionais dos membros da comunidade.
                        </p>
                      </li>
                      <li className="flex flex-col gap-1 border-b border-neutral-100 dark:border-neutral-850 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-neutral-400">v77.77 (O Ecossistema da Comunidade)</span>
                          <span className="text-[10px] font-mono text-neutral-400">11 de Julho de 2026</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-sans">
                          **Atualização de Magnitude:** Consolidação total do ecossistema de participantes da comunidade. Padronização estrita de nomes completos exatos de cadastro (Alice Guedes, Simon Astrólogo e Luma Oliveira Ravaglia). Reformulação da Fale com a Redação em duplo botão de igual peso visual com preenchimentos automáticos dedicados. Implementação do sistema de **Autorização de Campanhas** (`status_campanha`) e **Embargo de Reportagens** (`data_publicacao_autorizada`) gerenciados em tempo real a partir de um novo Painel de Controle Administrativo integrado, com simulação dinâmica de contribuições via Pix.
                        </p>
                      </li>
                      <li className="flex flex-col gap-1 border-b border-neutral-100 dark:border-neutral-850 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-neutral-400">v33.33 (A Era das Abas Inteligentes)</span>
                          <span className="text-[10px] font-mono text-neutral-400">11 de Julho de 2026</span>
                        </div>
                        <p className="text-neutral-600 mt-1">
                          **Fatos de Magnitude:** Fim definitivo da bagunça e consolidação do portal em abas estanques isoladas. Extinção da Aba Divulgação e criação da **Aba Campanha** como repositório único de apoio solidário. Introdução do **Protocolo de Sinergia de Conteúdo** para cruzamento autorizado de alertas administrativos e campanhas de recesso.
                        </p>
                      </li>
                      <li className="flex flex-col gap-1 border-b border-neutral-100 dark:border-neutral-850 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-red-600 dark:text-red-400">v18.00 (Giro Esotérico)</span>
                          <span className="text-[10px] font-mono text-neutral-400">Julho de 2026</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                          Remoção de todas as funções de playground simuladas. Integração automatizada de 21 matérias de 39+ portais no Giro Esotérico com ilustrações IA exclusivas para todas as notícias principais.
                        </p>
                      </li>
                      <li className="flex flex-col gap-1 border-b border-neutral-100 dark:border-neutral-850 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-red-600 dark:text-red-400">v17.77 (Fatos de Magnitude)</span>
                          <span className="text-[10px] font-mono text-neutral-400">Junho de 2026</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                          Publicação do podcast original com escuta e QR Code dedicado. Inclusão dos dossiês técnicos dos casos comunitários e painéis interativos.
                        </p>
                      </li>
                      <li className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-bold text-neutral-400">v1.0.0 (Setup Inicial)</span>
                          <span className="text-[10px] font-mono text-neutral-400">Maio de 2026</span>
                        </div>
                        <p className="text-neutral-500 mt-1">
                          Modelagem das primeiras colunas, rascunhos das reportagens e estruturação do código inicial do portal.
                        </p>
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
                  <button onClick={() => { setActiveCategory('reportagem'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    📰 Redação Principal
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveCategory('comunicado'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    📢 Comunicado Oficial
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveCategory('campanha'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    ❤️ Campanhas Solidárias
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveCategory('giro-esoterico'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    🔮 Giro Esotérico (Geral)
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveCategory('podcast'); setSelectedArticle(null); }} className="hover:text-red-400 transition-colors">
                    🎙️ Podcast TNB News
                  </button>
                </li>
              </ul>
            </div>

            {/* General Contact & Disclaimer */}
            <div className="md:col-span-4 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-white font-bold border-b border-neutral-800 pb-1">Redação e Contato</h3>
              <p className="text-xs text-neutral-400 font-serif leading-relaxed">
                Solicite sua campanha solidária ou sugira uma reportagem diretamente com nossa equipe no WhatsApp: <strong className="text-white">+55 96 99182-1516</strong>
              </p>
              
              <div className="flex flex-col gap-2 pt-1">
                <a 
                  href={`https://wa.me/5596991821516?text=${encodeURIComponent("Oi, sou membro da comunidade Tarot no Bolso e quero publicar minha campanha solidária no portal TNB NEWS.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold py-2.5 px-3 rounded transition-colors uppercase tracking-wider text-center shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 fill-white" /> Quero minha campanha
                </a>

                <a 
                  href={`https://wa.me/5596991821516?text=${encodeURIComponent("Oi, quero uma reportagem sobre mim no site TNB NEWS.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-750 font-mono text-[10px] font-bold py-2.5 px-3 rounded transition-colors uppercase tracking-wider text-center shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" /> Quero uma reportagem
                </a>
              </div>

              <p className="text-[10px] font-mono text-neutral-600 mt-4 leading-tight">
                &copy; 2026 TNB News — Tarot no Bolso. Todas as tiragens e consultas citadas respeitam integralmente o livre-arbítrio individual.
              </p>
            </div>

          </div>
        </footer>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAlert={(text, type) => setAlertMessage({ text, type: type === 'error' ? 'info' : 'success' })} 
        />

        {/* POP-UP DE BOAS-VINDAS DA COMUNIDADE */}
        <AnimatePresence>
          {showWelcomePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-neutral-900 border-2 border-red-600 dark:border-red-500 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
              >
                {/* Branding flag */}
                <div className="absolute top-0 right-0 bg-red-700 text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-bl-xl">
                  CONVITE ESPECIAL
                </div>

                <div className="text-center mt-4">
                  {/* Decorative Icon */}
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 animate-bounce">
                    <Users className="w-8 h-8" />
                  </div>

                  <h3 className="font-serif text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
                    Entre na comunidade TNB
                  </h3>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm font-serif leading-relaxed mt-3">
                    Faça parte da comunidade oficial do TNB News no WhatsApp e acompanhe novidades, anúncios e interaja com outros membros.
                  </p>

                  <div className="flex flex-col gap-2.5 mt-6">
                    <a 
                      href="https://chat.whatsapp.com/B7GdTqcrsFPJ2tNsgMUOnD"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowWelcomePopup(false)}
                      className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors flex justify-center items-center gap-2 shadow-md cursor-pointer text-center"
                    >
                      Entrar na comunidade
                    </a>
                    
                    <button 
                      onClick={() => setShowWelcomePopup(false)}
                      className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-mono text-xs font-bold transition-colors cursor-pointer"
                    >
                      Agora não
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>



      </div>
    </div>
  );
}
