import React from 'react';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

export default function DownloadsTab() {
  const apkLink = "https://www.mediafire.com/file/6qag484g14ulq6t/app-debug_%25281%2529.apk/file";
  const supportPhone = "096991821516";
  const whatsappLink = "https://wa.me/5596991821516";

  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto space-y-8">
      
      {/* Title */}
      <div className="border-b-2 border-red-700 pb-4">
        <h2 className="font-serif text-3xl font-black text-red-700 dark:text-red-500 uppercase tracking-tight flex items-center gap-2">
          <Smartphone className="w-8 h-8 text-red-600 dark:text-red-400" />
          Baixar Aplicativo Oficial do TNB News
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono mt-1">
          Acesse notícias esotéricas, campanhas, e interaja com a Alice IA diretamente na tela inicial do seu celular Android.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* APK Download Info block */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">Instalação Segura e Simplificada</h3>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-650 dark:text-neutral-350 font-sans">
              O TNB News foi empacotado sob medida em formato APK para garantir acesso irrestrito ao aplicativo da comunidade Tarot no Bolso, sem burocracias de lojas externas. O download é feito de forma segura e direta via MediaFire.
            </p>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                <ShieldCheck className="w-4.5 h-4.5 text-green-600 shrink-0" />
                <span>Arquivo original verificado por MD5 contra adulteração.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                <CheckCircle className="w-4.5 h-4.5 text-green-600 shrink-0" />
                <span>Luz suave integrada e consumo de rede otimizado para dados móveis.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-mono">
                <CheckCircle className="w-4.5 h-4.5 text-green-600 shrink-0" />
                <span>Totalmente compatível com Android 8.0 Oreo até Android 14+.</span>
              </div>
            </div>
          </div>

          <a 
            href={apkLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-mono text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.01] shadow-lg cursor-pointer animate-pulse"
          >
            <Download className="w-5 h-5" />
            Baixar APK Oficial do App (MediaFire)
          </a>
        </div>

        {/* Visual phone screen container */}
        <div className="md:col-span-5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40 flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-1">DOWNLOAD VERIFICADO</span>
          <h4 className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">Versão Recente (Estável)</h4>
          <span className="text-sm font-serif font-bold text-red-700 dark:text-red-500 mt-1">tnb-news-v89.99.apk</span>
        </div>

      </div>

      {/* SUPPORT & ATENDIMENTO SECTION */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-4">
        <div className="bg-red-50/50 dark:bg-red-950/15 border border-red-200/50 dark:border-red-900/30 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-7 space-y-2">
              <h4 className="font-serif text-xl font-bold text-neutral-950 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5.5 h-5.5 text-red-600 dark:text-red-400" />
                Precisa de Suporte Técnico?
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
                Se você tiver dificuldades com o download, doações via Pix, ou uso da Alice AI, entre em contato imediatamente com nossa redação oficial!
              </p>
            </div>

            <div className="md:col-span-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                WhatsApp: {supportPhone}
              </a>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
