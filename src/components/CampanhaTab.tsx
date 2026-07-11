import React from 'react';
import { motion } from 'motion/react';
import { Phone, FileText, AlertCircle } from 'lucide-react';

export interface Campanha {
  id: string;
  fullName: string;
  title: string;
  status_campanha: 'autorizada' | 'pendente';
  meta: number;
  arrecadado: number;
  whatsappText: string;
  phone: string;
  formattedPhone: string;
  pix?: string;
}

interface CampanhaTabProps {
  setExpandedCampaignImage: (url: string | null) => void;
  handleCopyPix: () => void;
  isSinergiaActive: boolean;
  customSynergyText: string;
  synergyCampaign: string;
  onSwitchTab?: (tab: string) => void;
  campaigns: Campanha[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campanha[]>>;
}

export default function CampanhaTab({
  setExpandedCampaignImage,
  handleCopyPix,
  isSinergiaActive,
  customSynergyText,
  synergyCampaign,
  onSwitchTab,
  campaigns,
  setCampaigns
}: CampanhaTabProps) {
  // Only render authorized campaigns in the public campaign tab
  const authorizedCampaigns = campaigns.filter(c => c.status_campanha === 'autorizada');

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
                  ⚠️ Vinculado a: {
                    synergyCampaign === 'ratinho' || synergyCampaign === 'alice' ? 'Campanha Alice Guedes' : 
                    synergyCampaign === 'simon' ? 'Campanha Simon Cardoso de Oliveira' :
                    'Campanha Luma Ravaglia'
                  }
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

      <div className="border-b border-red-250 dark:border-red-900/55 pb-3 text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-red-600 dark:text-red-450 font-bold">
          Campanhas Verificadas
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-black text-red-950 dark:text-red-100 mt-1">
          Espaço Solidário da Comunidade TNB
        </h2>
        <p className="text-xs text-red-800 dark:text-red-300 max-w-lg mx-auto mt-2 leading-relaxed font-medium">
          Confira as histórias e campanhas atualmente ativas e apoiadas pela administração. Todo apoio enviado vai diretamente para os responsáveis de forma integral e sem taxas intermediárias.
        </p>
      </div>

      {authorizedCampaigns.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-950 p-8 rounded-2xl shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
          <h3 className="font-serif text-xl font-bold text-red-900 dark:text-red-150">Nenhuma Campanha Ativa</h3>
          <p className="text-red-800 dark:text-red-300 text-sm max-w-md mx-auto">
            Atualmente não existem campanhas de arrecadação autorizadas e ativas. Você pode solicitar uma campanha através do menu Redação e Contato.
          </p>
        </div>
      ) : (
        authorizedCampaigns.map((c, idx) => {
          // Dynamic financial math
          const hasMeta = c.meta > 0;
          const falta = hasMeta ? Math.max(0, c.meta - c.arrecadado) : 0;
          const rawPercent = hasMeta ? (c.arrecadado / c.meta) * 100 : 0;
          const percent = Math.min(100, Math.round(rawPercent));
          
          // Generate customized block layout representing progress: e.g. [██████░░░░░] 40%
          const filledBlocks = Math.round(percent / 10);
          const asciiBar = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);

          // Customize colors per campaign
          const isLuma = c.id === 'luma';
          const isAlice = c.id === 'alice';
          const isSimon = c.id === 'simon';

          const cardBorder = isLuma 
            ? 'border-fuchsia-500 dark:border-fuchsia-600' 
            : isSimon
              ? 'border-red-500 dark:border-red-600'
              : 'border-violet-500 dark:border-violet-600';

          const cardBg = isLuma 
            ? 'from-fuchsia-50/95 via-[#fefefe]/95 to-violet-50/95' 
            : isSimon
              ? 'from-red-50/95 via-[#fefefe]/95 to-amber-50/95'
              : 'from-violet-50/95 via-[#fefefe]/95 to-pink-50/95';

          const iconBg = isLuma ? 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/80 dark:text-fuchsia-400'
            : isSimon ? 'bg-red-100 text-red-650 dark:bg-red-950/80 dark:text-red-400'
            : 'bg-violet-100 text-violet-600 dark:bg-violet-950/80 dark:text-violet-400';

          const categoryBadge = isLuma ? 'bg-fuchsia-600 text-white dark:bg-fuchsia-950'
            : isSimon ? 'bg-red-600 text-white dark:bg-red-950'
            : 'bg-violet-600 text-white dark:bg-violet-950 dark:text-violet-350';

          const icon = isLuma ? '🎸' : isSimon ? '🔮' : '🐭';

          return (
            <motion.div 
              key={c.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`overflow-hidden rounded-3xl border-2 ${cardBorder} bg-gradient-to-br ${cardBg} p-6 md:p-8 shadow-xl dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shrink-0 ${iconBg}`}>
                    {icon}
                  </span>
                  <div>
                    <span className={`text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded font-bold ${categoryBadge}`}>
                      Campanha de {c.fullName}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-black text-red-950 dark:text-red-100 tracking-tight mt-0.5">
                      {c.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Progress and Financial Info Box */}
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/65 dark:border-neutral-800 rounded-2xl p-5 mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                  <div className="border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-0 sm:pr-4">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block">Arrecadado</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-450 font-sans">
                      {c.arrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-800 pb-3 sm:pb-0 sm:px-4">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block">Meta</span>
                    <span className="text-lg font-black text-red-900 dark:text-red-200 font-sans">
                      {hasMeta ? c.meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Sem meta definida'}
                    </span>
                  </div>
                  <div className="sm:pl-4">
                    <span className="text-[10px] uppercase font-mono text-neutral-500 block">Falta</span>
                    <span className="text-lg font-black text-red-650 dark:text-red-400 font-sans">
                      {hasMeta ? falta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Contribuição Livre'}
                    </span>
                  </div>
                </div>

                {/* Aesthetic Progress Bar following exactly the [███░░░] 7% user-requested spec */}
                <div className="space-y-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-850">
                  <div className="flex justify-between text-xs font-mono font-bold text-red-800 dark:text-red-300">
                    <span className="tracking-widest">
                      {hasMeta ? `[${asciiBar}] ${percent}%` : `[░░░░░░░░░░] Sem meta definida`}
                    </span>
                    <span>Progresso Geral</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden shadow-inner relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isLuma ? 'bg-gradient-to-r from-fuchsia-500 to-violet-500' :
                        isSimon ? 'bg-gradient-to-r from-red-500 to-amber-500' :
                        'bg-gradient-to-r from-violet-500 to-pink-500'
                      }`}
                      style={{ width: `${hasMeta ? percent : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Narrative Section */}
              <div className="space-y-6 text-sm text-red-800 dark:text-red-300 leading-relaxed font-sans">
                {isAlice && (
                  <>
                    <p className="font-semibold text-red-950 dark:text-red-150 text-base">
                      Estou divulgando meu catálogo para arrecadar fundos e custear o tratamento de um ratinho Twister que resgatei de uma situação de negligência extrema.
                    </p>
                    <p className="text-red-800 dark:text-red-300">
                      Ele seria descartado por ser considerado erroneamente "agressivo", mas descobrimos que seu comportamento acuado era apenas um reflexo da dor, negligência e do medo constante que sentia.
                    </p>
                    <div className="bg-white/80 dark:bg-neutral-900/80 border border-violet-200 dark:border-violet-850 p-5 rounded-2xl space-y-3 shadow-xs">
                      <h4 className="font-serif font-black text-xs uppercase text-red-800 dark:text-red-400 flex items-center gap-1">
                        🔬 A Situação Delicada dele:
                      </h4>
                      <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
                        Devido à falta prolongada de água e comida em seu cativeiro anterior, ele é bem menor e mais magro do que deveria ser para a idade. A desidratação severa comprometeu drasticamente sua produção de saliva, o que dificulta severamente sua limpeza natural e afeta gravemente sua pele e saúde como um todo.
                      </p>
                      <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
                        Hoje, ele já recebe os primeiros cuidados e muito carinho, mas ainda precisamos de ajuda urgente para garantir <strong>alimentação especial, enriquecimento ambiental adequado e acompanhamento veterinário especializado</strong> para que ele possa finalmente ter a vida digna que merece.
                      </p>
                    </div>

                    <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 p-4 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-red-900 dark:text-red-300">
                        🛍️ Catálogo Solidário de Produtos &amp; Tiragens:
                      </p>
                      <p className="text-red-800 dark:text-red-300">
                        Comprando qualquer produto do catálogo da Alice Guedes, 100% do lucro é destinado diretamente para custear os tratamentos, rações especiais e medicamentos do ratinho resgatado.
                      </p>
                      <p className="text-red-800 dark:text-red-350 font-bold mt-2 bg-violet-100/50 dark:bg-violet-900/30 p-2.5 rounded-lg border border-violet-200/50">
                        🔮 Promoção Especial: Quem fizer tiragem com a Alice tem de 20% a 30% de desconto! Uma excelente oportunidade de obter orientação oracular e ajudar o ratinho.
                      </p>
                      <p className="font-medium text-red-750 dark:text-red-400 mt-2">
                        ⚠️ Qualquer dúvida e informações detalhadas sobre a tabela de preços do catálogo solidário e tiragens somente via WhatsApp!
                      </p>
                    </div>

                    {/* Interactive Catalog Images & QR Code */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
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
                        <span className="text-[9px] font-mono font-bold text-red-650 mt-2 uppercase tracking-wider block">
                          QR Code Alice (Ampliar)
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {isSimon && (
                  <>
                    <div className="border-l-4 border-red-500 pl-4 space-y-2">
                      <p className="font-semibold text-red-950 dark:text-red-150 text-base">
                        Campanha Solidária de Apoio ao Cartomante Simon Cardoso de Oliveira
                      </p>
                      <p className="text-red-800 dark:text-red-300">
                        O objetivo da campanha é arrecadar <strong>R$ 1.274,58</strong>, valor que corresponde ao total de duas faturas de cartão de crédito atualmente em aberto: uma de R$ 574,58 e outra de R$ 700,00. A arrecadação tem como finalidade quitar integralmente essas dívidas antes que os juros, multas e encargos aumentem ainda mais o valor devido, agravando sua situação financeira.
                      </p>
                    </div>

                    <div className="bg-white/80 dark:bg-neutral-900/80 border border-red-250 dark:border-red-950 p-5 rounded-2xl space-y-3 shadow-xs">
                      <h4 className="font-serif font-black text-xs uppercase text-red-800 dark:text-red-400 flex items-center gap-1.5">
                        🔮 A Situação e Histórico de Simon:
                      </h4>
                      <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
                        Segundo Simon, ele trabalha como funcionário terceirizado e recebe uma remuneração inferior ao salário mínimo, o que torna extremamente difícil cobrir todas as despesas mensais. Para complementar sua renda, ele também atua como cartomante, realizando leituras e atendimentos particulares.
                      </p>
                      <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
                        No entanto, nas últimas semanas houve uma redução significativa na procura pelos seus serviços, fazendo com que sua renda extra diminuísse justamente no momento em que as faturas venceram.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-4 rounded-xl text-xs space-y-2">
                      <p className="font-bold text-red-900 dark:text-red-300">
                        📋 Finalidade e Transparência dos Recursos:
                      </p>
                      <p className="text-red-800 dark:text-red-300">
                        Mesmo mantendo sua atividade profissional e buscando formas de aumentar a renda, Simon relata que, no momento, não possui recursos suficientes para quitar essas despesas sem comprometer necessidades básicas. Por esse motivo, decidiu recorrer à campanha de arrecadação como uma alternativa para evitar que a dívida continue crescendo devido à cobrança de juros e outros encargos financeiros.
                      </p>
                      <p className="text-red-800 dark:text-red-350 font-bold bg-red-100/50 dark:bg-red-900/30 p-2.5 rounded-lg border border-red-200/50">
                        💳 Quitação de Dívidas Ativas: Todo o valor arrecadado será destinado exclusivamente ao pagamento dessas duas faturas de cartão de crédito. A campanha permanecerá ativa até que a meta de R$ 1.274,58 seja alcançada de forma integral.
                      </p>
                    </div>
                  </>
                )}

                {isLuma && (
                  <>
                    <div className="border-l-4 border-fuchsia-500 pl-4 space-y-2">
                      <p className="font-semibold text-red-950 dark:text-red-150 text-base">
                        Apoiamos Luma Ravaglia (a punkstar do tarot), oraculista e magista dedicada, em sua caminhada de cura e celebração da sobriedade.
                      </p>
                      <p className="text-red-800 dark:text-red-300">
                        O objetivo da campanha é financiar sua viagem para assistir ao show do artista <strong>Machine Gun Kelly (MGK) em São Paulo (SP)</strong>, um grande marco e sonho em sua jornada pessoal.
                      </p>
                    </div>

                    <div className="bg-white/80 dark:bg-neutral-900/80 border border-fuchsia-250 dark:border-fuchsia-950 p-5 rounded-2xl space-y-3 shadow-xs">
                      <h4 className="font-serif font-black text-xs uppercase text-red-800 dark:text-red-400 flex items-center gap-1.5">
                        🎵 Motivo e Inspiração da Campanha:
                      </h4>
                      <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
                        Luma relata que está em recuperação da dependência química e afirma estar limpa há cerca de um ano e meio após um período de internação. Segundo ela, conhecer Machine Gun Kelly (MGK) representa a realização de um sonho e uma forma de celebrar sua trajetória de recuperação. Ela explica que a história do artista é uma das fontes de motivação para manter sua sobriedade e, por isso, deseja assistir ao show em São Paulo (SP).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl space-y-2">
                        <span className="text-[10px] uppercase font-mono text-red-650 block font-bold">📋 Despesas Cobertas pela Campanha</span>
                        <ul className="text-xs list-disc pl-4 space-y-1 text-red-800 dark:text-red-300">
                          <li>Transporte da cidade onde mora até a capital do Rio de Janeiro</li>
                          <li>Viagem de ônibus para São Paulo (SP)</li>
                          <li>Ingresso do show</li>
                          <li>Retorno ao Rio de Janeiro e à sua cidade</li>
                        </ul>
                      </div>

                      <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl space-y-2">
                        <span className="text-[10px] uppercase font-mono text-red-650 block font-bold">🗓️ Período de Arrecadação</span>
                        <div className="text-xs text-red-800 dark:text-red-300 space-y-1">
                          <p><strong>Início:</strong> 18 de Junho de 2026</p>
                          <p><strong>Fim:</strong> 06 de Setembro de 2026</p>
                          <p className="text-[11px] text-red-600 dark:text-red-400 font-bold mt-2">
                            🎁 Promoção Ativa: Luma concedeu 25% de desconto em todas as suas tiragens e serviços mágickos como forma de ajudar a financiar a viagem!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* OFFICIAL MEDICAL REPORT EXCLUSIVELY FOR LUMA RAVAGLIA */}
                    <div className="bg-red-50/70 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-900/50 p-5 rounded-2xl space-y-4 shadow-sm text-red-800 dark:text-red-300">
                      <div className="flex items-center gap-2 border-b border-red-200 dark:border-red-900 pb-2">
                        <span className="text-lg">📋</span>
                        <h4 className="font-serif font-black text-xs uppercase text-red-900 dark:text-red-200 tracking-wider">
                          Relatório Clínico – Luma Ravaglia
                        </h4>
                      </div>
                      
                      <div className="space-y-4 text-xs font-sans leading-relaxed">
                        <div>
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-red-900 dark:text-red-100 mb-1">🏥 Quadro Psiquiátrico</h5>
                          <p>Paciente apresenta condição psiquiátrica complexa, crônica e de elevada gravidade, caracterizada por:</p>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5">
                            <li>Comorbidade entre transtorno de personalidade com instabilidade emocional e impulsividade;</li>
                            <li>Transtorno do humor em espectro bipolar;</li>
                            <li>Transtorno de ansiedade generalizada;</li>
                            <li>Transtorno por uso de substâncias psychoativas.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-red-900 dark:text-red-100 mb-1">🏷️ Classificação Diagnóstica (CID-10)</h5>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li><strong>F31.5</strong> – Transtorno afetivo bipolar, episódio atual depressivo grave com sintomas psicóticos;</li>
                            <li><strong>F19.2</strong> – Transtornos mentais e comportamentais devidos ao uso de múltiplas substâncias psicoativas (síndrome de dependência);</li>
                            <li><strong>F60.3</strong> – Transtorno de personalidade emocionalmente instável, tipo borderline.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-red-900 dark:text-red-100 mb-1">📜 Histórico Clínico</h5>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Início precoce dos sintomas;</li>
                            <li>Prejuízo progressivo do funcionamento global;</li>
                            <li>Dificuldades acadêmicas;</li>
                            <li>Instabilidade relacional;</li>
                            <li>Incapacidade de manter rotina estruturada.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-red-900 dark:text-red-100 mb-1">📈 Evolução do Quadro</h5>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Desregulação emocional importante;</li>
                            <li>Impulsividade e prejuízo do controle inibitório;</li>
                            <li>Oscilação significativa de humor;</li>
                            <li>Sintomas ansiosos persistentes;</li>
                            <li>Episódios recorrentes de descompensação, mesmo com uso regular de psicofármacos.</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-red-900 dark:text-red-100 mb-1">🏥 Internações e Tratamentos</h5>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Registro de internações em unidade psiquiátrica;</li>
                            <li>Permanência em ambiente terapêutico estruturado para reabilitação;</li>
                            <li>Evidência clínica da gravidade do quadro e do risco de recorrência de episódios agudos.</li>
                          </ul>
                        </div>

                        <div className="bg-red-100/50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900">
                          <h5 className="font-bold text-[11px] uppercase tracking-wider text-red-950 dark:text-red-100 mb-1">⚠️ Risco e Vigilância</h5>
                          <ul className="list-disc pl-4 space-y-0.5">
                            <li>Histórico de comportamento autoagressivo;</li>
                            <li>Impulsividade grave;</li>
                            <li>Elevado risco de recorrência de episódios de autoagressão, principalmente em situações de estresse e desorganização emocional;</li>
                            <li>Necessidade de acompanhamento e vigilância clínica contínuos.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Pix Copy Box */}
                    {c.pix && (
                      <div className="bg-white/80 dark:bg-neutral-900/80 border border-fuchsia-200 dark:border-fuchsia-900 p-5 rounded-2xl space-y-3 shadow-xs">
                        <h4 className="font-serif font-black text-xs uppercase text-red-800 dark:text-red-400">
                          🔑 Apoie via Pix Direto (Luma Ravaglia):
                        </h4>
                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                          <div className="bg-neutral-100 dark:bg-neutral-950 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 font-mono text-xs select-all flex-1 flex items-center justify-between">
                            <span className="text-red-800 dark:text-red-200">{c.pix}</span>
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
                    )}
                  </>
                )}

                {/* Correctly Encoded WhatsApp Button */}
                <div className="text-center pt-4">
                  <a 
                    href={`https://wa.me/${c.phone}?text=${encodeURIComponent(c.whatsappText)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r text-white font-mono text-xs font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md hover:scale-102 uppercase tracking-wider ${
                      isLuma ? 'from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600' :
                      isSimon ? 'from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600' :
                      'from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600'
                    }`}
                  >
                    <Phone className="w-4 h-4 fill-white" /> Falar com {c.fullName} no WhatsApp ({c.formattedPhone})
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
