import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  AlertCircle, 
  QrCode, 
  Copy, 
  Sparkles,
  User,
  Mail,
  Phone,
  FileText,
  Heart,
  ArrowUpRight,
  Send
} from 'lucide-react';

interface ContratarTabProps {
  user: any | null;
  onAddCampaign: (newCamp: any) => void;
  onAddArticle: (newArt: any) => void;
  triggerAlert: (text: string, type: 'success' | 'info') => void;
  onOpenAuth?: () => void;
}

const DONATION_TIERS = [
  { 
    id: 'simples', 
    name: 'Contribuição Simples', 
    price: 5.00, 
    desc: 'Ajuda a manter os servidores ativos por algumas horas.' 
  },
  { 
    id: 'especial', 
    name: 'Contribuição Especial', 
    price: 10.00, 
    desc: 'Ajuda com os custos de processamento de IA da Alice.' 
  },
  { 
    id: 'generosa', 
    name: 'Contribuição Generosa', 
    price: 20.00, 
    desc: 'Apoio crucial para a manutenção de notícias independentes.' 
  }
];

const CHAVE_PIX_TNB = 'b81276c8-8b98-44b2-906e-46803cd4802e';
const QR_CODE_URL_TNB = 'https://pixqrcode-nys7envc.manus.space/';
const WHATSAPP_NUMBER = '096991821516';

