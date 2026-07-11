import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  Calendar, 
  Shield, 
  Users, 
  Phone,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  Clock,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Campanha } from './CampanhaTab';
import { Article } from '../types';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

interface ComunicadoTabProps {
  countdown: CountdownState;
  isSinergiaActive: boolean;
  setIsSinergiaActive: (active: boolean) => void;
  customSynergyText: string;
  setCustomSynergyText: (text: string) => void;
  synergyCampaign: string;
  setSynergyCampaign: (campaign: string) => void;
  triggerAlert?: (text: string, type?: 'success' | 'info') => void;
  campaigns: Campanha[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campanha[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

export default function ComunicadoTab({ 
  countdown,
  isSinergiaActive,
  setIsSinergiaActive,
  customSynergyText,
  setCustomSynergyText,
  synergyCampaign,
  setSynergyCampaign,
  triggerAlert,
  campaigns,
  setCampaigns,
  articles,
  setArticles
}: ComunicadoTabProps) {

  // Action: Toggle campaign status between autorizada and pendente
  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status_campanha === 'autorizada' ? 'pendente' : 'autorizada';
        if (triggerAlert) {
          triggerAlert(`Status da campanha de ${c.fullName} alterado para ${newStatus.toUpperCase()}!`, 'success');
        }
        return { ...c, status_campanha: newStatus };
      }
      return c;
    }));
  };

  // Action: Simulate positive financial contribution (+R$ 50)
  const simulateContribution = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const newAmount = c.arrecadado + 50.00;
        if (triggerAlert) {
          triggerAlert(`Simulação de Pix recebido para ${c.fullName}: + R$ 50,00!`, 'success');
        }
        return { ...c, arrecadado: newAmount };
      }
      return c;
    }));
  };

  // Action: Toggle article publication embargo
  const toggleArticleEmbargo = (id: string) => {
    setArticles(prev => prev.map(art => {
      if (art.id === id) {
        const isCurrentlyEmbargoed = !!art.data_publicacao_autorizada;
        const newEmbargo = isCurrentlyEmbargoed ? null : '2026-07-17';
        if (triggerAlert) {
          triggerAlert(
            newEmbargo 
              ? `Artigo "${art.title}" embargado com sucesso até 17/07/2026!` 
              : `Embargo removido do artigo "${art.title}"! Visível imediatamente no feed principal.`, 
            'success'
          );
        }
        return { ...art, data_publicacao_autorizada: newEmbargo };
      }
      return art;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* COMUNICADO DE RECESSO CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-red-500 bg-gradient-to-br from-red-50/95 via-[#fefefe]/95 to-amber-50/95 p-6 md:p-8 shadow-xl dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:border-red-600"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-650 dark:bg-red-950/80 dark:text-red-400 shrink-0">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-red-600 text-white dark:bg-red-950 dark:text-red-300 px-2 py-0.5 rounded font-bold">
                Comunicado Oficial
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-0.5">
                COMUNICADO GERAL: RECESSO DO SITE E DA COMUNIDADE
              </h2>
            </div>
          </div>
          <div className="bg-red-100 dark:bg-red-950/90 border border-red-200 dark:border-red-900 px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-auto shrink-0">
            <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="font-mono text-xs font-bold text-red-900 dark:text-red-300">
              Período: 10/07 a 17/07/2026
            </span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-neutral-900 text-white rounded-2xl p-5 mb-6 text-center border border-red-600/30">
          <p className="text-[10px] uppercase tracking-widest font-mono text-red-400 font-bold mb-2">
            ⏱️ CONTADOR REGRESSIVO — RETORNO DA COMUNIDADE
          </p>
          {countdown.isCompleted ? (
            <div className="text-xl font-bold font-mono text-amber-400">
              O RECESSO TERMINOU! A COMUNIDADE RETORNOU ÀS ATIVIDADES.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-3">
                <span className="block text-2xl md:text-3xl font-black text-red-500 font-mono">
                  {String(countdown.days).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-mono text-neutral-400">Dias</span>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-3">
                <span className="block text-2xl md:text-3xl font-black text-red-500 font-mono">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-mono text-neutral-400">Horas</span>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-3">
                <span className="block text-2xl md:text-3xl font-black text-red-500 font-mono">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-mono text-neutral-400">Min</span>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-3">
                <span className="block text-2xl md:text-3xl font-black text-red-500 font-mono">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase font-mono text-neutral-400">Seg</span>
              </div>
            </div>
          )}
        </div>

        {/* Fluid Redação Texts */}
        <div className="space-y-6 text-sm text-neutral-850 dark:text-neutral-300 font-sans leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-serif font-black text-base text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-3">
              🕊️ Situação Geral & Pausa Necessária
            </h3>
            <p>
              Nos últimos dias, a comunidade enfrentou uma série de conflitos, cobranças intensas e situações delicadas que exigiram muito da administração. Mesmo diante de tantas dificuldades, as administradoras estiveram sempre presentes, tentando manter o espaço organizado, seguro e acolhedor para todos.
            </p>
            <p>
              No entanto, chegamos a um ponto de esgotamento. Cuidar de uma comunidade grande demanda tempo, energia emocional e dedicação constantes. As administradoras também são pessoas reais que precisam descansar para não adoecerem sob tamanha pressão.
            </p>
            <p className="font-bold text-red-750 dark:text-red-400">
              Por isso, a comunidade ficará fechada por uma semana (de 10/07 a 17/07) para recesso necessário das administradoras.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="font-serif font-black text-base text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-l-4 border-red-500 pl-3">
              📢 Alerta Importante sobre Grupos Paralelos e Cobranças
            </h3>
            <div className="bg-neutral-100/60 dark:bg-neutral-950/60 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="space-y-1">
                <h4 className="font-serif font-black text-xs text-neutral-900 dark:text-white uppercase">
                  🎁 Sobre os Prêmios e Generosidade
                </h4>
                <p className="text-xs">
                  A premiação oferecida (um deck físico de Tarot) é um ato de pura generosidade da administradora Clara. Ela custeou o prêmio e o frete do próprio bolso, sem qualquer obrigação financeira. Portanto, qualquer deboche, críticas vazias ou intolerância contra a organizadora do bolão são completamente infundadas e inaceitáveis.
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-black text-xs text-neutral-900 dark:text-white uppercase">
                  ⛔ Sobre Grupos Paralelos de Ataques
                </h4>
                <p className="text-xs">
                  A criação de subgrupos paralelos com o único intuito de realizar cobranças, deboches ou disseminar intrigas contra membros e administradoras não será mais tolerada. Esse comportamento fere frontalmente os valores de acolhimento mútuo que fundamentam a nossa comunidade.
                </p>
              </div>
            </div>
            <p className="text-xs italic text-neutral-500 text-center pt-2">
              🙏 Agradecemos imensamente o respeito e a compreensão de todos os membros que caminham conosco.
            </p>
          </div>
        </div>
      </motion.div>

      {/* DIRETRIZES E COMO PUBLICAR SUA HISTÓRIA */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50/95 via-[#fefefe]/95 to-teal-50/95 p-6 md:p-8 shadow-xl dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 dark:border-emerald-600"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 text-2xl shrink-0">
              <Shield className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-600 text-white dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                Diretrizes & Normas
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-0.5">
                COMO TER SUA HISTÓRIA DIVULGADA NO PORTAL
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-sm text-neutral-850 dark:text-neutral-300 font-sans leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-serif font-black text-base text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              📌 Nosso Objetivo de Apoio
            </h3>
            <p>
              O site existe para ampliar o trabalho da comunidade, oferecendo um espaço seguro para acolhimento, divulgação de campanhas e apoio a pessoas ou animais que realmente precisem de ajuda. O acesso não é aberto para qualquer finalidade. Cada projeto ou campanha deve ter um motivo legítimo para estar no site, sendo minuciosamente analisado antes da publicação.
            </p>
          </div>

          {/* Pricing grid - FLUID DESIGN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-neutral-900/80 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Users className="w-5 h-5 shrink-0" />
                <h4 className="font-serif font-black uppercase text-xs tracking-wider">Membros da Comunidade</h4>
              </div>
              <p className="text-xs">
                Membros oficiais ativos do grupo podem solicitar espaço no site de forma <strong className="text-emerald-600">totalmente gratuita (sem taxa)</strong>, desde que apresentem um motivo legítimo e compatível com nossos valores solidários.
              </p>
              <p className="text-[10px] font-mono text-emerald-600/90 dark:text-emerald-400">
                Exemplo: Campanhas de suporte financeiro emergencial ou catálogos para arrecadar fundos de tratamento animal.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Shield className="w-5 h-5 shrink-0" />
                <h4 className="font-serif font-black uppercase text-xs tracking-wider">Pessoas de Fora</h4>
              </div>
              <p className="text-xs">
                Pessoas que não fazem parte da comunidade também podem divulgar campanhas ou serviços. Por não haver vínculo direto de confiança prévia com o grupo, será cobrada uma <strong className="text-amber-600">taxa de publicação única de R$ 20,00</strong>.
              </p>
              <p className="text-[10px] font-mono text-amber-600/90 dark:text-amber-400">
                Esta taxa serve exclusivamente para cobrir custos de hospedagem, administração do portal e filtrar fraudes ou envios de spam.
              </p>
            </div>
          </div>

          {/* Form Submission Rules */}
          <div className="bg-neutral-100/60 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl space-y-3">
            <h4 className="font-serif font-black text-xs uppercase text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span>⚠️</span> Controle e Segurança no Envio
            </h4>
            <p className="text-xs">
              Diferente de outros veículos convencionais, <strong>o formulário de publicação não está disponível de forma aberta diretamente no site</strong>. Ele é de uso controlado e enviado exclusivamente pelo <strong>Eduardo</strong> mediante solicitação direta via WhatsApp.
            </p>
            <p className="text-xs">
              Essa medida de segurança impede spams automatizados e garante a total integridade e veracidade de tudo que é publicado em nosso portal.
            </p>
          </div>

          {/* Submission Action Button */}
          <div className="text-center pt-2">
            <a 
              href="https://wa.me/5596991821516?text=Oi%2C%20quero%20uma%20reportagem%20sobre%20mim%20no%20site%20TNB%20NEWS."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-mono text-xs font-bold py-4 px-6 rounded-2xl transition-all shadow-md hover:scale-102 uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 fill-white" /> Solicitar com Eduardo (+55 96 99182-1516)
            </a>
          </div>
        </div>
      </motion.div>

      {/* RECURSOS E PROTOCOLOS: FORMULÁRIO DE SINERGIA DE CONTEÚDO */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-indigo-500 bg-gradient-to-br from-indigo-50/90 via-[#fefefe]/95 to-violet-50/90 p-6 md:p-8 shadow-xl dark:from-neutral-900/90 dark:via-neutral-900/95 dark:to-neutral-950/90 dark:border-indigo-650"
        id="protocolo-sinergia-conteudo"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 text-2xl shrink-0">
              <Layers className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-600 text-white dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded font-bold">
                Recursos & Protocolos TNB
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight mt-0.5">
                Protocolo: Sinergia de Conteúdo Integrado
              </h2>
            </div>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-950/90 border border-indigo-200 dark:border-indigo-900 px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-auto shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-mono text-xs font-bold text-indigo-900 dark:text-indigo-300">
              Estado: {isSinergiaActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className="space-y-6 text-sm text-neutral-850 dark:text-neutral-300 font-sans leading-relaxed">
          <p className="leading-relaxed">
            O **Protocolo de Sinergia de Conteúdo** permite cruzar de forma oficial informações críticas de uma aba com as demais sem quebrar o princípio de isolamento estanque. Ao ativar este formulário, o comunicado de recesso ou alerta administrativo será sincronizado e exibido no topo da **Aba Campanha** como um banner interativo.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4 bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800 shadow-sm">
            <h4 className="font-serif font-black text-xs uppercase text-indigo-900 dark:text-white flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-850 pb-2 mb-3">
              Configurar Banner de Sinergia
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase mb-1.5">
                  Vincular à Campanha Específica:
                </label>
                <select 
                  value={synergyCampaign}
                  onChange={(e) => setSynergyCampaign(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-800 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="todas">Todas as Campanhas (Global)</option>
                  <option value="alice">Campanha Alice Guedes</option>
                  <option value="luma">Campanha Luma Ravaglia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400 uppercase mb-1.5">
                  Texto do Alerta Administrativo:
                </label>
                <input 
                  type="text"
                  value={customSynergyText}
                  onChange={(e) => setCustomSynergyText(e.target.value)}
                  placeholder="Ex: Alerta de recesso..."
                  className="w-full text-xs font-mono p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-800 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Submit & Toggle controls */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const newState = !isSinergiaActive;
                  setIsSinergiaActive(newState);
                  if (triggerAlert) {
                    triggerAlert(
                      newState 
                        ? 'Protocolo de Sinergia de Conteúdo ativado! O comunicado agora está integrado na Aba Campanha.'
                        : 'Sinergia de Conteúdo desativada. O comunicado foi removido da Aba Campanha.',
                      'success'
                    );
                  }
                }}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-mono text-xs font-bold py-3 px-5 rounded-xl transition-all shadow-md uppercase tracking-wider ${
                  isSinergiaActive 
                    ? 'bg-red-650 hover:bg-red-700 text-white' 
                    : 'bg-indigo-650 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSinergiaActive ? (
                  <>
                    <ToggleRight className="w-5 h-5" /> Desativar Sinergia
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-5 h-5" /> Ativar Sinergia de Conteúdo
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-neutral-500 font-mono">
                *O cruzamento de dados respeita o isolamento de cada aba através de transferência de estado de reuso.
              </p>
            </div>
          </form>
        </div>
      </motion.div>

      {/* 🛡️ PAINEL DE CONTROLE ADMINISTRATIVO (UNIVERSAL CONTROLS FOR CAMPAIGNS AND EMBARGOS) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border-2 border-neutral-900 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-6 md:p-8 shadow-xl dark:border-neutral-800"
        id="painel-admin-universal"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-red-500 text-2xl shrink-0 border border-neutral-700 animate-pulse">
              🛡️
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-red-750 text-white px-2 py-0.5 rounded font-bold">
                Módulo Administrador Geral
              </span>
              <h2 className="font-serif text-xl md:text-2xl font-black text-neutral-50 tracking-tight mt-0.5">
                Painel de Controle de Status do TNB News
              </h2>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-neutral-850 border border-neutral-850 text-neutral-400 px-3 py-1 rounded-lg">
            Acesso Autorizado • v77.77
          </span>
        </div>

        <div className="space-y-8 text-xs font-sans">
          
          {/* Section 1: Campaign Authorization System */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-serif font-black uppercase tracking-wider text-neutral-200">
                1. Sistema de Autorização de Campanhas (`status_campanha`)
              </h3>
            </div>
            <p className="text-neutral-400 leading-relaxed font-sans text-[11px]">
              Altere o status de autorização de qualquer participante em tempo real. Campanhas configuradas como <strong className="text-amber-500">PENDENTE</strong> desaparecem da Aba Campanha pública e ficam retidas no Admin. Campanhas configuradas como <strong className="text-emerald-400">AUTORIZADA</strong> ficam imediatamente acessíveis. Use os controles para simular Pix diretos e ver o cálculo da Meta atualizar-se ao vivo!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((c) => {
                const isAuthorized = c.status_campanha === 'autorizada';
                return (
                  <div key={c.id} className="bg-neutral-850 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-serif font-bold text-neutral-100 text-sm leading-tight block">{c.fullName}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                          isAuthorized 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/55' 
                            : 'bg-amber-950 text-amber-300 border border-amber-900/55'
                        }`}>
                          {c.status_campanha}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 italic line-clamp-1 mt-1 font-mono">
                        {c.title}
                      </p>
                      <div className="mt-2 pt-2 border-t border-neutral-800 flex justify-between font-mono text-[9px] text-neutral-400">
                        <span>PIX: {c.arrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        <span>Meta: {c.meta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-1">
                      <button
                        onClick={() => toggleCampaignStatus(c.id)}
                        className={`w-full font-mono text-[9px] py-2 px-3 rounded-lg font-bold uppercase tracking-wider transition-all border ${
                          isAuthorized 
                            ? 'bg-amber-950/30 hover:bg-amber-950 text-amber-400 border-amber-900' 
                            : 'bg-emerald-950/30 hover:bg-emerald-950 text-emerald-400 border-emerald-900'
                        }`}
                      >
                        {isAuthorized ? '🚫 Bloquear (Pendente)' : '✅ Autorizar (Pública)'}
                      </button>
                      <button
                        onClick={() => simulateContribution(c.id)}
                        className="w-full font-mono text-[9px] py-2 px-3 rounded-lg font-bold uppercase tracking-wider bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-750 inline-flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-400" /> Simular Pix (+ R$ 50,00)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Reportage Embargo System */}
          <div className="space-y-4 pt-4 border-t border-neutral-850">
            <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
              <Clock className="w-4 h-4 text-violet-400" />
              <h3 className="font-serif font-black uppercase tracking-wider text-neutral-200">
                2. Sistema de Embargo e Agendamento de Reportagens (`data_publicacao_autorizada`)
              </h3>
            </div>
            <p className="text-neutral-400 leading-relaxed font-sans text-[11px]">
              Controle a data de embargo de reportagens sensíveis. Reportagens cuja data configurada em <strong className="text-violet-400">data_publicacao_autorizada</strong> seja no futuro (por exemplo, a reportagem especial da Luma em <strong className="text-violet-400">17 de Julho de 2026</strong>) permanecem ocultas do feed principal da redação até a referida data. Remova o embargo ou alterne a data para simular a liberação instantânea e ver a reportagem aparecer ao vivo para o leitor!
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {articles.map((art) => {
                const isEmbargoed = !!art.data_publicacao_autorizada;
                return (
                  <div key={art.id} className="bg-neutral-850 border border-neutral-800 rounded-xl p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif font-black text-neutral-100 text-sm leading-tight">
                          {art.title}
                        </span>
                        <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                          isEmbargoed 
                            ? 'bg-violet-950 text-violet-300 border border-violet-900/50' 
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-750'
                        }`}>
                          {isEmbargoed ? '⏱️ Embargada' : '🟢 Imediata'}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        Autor: {art.author} • Categoria: {art.category} • Data de Publicação Autorizada: <strong className="text-neutral-300">{art.data_publicacao_autorizada || 'Imediata (Sem Restrição)'}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleArticleEmbargo(art.id)}
                      className={`shrink-0 font-mono text-[9px] py-2 px-3.5 rounded-lg font-bold uppercase tracking-wider transition-all border ${
                        isEmbargoed 
                          ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border-emerald-900' 
                          : 'bg-violet-950 hover:bg-violet-900 text-violet-400 border-violet-900'
                      }`}
                    >
                      {isEmbargoed ? '🔓 Remover Embargo' : '⏱️ Embargar até 17/07/2026'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </motion.div>

    </div>
  );
}
