import React from 'react';
import { 
  Search, 
  X, 
  AlertCircle, 
  User, 
  Calendar, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Phone 
} from 'lucide-react';
import { Article } from '../types';

interface HomeTabProps {
  articles: Article[];
  filteredArticles: Article[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSelectedArticle: (art: Article) => void;
  TEAM_MEMBERS: { name: string; role: string }[];
}

export default function HomeTab({
  articles,
  filteredArticles,
  searchQuery,
  setSearchQuery,
  setSelectedArticle,
  TEAM_MEMBERS
}: HomeTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: TEAM ARTICLES & COUNCIL PANEL */}
      <section className="lg:col-span-8 space-y-10">
        {searchQuery && (
          <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm dark:bg-neutral-900 dark:border-neutral-850 dark:text-neutral-100 shadow-sm">
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

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl shadow-sm">
            <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4 animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-neutral-800 dark:text-neutral-200">Nenhuma notícia encontrada</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2 max-w-md mx-auto">
              Não localizamos matérias com esses termos em nossa redação.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-5 inline-flex items-center gap-1.5 bg-red-600 text-white font-mono text-xs px-4 py-2 hover:bg-red-700 transition-all uppercase tracking-wider rounded-xl shadow-md"
            >
              Ver Tudo
            </button>
          </div>
        ) : (
          <>
            {/* FEATURED HIGHLIGHT (only when no query) */}
            {!searchQuery && articles[0] && (
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8" id="destaque-principal">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-red-700 text-white font-mono font-bold text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm">
                    Destaque Editorial
                  </span>
                  <span className="text-xs font-mono text-neutral-500">TNB Premium</span>
                </div>
                
                <div className="group cursor-pointer" onClick={() => setSelectedArticle(articles[0])}>
                  <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                    {articles[0].title}
                  </h2>
                  <p className="font-serif italic text-base md:text-lg text-neutral-600 dark:text-neutral-400 mt-3 mb-5 leading-relaxed max-w-3xl font-light">
                    {articles[0].subtitle}
                  </p>
                  
                  <div className="relative overflow-hidden border border-neutral-200 dark:border-neutral-850 mb-6 bg-neutral-100 dark:bg-neutral-900 group-hover:shadow-md transition-all rounded-2xl">
                    <img 
                      src={articles[0].imageUrl} 
                      alt={articles[0].title} 
                      referrerPolicy="no-referrer"
                      className="w-full object-cover max-h-[460px] md:max-h-[500px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
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
                      className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-mono text-xs px-5 py-3.5 transition-all uppercase tracking-wider font-bold rounded-xl shadow-md"
                    >
                      <BookOpen className="w-4 h-4" /> Ler na Íntegra
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* OTHER ARTICLES GRID */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-2">
                <h3 className="font-serif text-lg font-bold tracking-tight uppercase flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-700 dark:text-red-400" />
                  {!searchQuery ? 'Outras Coberturas da Comunidade' : 'Reportagens Encontradas'}
                </h3>
                <span className="font-mono text-xs text-neutral-500">
                  {filteredArticles.filter(art => searchQuery ? true : art.id !== 'art-1').length} matérias no feed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles
                  .filter(art => searchQuery ? true : art.id !== 'art-1')
                  .map(article => (
                    <div 
                      key={article.id} 
                      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col justify-between hover:shadow-lg transition-all relative hover:border-red-500 dark:hover:border-red-500 group rounded-2xl"
                      id={`card-noticia-${article.id}`}
                    >
                      <div>
                        <div className="relative aspect-video mb-4 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800">
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

        {/* COUNCIL PANEL WIDGET (Conselho Editorial) */}
        <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-850 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-250 dark:border-neutral-800 pb-3">
            <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-serif text-lg font-black uppercase text-neutral-900 dark:text-white">Conselho Editorial</h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            Os membros fundadores e jornalistas independentes da comunidade Tarot no Bolso responsáveis pela apuração de bastidores:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="flex flex-col bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-150 dark:border-neutral-800 shadow-xs">
                <span className="font-serif font-bold text-sm text-neutral-900 dark:text-white">{member.name}</span>
                <span className="text-[10px] text-red-600 dark:text-red-400 mt-1 font-mono uppercase tracking-wider">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: SIDEBAR */}
      <aside className="lg:col-span-4 space-y-8">
        {/* FALE COM A REDAÇÃO */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-4" id="secao-redacao-oficial">
          <h3 className="font-serif text-lg font-black border-b border-neutral-200 dark:border-neutral-800 pb-2 text-red-700 dark:text-red-400 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Fale com a Redação
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Todas as sugestões de matérias, denúncias, relatos e fofocas esotéricas devem ser enviadas exclusivamente pelo número oficial da nossa equipe.
          </p>
          
          <div className="bg-red-50/50 dark:bg-red-950/25 p-4 rounded-xl border border-red-200/40 dark:border-red-900/40 space-y-3">
            <span className="block text-[10px] font-mono text-red-950 dark:text-red-400 uppercase tracking-wider font-bold">Canal Único no WhatsApp:</span>
            <a 
              href="https://wa.me/5596991821516?text=Ol%C3%A1%20Edu%2C%20quero%20preencher%20o%20formul%C3%A1rio%2C%20pode%20me%20mandar%3F"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-mono text-xs font-bold py-3 px-4 rounded-xl transition-all uppercase tracking-wider text-center shadow-sm"
            >
              <Phone className="w-4 h-4 fill-white" /> WhatsApp: (96) 99182-1516
            </a>
          </div>

          <div className="space-y-2.5 pt-2">
            <h4 className="font-serif font-bold text-xs text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
              Canal Oficial para:
            </h4>
            <ul className="space-y-2 text-xs font-mono text-neutral-600 dark:text-neutral-350">
              <li className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400">●</span> Sugestões de matérias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400">●</span> Informações sobre o grupo TNB
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600 dark:text-red-400">●</span> Envio de relatos e acontecimentos
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}