export default function ContratarTab({ 
  user, 
  onAddCampaign, 
  onAddArticle,
  triggerAlert,
  onOpenAuth
}: ContratarTabProps) {
  // Sub-tabs: 'doe' ("Doe / Apoie o site") or 'publicacoes' ("Contratar Publicações")
  const [activeSubTab, setActiveSubTab] = useState<'doe' | 'publicacoes'>('doe');

  // --- PUBLICATIONS STATES ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [pubStep, setPubStep] = useState<'form' | 'payment'>('form');

  // --- DONATIONS STATES ---
  const [selectedTier, setSelectedTier] = useState(DONATION_TIERS[1]); // Default Especial
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [donationStep, setDonationStep] = useState<'selection' | 'payment'>('selection');

  // Promo Check (10 July 2026 to 16 July 2026, 23h59 BRT)
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [price, setPrice] = useState(20.00);

  useEffect(() => {
    if (user) {
      if (user.displayName) setFullName(user.displayName);
      if (user.email) setContactEmail(user.email);
    }
  }, [user]);

  // Check promotion active for publications
  useEffect(() => {
    const checkPromo = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      });
      const parts = formatter.formatToParts(new Date());
      const getVal = (type: string) => parseInt(parts.find(p => p.type === type)!.value, 10);
      
      const brtNow = new Date(Date.UTC(
         getVal('year'), getVal('month') - 1, getVal('day'),
         getVal('hour'), getVal('minute'), getVal('second')
      ));

      const startPromo = new Date(Date.UTC(2026, 6, 10, 0, 0, 0)); // July 10, 2026
      const endPromo = new Date(Date.UTC(2026, 6, 16, 23, 59, 59)); // July 16, 2026 23h59

      const active = brtNow >= startPromo && brtNow <= endPromo;
      setIsPromoActive(active);
      setPrice(active ? 16.60 : 20.00);
    };

    checkPromo();
    const interval = setInterval(checkPromo, 3000);
    return () => clearInterval(interval);
  }, []);

  const getDonationPrice = () => {
    if (isCustomSelected) {
      const parsed = parseFloat(customAmount.replace(',', '.'));
      return isNaN(parsed) ? 10.00 : parsed;
    }
    return selectedTier.price;
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(CHAVE_PIX_TNB);
    triggerAlert('Chave Pix copiada com sucesso!', 'success');
  };

  const handleSendPubWhatsApp = () => {
    const formattedPrice = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const message = `Olá Eduardo! Gostaria de contratar uma publicação no portal TNB NEWS.\n\n` +
      `*Detalhes da Publicação:*\n` +
      `- Título: ${title}\n` +
      `- Descrição: ${description}\n\n` +
      `*Dados de Contato:*\n` +
      `- Nome: ${fullName}\n` +
      `- E-mail: ${contactEmail}\n` +
      `- WhatsApp: ${contactPhone || 'Não informado'}\n\n` +
      `Já realizei o Pix de ${formattedPrice}.\n` +
      `Chave Pix utilizada: ${CHAVE_PIX_TNB}\n\n` +
      `Seguem os dados para validação e publicação no portal.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/55${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleSendDonationWhatsApp = () => {
    const donationVal = getDonationPrice();
    const formattedPrice = donationVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const tierName = isCustomSelected ? 'Contribuição Personalizada' : selectedTier.name;
    const message = `Olá Eduardo! Acabo de realizar um Pix de ${formattedPrice} como forma de "${tierName}" para apoiar voluntariamente o funcionamento do portal TNB NEWS.\n\n` +
      `Seguem os dados do meu apoio para controle. Muito obrigado pelo excelente serviço do site!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/55${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  const handleCreatePubOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !fullName || !contactEmail) {
      alert("Por favor, preencha o título, conteúdo, seu nome completo e e-mail.");
      return;
    }
    setPubStep('payment');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl max-w-4xl mx-auto mb-12">
      
      {/* Header and Tab Switcher */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-5 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-serif text-3xl font-black text-red-700 dark:text-red-500 uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-red-600 dark:text-red-400" />
            Apoio & Serviços TNB NEWS
          </h2>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-1">
            Contribua voluntariamente ou publique matérias no portal com facilidade.
          </p>
        </div>

        {/* Dual navigation pills */}
        <div className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl flex gap-1 border border-neutral-200/50 dark:border-neutral-700/50 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveSubTab('doe');
              setDonationStep('selection');
            }}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'doe'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-sm border border-neutral-200/30 dark:border-neutral-750'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            id="subtab-doe"
          >
            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
            Doe / Apoie o site
          </button>
          <button
            onClick={() => {
              setActiveSubTab('publicacoes');
              setPubStep('form');
            }}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSubTab === 'publicacoes'
                ? 'bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 shadow-sm border border-neutral-200/30 dark:border-neutral-750'
                : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
            id="subtab-publicacoes"
          >
            <FileText className="w-4 h-4" />
            Contratar Publicações
          </button>
        </div>
      </div>

      {/* ======================= VIEW 1: DONATIONS (DOE / APOIE O SITE) ======================= */}
      {activeSubTab === 'doe' && (
        <div className="space-y-8">
          
          <div className="bg-gradient-to-r from-red-900 via-pink-900 to-red-950 text-white rounded-3xl p-6 border-b-4 border-red-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4 z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 border border-red-400/20 flex items-center justify-center text-white shadow-inner shrink-0 animate-pulse">
                <Heart className="w-7 h-7 text-white fill-white/20" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-pink-300">Apoio Comunitário Opcional</span>
                <h3 className="font-serif text-2xl md:text-3xl font-black text-white mt-0.5">
                  Doe & Ajude o Portal TNB NEWS
                </h3>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl max-w-sm font-serif text-xs leading-relaxed text-pink-100 z-10">
              Para mantermos a Alice AI gratuita e o site sem barreiras de login, transformamos os antigos planos pagos em contribuições voluntárias opcionais. Ajude com o valor que sentir no coração! ❤️
            </div>
          </div>

          {donationStep === 'selection' && (
            <div className="space-y-8">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
                  <Sparkles className="w-5 h-5 text-red-600" />
                  Selecione um Valor de Apoio
                </h3>
                <p className="text-xs text-neutral-500 font-mono mt-1">Sua doação ajuda diretamente nos custos de manutenção da API de IA e da equipe de redação:</p>
              </div>

              {/* Grid of Donation Packages */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DONATION_TIERS.map((tier) => (
                  <div 
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      setIsCustomSelected(false);
                    }}
                    className={`border-2 rounded-3xl p-6 bg-white dark:bg-neutral-950 transition-all duration-300 flex flex-col justify-between shadow-sm cursor-pointer group hover:shadow-md relative ${
                      !isCustomSelected && selectedTier.id === tier.id
                        ? 'border-red-600 ring-1 ring-red-600'
                        : 'border-neutral-200 dark:border-neutral-850 hover:border-neutral-400'
                    }`}
                  >
                    {tier.id === 'especial' && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-700 text-white font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-red-500/20">
                        Mais Escolhido ⭐
                      </span>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">{tier.name}</h4>
                        <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                        </div>
                      </div>

                      <div className="font-mono">
                        <span className="text-xs text-neutral-400 mr-1">R$</span>
                        <strong className="text-3xl font-black text-neutral-900 dark:text-white">{tier.price.toFixed(0)},00</strong>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed min-h-[40px]">{tier.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between font-mono text-[10px] text-neutral-500">
                      <span>Voluntário</span>
                      <span className="text-red-600 dark:text-red-400 font-bold group-hover:underline">Selecionar →</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Value Selection */}
              <div 
                onClick={() => setIsCustomSelected(true)}
                className={`p-6 border-2 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/20 transition-all cursor-pointer ${
                  isCustomSelected 
                    ? 'border-red-600 ring-1 ring-red-600' 
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="font-serif text-sm font-bold text-neutral-850 dark:text-white flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500" />
                      Definir outro valor personalizado
                    </h4>
                    <p className="text-xs text-neutral-500 font-serif leading-relaxed">
                      Sinta-se livre para digitar qualquer quantia que deseje doar via Pix para apoiar o portal.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-48 shrink-0">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-neutral-400">R$</span>
                    <input 
                      type="text" 
                      placeholder="Ex: 50,00"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setIsCustomSelected(true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-750 bg-white dark:bg-neutral-900 font-mono text-sm focus:outline-none focus:border-red-500 text-neutral-850 dark:text-neutral-100"
                      id="input-doacao-customizado"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDonationStep('payment')}
                className="w-full py-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                id="btn-doacao-prosseguir"
              >
                Prosseguir para Apoio — R$ {getDonationPrice().toFixed(2).replace('.', ',')}
              </button>
            </div>
          )}

          {donationStep === 'payment' && (
            <div className="space-y-6 max-w-md mx-auto text-center py-4 border border-neutral-150 dark:border-neutral-850 p-8 rounded-3xl bg-neutral-50/50 dark:bg-neutral-950/15 shadow-inner animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-2 border border-red-100 dark:border-red-900/50">
                <QrCode className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-full font-bold">PIX Direto Oficial</span>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">QR Code de Apoio</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  Sua doação voluntária de <strong className="text-neutral-850 dark:text-neutral-100">R$ {getDonationPrice().toFixed(2).replace('.', ',')}</strong> apoia diretamente o TNB NEWS.
                </p>
              </div>

              {/* QR Code Button to take user to direct QR link */}
              <div className="py-4">
                <a 
                  href={QR_CODE_URL_TNB}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-mono text-xs font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md uppercase tracking-wider"
                >
                  <QrCode className="w-4.5 h-4.5" /> Visualizar QR Code Pix Oficial <ArrowUpRight className="w-4 h-4" />
                </a>
                <p className="text-[10px] text-neutral-500 font-mono mt-2">
                  Acesse para visualizar o QR Code limpo e seguro.
                </p>
              </div>

              {/* Copy Pix Key Container */}
              <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-left space-y-1.5">
                <span className="text-[9px] font-mono text-neutral-400 block uppercase font-bold">Chave Pix (Chave Aleatória):</span>
                <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-850 p-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-750 gap-2">
                  <code className="text-[10px] text-neutral-800 dark:text-neutral-300 font-mono select-all truncate flex-1">{CHAVE_PIX_TNB}</code>
                  <button 
                    onClick={handleCopyPixKey}
                    title="Copiar Chave Pix"
                    className="p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0"
                    id="btn-copiar-pix-doacao"
                  >
                    <Copy className="w-4 h-4 text-neutral-500 hover:text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSendDonationWhatsApp}
                  className="w-full py-3.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  id="btn-confirmar-whatsapp-doacao"
                >
                  <Send className="w-4 h-4" />
                  Enviar Comprovante via WhatsApp
                </button>
              </div>

              <div className="text-left bg-neutral-100 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 mt-4">
                <p className="text-[11px] font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  ⚠️ <strong>Aviso Importante:</strong> Este portal não conta com pagamentos simulados ou confirmações automatizadas falsas. Realize o Pix no seu aplicativo bancário e nos envie o comprovante clicando no botão acima para controle manual. Muito obrigado por nos apoiar!
                </p>
              </div>

              <button
                onClick={() => setDonationStep('selection')}
                className="text-xs font-mono font-bold text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:underline cursor-pointer block mx-auto mt-2"
              >
                Voltar e Alterar Valor
              </button>
            </div>
          )}

        </div>
      )}

      {/* ======================= VIEW 2: PUBLICATIONS (CONTRATAR PUBLICAÇÕES) ======================= */}
      {activeSubTab === 'publicacoes' && (
        <div>
          {/* Promobanner */}
          {isPromoActive ? (
            <div className="bg-gradient-to-r from-red-900 to-amber-700 text-white rounded-2xl p-4 mb-8 shadow-md border border-amber-500/20 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-300 shrink-0 animate-pulse" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-amber-200">PROMOÇÃO DE JULHO ATIVA</p>
                  <h4 className="font-serif text-lg font-black">Ganhe 17% de desconto na sua publicação!</h4>
                  <p className="text-xs text-neutral-200 mt-0.5">Válido de 10 de julho até 16 de julho às 23h59 (Horário de Brasília).</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-center font-mono shrink-0">
                <span className="block text-[10px] uppercase text-amber-200">De R$ 20,00 por</span>
                <strong className="text-xl font-black text-white">R$ 16,60</strong>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-4 mb-8 flex justify-between items-center flex-wrap gap-4">
              <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                Publicação de matérias e comunicados comuns no site. Valor padrão da taxa de publicação:
              </p>
              <strong className="text-xl font-black font-mono text-neutral-900 dark:text-white">R$ 20,00</strong>
            </div>
          )}

          {pubStep === 'form' && (
            <form onSubmit={handleCreatePubOrder} className="space-y-6 animate-fade-in" id="form-contratar-publicacao">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 mb-6">
                <strong>Anúncio:</strong> Para contratações de outros formatos (como campanhas complexas de publicidade ou reportagens especiais patrocinadas), por favor entre em contato direto pelo WhatsApp <span className="font-bold text-red-600">096991821516</span>. No site é realizada exclusivamente a contratação de Publicações Comuns.
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Título da Publicação *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Título da sua notícia, aviso ou comunicado"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:border-red-500 font-mono text-neutral-900 dark:text-white"
                      id="input-pub-titulo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Conteúdo / Descrição Detalhada *
                  </label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Escreva aqui o conteúdo que deseja ver publicado no portal TNB NEWS..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:border-red-500 font-mono resize-none text-neutral-900 dark:text-white"
                    id="input-pub-conteudo"
                  />
                </div>
              </div>

              <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">Dados do Patrocinador</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-500 mb-1">Seu Nome Completo *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="Nome Completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-red-500 font-mono text-neutral-900 dark:text-white"
                        id="input-pub-autor"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-500 mb-1">Seu E-mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input 
                        type="email" 
                        required
                        placeholder="seu@email.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-red-500 font-mono text-neutral-900 dark:text-white"
                        id="input-pub-email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-neutral-500 mb-1">WhatsApp de Contato</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                      <input 
                        type="text" 
                        placeholder="Ex: 096991821516"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-250 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs focus:outline-none focus:border-red-500 font-mono text-neutral-900 dark:text-white"
                        id="input-pub-whats"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                id="btn-contratar-enviar"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Avançar para Pagamento — R$ {price.toFixed(2).replace('.', ',')}
              </button>
            </form>
          )}

          {pubStep === 'payment' && (
            <div className="space-y-6 max-w-md mx-auto text-center py-4 border border-neutral-150 dark:border-neutral-850 p-8 rounded-3xl bg-neutral-50/50 dark:bg-neutral-950/15 shadow-inner animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mb-4 border border-amber-100 dark:border-amber-900/50">
                <QrCode className="w-8 h-8" />
              </div>
              
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">Aguardando Pagamento Pix</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                Por favor, faça o pagamento de R$ {price.toFixed(2).replace('.', ',')} utilizando a chave Pix ou QR Code abaixo para que sua publicação possa ser aprovada e ativada no portal.
              </p>

              {/* QR Code Button to take user to direct QR link */}
              <div className="py-4">
                <a 
                  href={QR_CODE_URL_TNB}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-mono text-xs font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md uppercase tracking-wider"
                >
                  <QrCode className="w-4.5 h-4.5" /> Visualizar QR Code Pix Oficial <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              {/* Copy Pix Key Container */}
              <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-left space-y-1.5">
                <span className="text-[9px] font-mono text-neutral-400 block uppercase font-bold">Chave Pix (Chave Aleatória):</span>
                <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-850 p-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-750 gap-2">
                  <code className="text-[10px] text-neutral-800 dark:text-neutral-300 font-mono select-all truncate flex-1">{CHAVE_PIX_TNB}</code>
                  <button 
                    onClick={handleCopyPixKey}
                    title="Copiar Chave Pix"
                    className="p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0"
                    id="btn-copiar-pix-pub"
                  >
                    <Copy className="w-4 h-4 text-neutral-500 hover:text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSendPubWhatsApp}
                  className="w-full py-3.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  id="btn-enviar-whatsapp-pub"
                >
                  <Send className="w-4 h-4" />
                  Enviar Dados & Comprovante via WhatsApp
                </button>
              </div>

              <div className="text-left bg-neutral-100 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 mt-4">
                <p className="text-[11px] font-sans text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  ⚠️ <strong>Aviso Importante:</strong> Para garantir total segurança e integridade do portal, as publicações são validadas manualmente. Após enviar o Pix, clique no botão verde acima para enviar os dados e o comprovante para o Eduardo no WhatsApp (096991821516). Sua matéria será analisada e publicada imediatamente após a confirmação.
                </p>
              </div>

              <button
                onClick={() => setPubStep('form')}
                className="text-xs font-mono font-bold text-neutral-500 hover:text-red-600 dark:hover:text-red-400 hover:underline cursor-pointer block mx-auto mt-4"
              >
                Voltar e Corrigir Formulário
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
