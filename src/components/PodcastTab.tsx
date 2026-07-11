import React from 'react';
import { 
  Volume2, 
  Pause, 
  Play, 
  Award, 
  HelpCircle, 
  Phone 
} from 'lucide-react';

interface PodcastTabProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioUrl: string;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  duration: number;
  setDuration: (d: number) => void;
  volume: number;
  setVolume: (v: number) => void;
  handleCopyPix: () => void;
}

export default function PodcastTab({
  audioRef,
  audioUrl,
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  volume,
  setVolume,
  handleCopyPix
}: PodcastTabProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* PODCAST PLAYER */}
      <div className="bg-neutral-900 text-neutral-100 p-6 md:p-8 rounded-3xl shadow-xl border-b-4 border-red-600" id="secao-podcast">
        <div className="flex items-center gap-2.5 mb-5 border-b border-neutral-800 pb-4">
          <div className="bg-red-700 p-2 rounded-2xl text-white">
            <Volume2 className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold">Podcast TNB News: Edição de Recesso</h3>
            <p className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold mt-0.5">História & Bastidores da Comunidade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Aperte o play e ouça agora o áudio de fofocas esotéricas, furos editoriais e os bastidores das discussões que movimentam o portal Tarot no Bolso nesta semana de recesso.
            </p>

            {/* Simple Custom Audio Controller (Real, functional HTML5) */}
            <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-3">
              <audio 
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Playback Button & Time trackers */}
              <div className="flex items-center justify-between gap-3">
                <button 
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlaying) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="bg-red-700 hover:bg-red-800 text-white rounded-full p-3 transition-colors shadow flex items-center justify-center shrink-0"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>
                
                <div className="flex-1">
                  <input 
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Number(e.target.value);
                        setCurrentTime(Number(e.target.value));
                      }
                    }}
                    className="w-full accent-red-600 cursor-pointer h-1 bg-neutral-850 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1.5">
                    <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
                    <span>{duration ? new Date(duration * 1000).toISOString().substr(14, 5) : '00:00'}</span>
                  </div>
                </div>
              </div>

              {/* Volume Slider controller */}
              <div className="flex items-center gap-2 pt-1 border-t border-neutral-900">
                <span className="text-[10px] font-mono text-neutral-500">Volume:</span>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    if (audioRef.current) audioRef.current.volume = v;
                  }}
                  className="w-24 h-1 accent-neutral-400 bg-neutral-800 rounded"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex flex-col items-center text-center">
            <div className="bg-white p-1 rounded-lg">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663627993377/yOClMryKMwKcyLAr.png" 
                alt="Scan QR Code to Listen" 
                className="w-24 h-24 rounded border border-neutral-250"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[9px] font-mono text-neutral-400 mt-2 uppercase tracking-wider">Escutar pelo Celular</span>
            <p className="text-[9px] text-neutral-500 mt-1 leading-tight">Escaneie o QR Code acima para ouvir direto do seu smartphone!</p>
          </div>
        </div>
      </div>

      {/* CLARA'S UNBOXING VIDEO */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-black border-b border-neutral-200 dark:border-neutral-800 pb-2 text-neutral-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-red-600" />
          Unboxing do Prêmio Real: Clara Abre seu Deck Físico
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Confira abaixo o vídeo emocionante enviado pela Clara, registrando o unboxing da entrega do prêmio conquistado no bolão interno da comunidade. Transparência e diversão garantida!
        </p>
        
        <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 relative">
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

      {/* CANAIS DE AJUDA E CONTATO RÁPIDO (PLAY STORE STYLE - NO TABLES) */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <HelpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="font-serif text-lg font-black uppercase text-neutral-900 dark:text-white">Canais de Ajuda & Apoio Direto</h3>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
          Fale diretamente via WhatsApp com os responsáveis de cada campanha ou setor do site usando os links rápidos abaixo. Suas dúvidas serão sanadas com extrema atenção!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alice Help Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-serif font-black text-sm text-neutral-900 dark:text-white">Ajuda com o Ratinho (Alice)</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Esclareça dúvidas sobre as tabelas, adquira produtos do catálogo solidário ou apoie o tratamento do Ratinho Twister.
              </p>
            </div>
            <a 
              href="https://wa.me/555399234997?text=Oi%20Alice!%20Quero%20usar%20seu%20cat%C3%A1logo%20e%20tamb%C3%A9m%20ajudar%20seu%20ratinho."
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 fill-white" /> WhatsApp Alice
            </a>
          </div>

          {/* Luma Help Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-serif font-black text-sm text-neutral-900 dark:text-white">Apoio a Luma Ravaglia</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Agende tiragens personalizadas, faça sua doação direta ou apoie o sonho terapêutico da oraculista.
              </p>
            </div>
            <a 
              href="https://wa.me/5522997358696?text=Oi%20Luma!%20Quero%20te%20ajudar%20a%20participar%20do%20show."
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 fill-white" /> WhatsApp Luma
            </a>
          </div>

          {/* Eduardo Form Help Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-serif font-black text-sm text-neutral-900 dark:text-white">Formulários & Pautas (Eduardo)</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Solicite o formulário oficial de publicação ou envie relatos e fofocas esotéricas da comunidade.
              </p>
            </div>
            <a 
              href="https://wa.me/5596991821516?text=Ol%C3%A1%20Edu%2C%20quero%20preencher%20o%20formul%C3%A1rio%2C%20pode%20me%20mandar%3F"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 fill-white" /> WhatsApp Eduardo
            </a>
          </div>

          {/* Simon Help Box */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <h4 className="font-serif font-black text-sm text-neutral-900 dark:text-white">Agendamentos com Simon</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Apoie o tarólogo Simon agendando um atendimento de Tarot personalizado diretamente via chat.
              </p>
            </div>
            <a 
              href="https://wa.me/555197087948?text=Oi%20Simon!%20Quero%20fazer%20uma%20consulta%20e%20te%20ajudar."
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl transition-all uppercase tracking-wider"
            >
              <Phone className="w-3.5 h-3.5 fill-white" /> WhatsApp Simon
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}