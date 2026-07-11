import React from 'react';
import { motion } from 'motion/react';
import { Phone, FileText, AlertCircle } from 'lucide-react';

interface CampanhaTabProps {
  setExpandedCampaignImage: (url: string | null) => void;
  handleCopyPix: () => void;
  isSinergiaActive: boolean;
  customSynergyText: string;
  synergyCampaign: string;
  onSwitchTab?: (tab: string) => void;
}

export default function CampanhaTab({
  setExpandedCampaignImage,
  handleCopyPix,
  isSinergiaActive,
  customSynergyText,
  synergyCampaign,
  onSwitchTab
}: CampanhaTabProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* INTEGRATED SYNERGY BANNER */}
      {isSinergiaActive && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white p-5 rounded-3xl shadow-lg border border-indigo-500/50 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white text-lg shrink-0 mt-0.5 animate-pulse">
              📢
            </span>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-indigo-200 font-black">
                Alerta Administrativo Integrado (Protocolo de Sinergia)
              </p>
              <p className="text-sm font-semibold leading-snug mt-0.5">
                {customSynergyText || "Atenção: Período de recesso oficial em andamento de 10/07 a 17/07/2026. Suporte oficial temporariamente reduzido."}
              </p>
              {synergyCampaign !== 'todas' && (
                <span className="inline-block text-[9px] bg-white/10 text-indigo-200 font-mono px-2 py-0.5 rounded mt-1.5 uppercase font-bold tracking-wider">
                  ⚠️ Vinculado a: {synergyCampaign === 'ratinho' ? 'Campanha Ratinho Twister' : synergyCampaign === 'simon' ? 'Campanha Simon' : 'Campanha Luma Ravaglia'}
                </span>
              )}
            </div>
          </div>
          {onSwitchTab && (
            <button 
              onClick={() => onSwitchTab('comunicado')}
              className="shrink-0 bg-white hover:bg-neutral-100 text-indigo-900 font-mono text-xs font-black py-2.5 px-4 rounded-xl shadow-sm transition-all hover:scale-103 uppercase tracking-wider"
            >
              Ver Comunicado Completo →
            </button>
          )}
        </motion.div>
      )}

      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-red-600 dark:text-red-450 font-bold">
          Campanhas Verificadas
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-black text-neutral-900 dark:text-white mt-1">
          Espaço Solidário da Comunidade TNB
        </h2>
        <p className="text-xs text-neutral-500 max-w-lg mx-auto mt-2 leading-relaxed">
          Confira as histórias e campanhas atualmente ativas e apoiadas pela administração. Todo apoio enviado vai diretamente para os responsáveis.
        </p>
      </div>

      {/* CASE 1: HISTÓRIA DO RATO (ALICE'S CAMPAIGN) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-violet-500 bg-gradient-to-br from-violet-50/95 via-[#fefefe]/95 to-pink-50/95 p-6 md:p-8 shadow-xl dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:border-violet-600"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/80 dark:text-violet-400 text-2xl shrink-0">
              🐭
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-violet-600 text-white dark:bg-violet-950 dark:text-violet-350 px-2 py-0.5 rounded font-bold">
                Campanha Ativa #1
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-0.5">
                Ajude um Ratinho Resgatado: Transformando Medo em Cuidado
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-sm text-neutral-850 dark:text-neutral-300 leading-relaxed font-sans">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
            Estou divulgando meu catálogo para arrecadar fundos e custear o tratamento de um ratinho Twister que resgatei de uma situação de negligência extrema.
          </p>
          
          <p>
            Ele seria descartado por ser considerado erroneamente "agressivo", mas descobrimos que seu comportamento acuado era apenas um reflexo da dor, negligência e do medo constante que sentia.
          </p>

          <div className="bg-white/80 dark:bg-neutral-900/80 border border-violet-200 dark:border-violet-850 p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-serif font-black text-xs uppercase text-violet-800 dark:text-violet-400 flex items-center gap-1">
              🔬 A Situação Delicada dele:
            </h4>
            <p className="text-xs leading-relaxed">
              Devido à falta prolongada de água e comida em seu cativeiro anterior, ele é bem menor e mais magro do que deveria ser para a idade. A desidratação severa comprometeu drasticamente sua produção de saliva, o que dificulta severamente sua limpeza natural e afeta gravemente sua pele e saúde como um todo.
            </p>
            <p className="text-xs leading-relaxed">
              Hoje, ele já recebe os primeiros cuidados e muito carinho, mas ainda precisamos de ajuda urgente para garantir <strong>alimentação especial, enriquecimento ambiental adequado e acompanhamento veterinário especializado</strong> para que ele possa finalmente ter a vida digna que merece.
            </p>
          </div>

          <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 p-4 rounded-xl text-xs space-y-1">
            <p className="font-bold text-violet-900 dark:text-violet-300">
              🛍️ Catálogo Solidário de Produtos:
            </p>
            <p>
              Comprando qualquer produto do catálogo da Alice, 100% do lucro é destinado diretamente para custear os tratamentos, rações especiais e medicamentos do ratinho resgatado.
            </p>
            <p className="font-medium text-red-750 dark:text-red-400 mt-2">
              ⚠️ Qualquer dúvida e informações detalhadas sobre a tabela de preços do catálogo solidário somente via WhatsApp!
            </p>
          </div>

          {/* Interactive Catalog Images & QR Code (Play Store layout, NO TABLES!) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Catalog Image 1 */}
            <div 
              onClick={() => setExpandedCampaignImage('https://i.postimg.cc/VdHWNtyF/IMG-20260711-WA0997.jpg')}
              className="group cursor-zoom-in overflow-hidden rounded-2xl border border-violet-200 dark:border-violet-800 shadow-sm aspect-square bg-neutral-900 relative"
            >
              <img 
                src="https://i.postimg.cc/VdHWNtyF/IMG-20260711-WA0997.jpg" 
                alt="Catálogo Solidário Tabela 1" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white font-mono bg-pink-600 px-2 py-0.5 rounded">
                  Tabela 1 (Clique para ampliar)
                </span>
              </div>
            </div>

            {/* Catalog Image 2 */}
            <div 
              onClick={() => setExpandedCampaignImage('https://i.postimg.cc/MvrmGBkf/IMG-20260711-WA0998.jpg')}
              className="group cursor-zoom-in overflow-hidden rounded-2xl border border-violet-200 dark:border-violet-800 shadow-sm aspect-square bg-neutral-900 relative"
            >
              <img 
                src="https://i.postimg.cc/MvrmGBkf/IMG-20260711-WA0998.jpg" 
                alt="Catálogo Solidário Tabela 2" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-bold text-white font-mono bg-pink-600 px-2 py-0.5 rounded">
                  Tabela 2 (Clique para ampliar)
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div 
              onClick={() => setExpandedCampaignImage('https://i.postimg.cc/5YczC5pk/image.jpg')}
              className="group cursor-zoom-in overflow-hidden rounded-2xl border border-violet-200 dark:border-violet-800 shadow-sm p-4 bg-white dark:bg-neutral-950 flex flex-col justify-between items-center text-center hover:opacity-95 transition-opacity"
            >
              <img 
                src="https://i.postimg.cc/5YczC5pk/image.jpg" 
                alt="WhatsApp QR Code" 
                className="w-32 h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-800"
                referrerPolicy="no-referrer"
              />
              <span className="text-[9px] font-mono font-bold text-neutral-500 mt-2 uppercase tracking-wider block">
                QR Code Alice (Ampliar)
              </span>
            </div>
          </div>

          {/* Alice WhatsApp Button */}
          <div className="text-center pt-4">
            <a 
              href="https://wa.me/555399234997?text=Oi%20Alice!%20Quero%20usar%20seu%20cat%C3%A1logo%20e%20tamb%C3%A9m%20ajudar%20seu%20ratinho."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-mono text-xs font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:scale-102 uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 fill-white" /> Falar com Alice no WhatsApp (+55 53 9923-4997)
            </a>
          </div>
        </div>
      </motion.div>

      {/* CASE 2: HISTÓRIA DO SIMON */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-red-500 bg-gradient-to-br from-red-50/95 via-[#fefefe]/95 to-amber-50/95 p-6 md:p-8 shadow-xl dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:border-red-600"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-450 text-2xl shrink-0">
              🔮
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-red-600 text-white dark:bg-red-950 px-2 py-0.5 rounded font-bold">
                Campanha Ativa #2
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-0.5">
                Campanha Solidária de Apoio ao Tarólogo Simon
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-sm text-neutral-850 dark:text-neutral-300 leading-relaxed font-sans">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
            Simon é um dos membros fundadores e tarólogos mais ativos da comunidade Tarot no Bolso, famoso por sua extrema dedicação em realizar leituras, acolhimento e aconselhamentos sociais para todos os desejosos.
          </p>
          
          <p>
            Ele está organizando esta campanha solidária transparente para arrecadar fundos urgentes e liquidar uma dívida pessoal acumulada no valor de <strong>R$ 300,00</strong>.
          </p>

          <div className="bg-white/80 dark:bg-neutral-900/80 border border-red-200 dark:border-red-950 p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-serif font-black text-xs uppercase text-red-800 dark:text-red-400 flex items-center gap-1">
              🤝 Como apoiar de verdade:
            </h4>
            <p className="text-xs leading-relaxed">
              Você pode colaborar diretamente de duas formas: contratando uma tiragem de Tarot individual e personalizada diretamente com ele, agendando aconselhamento astrológico completo ou realizando uma contribuição voluntária via PIX de qualquer valor. Todo o suporte financeiro arrecadado vai de forma direta e integral para o Simon.
            </p>
          </div>

          {/* Simon WhatsApp Button */}
          <div className="text-center pt-2">
            <a 
              href="https://wa.me/555197087948?text=Oi%20Simon!%20Quero%20fazer%20uma%20consulta%20e%20te%20ajudar."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white font-mono text-xs font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:scale-102 uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 fill-white" /> Falar com Simon no WhatsApp (+55 51 9708-7948)
            </a>
          </div>
        </div>
      </motion.div>

      {/* CASE 3: HISTÓRIA DA LUMA */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-fuchsia-500 bg-gradient-to-br from-fuchsia-50/95 via-[#fefefe]/95 to-violet-50/95 p-6 md:p-8 shadow-xl dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:border-fuchsia-600"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/80 dark:text-fuchsia-400 text-2xl shrink-0">
              🎸
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-fuchsia-600 text-white dark:bg-fuchsia-950 px-2 py-0.5 rounded font-bold">
                Campanha Ativa #3
              </span>
              <h3 className="font-serif text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-0.5">
                A Jornada de Luma: Superação, Cura e Fé
              </h3>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-sm text-neutral-850 dark:text-neutral-300 leading-relaxed font-sans">
          <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
            Apoiamos Luma Oliveira Ravaglia (a punkstar do tarot), oraculista e magista dedicada há mais de uma década, em sua caminhada de cura e na realização do seu sonho de superação de assistir ao show do Colson (Machine Gun Kelly) em Minas Gerais.
          </p>
          
          <p>
            Luma enfrenta o Transtorno de Personalidade Borderline (TPB) e Fibromialgia severa. O show representa um marco terapêutico vital de superação física, mental e de renovação de fé na sua jornada pessoal.
          </p>

          {/* Pix Copy Box */}
          <div className="bg-white/80 dark:bg-neutral-900/80 border border-fuchsia-200 dark:border-fuchsia-900 p-5 rounded-2xl space-y-3 shadow-xs">
            <h4 className="font-serif font-black text-xs uppercase text-fuchsia-800 dark:text-fuchsia-400">
              🔑 Apoie via Pix Direto (Luma):
            </h4>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="bg-neutral-100 dark:bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 font-mono text-xs select-all flex-1 flex items-center justify-between">
                <span>g0thmystic@gmail.com</span>
                <span className="text-[9px] text-fuchsia-600 dark:text-fuchsia-400 uppercase font-bold">E-mail</span>
              </div>
              <button 
                onClick={handleCopyPix}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-mono text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" /> Copiar Chave
              </button>
            </div>
          </div>

          {/* Luma WhatsApp Button */}
          <div className="text-center pt-2">
            <a 
              href="https://wa.me/5522997358696?text=Oi%20Luma!%20Quero%20te%2520ajudar%2520a%2520participar%2520do%2520show."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-mono text-xs font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:scale-102 uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 fill-white" /> Falar com Luma no WhatsApp (+55 22 99735-8696)
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}