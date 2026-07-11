import React from 'react';
import { 
  Globe, 
  RefreshCw, 
  Search, 
  X, 
  ExternalLink 
} from 'lucide-react';

interface EsotericNewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  imageUrl: string;
}

interface GiroEsotericoTabProps {
  esotericSearch: string;
  setEsotericSearch: (q: string) => void;
  esotericFilter: string;
  setEsotericFilter: (cat: string) => void;
  filteredEsotericNews: EsotericNewsItem[];
  isUpdatingFeed: boolean;
  handleRefreshEsotericFeed: () => void;
}

export default function GiroEsotericoTab({
  esotericSearch,
  setEsotericSearch,
  esotericFilter,
  setEsotericFilter,
  filteredEsotericNews,
  isUpdatingFeed,
  handleRefreshEsotericFeed
}: GiroEsotericoTabProps) {
  return (
    <div 
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6"
      id="secao-noticias-esotericas"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-700 p-2 rounded-2xl text-white">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
              Giro Esotérico Global
              <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                Auto-Update
              </span>
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-sans">Varredura periódica e monitoramento em tempo real de 39 portais místicos do Brasil</p>
          </div>
        </div>
        
        <button 
          onClick={handleRefreshEsotericFeed}
          disabled={isUpdatingFeed}
          className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-red-750 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 self-start md:self-auto disabled:opacity-50"
          id="btn-atualizar-feed-esoterico"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingFeed ? 'animate-spin' : ''}`} />
          {isUpdatingFeed ? 'Sincronizando...' : 'Varrer Portais'}
        </button>
      </div>

      {/* Feed Search and Quick Category Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-850">
        <div className="md:col-span-4 relative">
          <span className="absolute left-3 top-3.5 text-neutral-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input 
            type="text"
            placeholder="Filtrar matérias esotéricas..."
            value={esotericSearch}
            onChange={(e) => setEsotericSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 font-mono text-neutral-900 dark:text-white"
            id="input-esoteric-search"
          />
          {esotericSearch && (
            <button onClick={() => setEsotericSearch('')} className="absolute right-3 top-3.5 text-neutral-400 hover:text-neutral-900">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="md:col-span-8 flex flex-wrap gap-1.5 justify-start md:justify-end">
          {['todos', 'Tarot', 'Astrologia', 'Espiritualidade', 'Cristais', 'Mediunidade', 'Sonhos', 'Umbanda'].map(cat => (
            <button
              key={cat}
              onClick={() => setEsotericFilter(cat)}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-lg transition-all border ${
                esotericFilter === cat 
                  ? 'bg-red-700 border-red-700 text-white font-bold' 
                  : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {cat === 'todos' ? 'Ver Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Esoteric Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEsotericNews.map(item => (
          <div 
            key={item.id}
            className="bg-[#fcfcfa] dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
          >
            <div>
              {/* Image header */}
              <div className="relative aspect-video mb-4 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800/40">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-neutral-900/95 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                  {item.category}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1">
                <span className="text-red-700 dark:text-red-400 uppercase tracking-widest font-bold">{item.source}</span>
                <span>{item.date}</span>
              </div>

              <h4 className="font-serif font-black text-sm text-neutral-900 dark:text-white tracking-tight leading-snug line-clamp-2 mt-1">
                {item.title}
              </h4>

              <p className="text-neutral-600 dark:text-neutral-455 text-xs mt-2 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 mt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-500">
                🔑 Varredura Concluída
              </span>
              <a 
                href="https://wa.me/5596991821516?text=Ol%C3%A1!%20Vi%20as%20not%C3%ADcias%20do%20Giro%20Esot%C3%A9rico%20e%20gostaria%20de%20saber%20mais." 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-mono font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
              >
                Saber mais <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredEsotericNews.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xs text-neutral-500 font-mono">Nenhuma notícia correspondente encontrada no Giro Esotérico.</p>
        </div>
      )}
    </div>
  );
}