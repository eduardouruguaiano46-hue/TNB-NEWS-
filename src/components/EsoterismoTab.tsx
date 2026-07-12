import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Compass, 
  Info, 
  HelpCircle,
  Star,
  Flame,
  Droplet,
  Wind,
  Mountain
} from 'lucide-react';

interface EsoterismoTabProps {
  userZodiacSign: string;
}

const ZODIAC_DETAILS: Record<string, {
  element: string;
  ruler: string;
  strengths: string;
  weaknesses: string;
  symbol: string;
  icon: string;
  description: string;
  luckyNumbers: string;
  color: string;
}> = {
  'Áries': {
    element: 'Fogo',
    ruler: 'Marte',
    strengths: 'Corajoso, determinado, confiante, entusiasmado, otimista',
    weaknesses: 'Impaciente, temperamental, pavio curto, impulsivo, agressivo',
    symbol: '🐏',
    icon: 'Flame',
    color: 'Vermelho Vibrante',
    luckyNumbers: '9, 18, 27',
    description: 'Como o primeiro signo do zodíaco, a presença de Áries sempre inicia algo enérgico e turbulento. Eles estão continuamente procurando por dinâmica, velocidade e competição.'
  },
  'Touro': {
    element: 'Terra',
    ruler: 'Vênus',
    strengths: 'Confiável, paciente, prático, dedicado, responsável, estável',
    weaknesses: 'Teimoso, possessivo, intransigente',
    symbol: '🐂',
    icon: 'Mountain',
    color: 'Verde Esmeralda',
    luckyNumbers: '2, 6, 11',
    description: 'Prático e bem fundamentado, Touro colhe os frutos do trabalho duro. Eles sentem a necessidade de estar sempre cercados de amor e beleza, voltados para o mundo material.'
  },
  'Gêmeos': {
    element: 'Ar',
    ruler: 'Mercúrio',
    strengths: 'Gentil, afetuoso, curioso, adaptável, habilidade de aprender rápido',
    weaknesses: 'Nervoso, inconsistente, indeciso',
    symbol: '♊',
    icon: 'Wind',
    color: 'Amarelo Claro',
    luckyNumbers: '5, 7, 14, 23',
    description: 'Expressivo e de raciocínio rápido, Gêmeos apresenta duas personalidades distintas em uma e você nunca terá certeza de qual delas enfrentará. Eles são sociáveis e comunicativos.'
  },
  'Câncer': {
    element: 'Água',
    ruler: 'Lua',
    strengths: 'Tenaz, altamente imaginativo, leal, simpático, persuasivo',
    weaknesses: 'Temperamental, pessimista, desconfiado, inseguro',
    symbol: '🦀',
    icon: 'Droplet',
    color: 'Prata ou Branco',
    luckyNumbers: '2, 3, 15, 20',
    description: 'Profundamente intuitivo e sentimental, Câncer pode ser um dos signos mais desafiadores do zodíaco para se conhecer. Eles são muito emocionais e sensíveis, e se importam profundamente com assuntos da família.'
  },
  'Leão': {
    element: 'Fogo',
    ruler: 'Sol',
    strengths: 'Criativo, apaixonado, generoso, de bom coração, alegre, bem-humorado',
    weaknesses: 'Arrogante, teimoso, egocêntrico, preguiçoso, inflexível',
    symbol: '🦁',
    icon: 'Flame',
    color: 'Dourado ou Laranja',
    luckyNumbers: '1, 3, 10, 19',
    description: 'Leão é um líder natural. Eles são dramáticos, criativos, autoconfiantes, dominantes e extremamente difíceis de resistir, capazes de alcançar qualquer coisa que queiram.'
  },
  'Virgem': {
    element: 'Terra',
    ruler: 'Mercúrio',
    strengths: 'Leal, analítico, gentil, trabalhador, prático',
    weaknesses: 'Tímido, preocupado, excessivamente crítico consigo mesmo e com os outros',
    symbol: '♍',
    icon: 'Mountain',
    color: 'Cinza ou Bege',
    luckyNumbers: '5, 14, 23',
    description: 'Virgem presta atenção aos mínimos detalhes e sua profunda humanidade faz dele um dos signos mais cuidadosos do zodíaco. Sua abordagem metódica garante que nada seja deixado ao acaso.'
  },
  'Libra': {
    element: 'Ar',
    ruler: 'Vênus',
    strengths: 'Cooperativo, diplomático, gracioso, justo, social',
    weaknesses: 'Indeciso, evita confrontos, guarda rancor, autoflagelo',
    symbol: '♎',
    icon: 'Wind',
    color: 'Rosa Pastel ou Azul',
    luckyNumbers: '4, 6, 13, 15, 24',
    description: 'Pessoas nascidas sob o signo de Libra são pacíficas, justas e odeiam estar sozinhas. A parceria é muito importante para elas, pois seu espelho e sua própria luz encontram equilíbrio na conexão.'
  },
  'Escorpião': {
    element: 'Água',
    ruler: 'Plutão',
    strengths: 'Recurso, corajoso, apaixonado, teimoso, um amigo verdadeiro',
    weaknesses: 'Desconfiado, ciumento, reservado, violento',
    symbol: '🦂',
    icon: 'Droplet',
    color: 'Preto ou Vermelho Escuro',
    luckyNumbers: '8, 11, 18, 22',
    description: 'Nascidos em Escorpião são apaixonados e assertivos. Eles são extremamente determinados e decisivos, e pesquisarão até encontrar a verdade. Escorpião é um grande líder, sempre ciente da situação.'
  },
  'Sagitário': {
    element: 'Fogo',
    ruler: 'Júpiter',
    strengths: 'Generoso, idealista, grande senso de humor',
    weaknesses: 'Promete mais do que pode entregar, impaciente, diz qualquer coisa sem filtro',
    symbol: '🏹',
    icon: 'Flame',
    color: 'Azul Escuro ou Púrpura',
    luckyNumbers: '3, 12, 21, 30',
    description: 'Curioso e enérgico, Sagitário é um dos maiores viajantes entre todos os signos do zodíaco. Sua mente aberta e visão filosófica os motiva a passear pelo mundo em busca do sentido da vida.'
  },
  'Capricórnio': {
    element: 'Terra',
    ruler: 'Saturno',
    strengths: 'Responsável, disciplinado, autocontrole, bom gerente',
    weaknesses: 'Sabe-tudo, implacável, condescendente, esperando o pior',
    symbol: '🐐',
    icon: 'Mountain',
    color: 'Marrom ou Cinza Escuro',
    luckyNumbers: '4, 8, 13, 22',
    description: 'Capricórnio é um signo que representa o tempo e a responsabilidade, e seus praticantes são tradicionais e muitas vezes muito sérios por natureza. Possuem uma independência gigante.'
  },
  'Aquário': {
    element: 'Ar',
    ruler: 'Urano',
    strengths: 'Progressista, original, independente, humanitário',
    weaknesses: 'Foge da expressão emocional, temperamental, intransigente, distante',
    symbol: '♒',
    icon: 'Wind',
    color: 'Azul Turquesa',
    luckyNumbers: '4, 7, 11, 22, 29',
    description: 'Nascidos sob o signo de Aquário são tímidos e quietos, mas por outro lado podem ser excêntricos e energéticos. No entanto, em ambos os casos, eles são profundos pensadores e intelectuais.'
  },
  'Peixes': {
    element: 'Água',
    ruler: 'Netuno',
    strengths: 'Compassivo, artístico, intuitivo, gentil, sábio, musical',
    weaknesses: 'Medroso, excessivamente confiável, triste, desejo de fugir da realidade',
    symbol: '🐟',
    icon: 'Droplet',
    color: 'Lilás ou Verde-mar',
    luckyNumbers: '3, 9, 12, 15, 18',
    description: 'Peixes são muito amigáveis, por isso muitas vezes se encontram em companhia de pessoas muito diferentes. Eles são altruístas, sempre dispostos a ajudar os outros, sem esperar nada em troca.'
  }
};

const ASTROLOGY_CURIOSITIES = [
  {
    title: 'A Origem do Zodíaco',
    content: 'O sistema do zodíaco foi criado pelos babilônios no primeiro milênio a.C., dividindo o cinturão celestial em doze partes iguais, cada uma nomeada em homenagem às constelações que cruzavam.'
  },
  {
    title: 'O Signo Ascendente',
    content: 'Enquanto o signo solar representa o seu "eu profundo" e essência, o signo Ascendente indica a forma como você se apresenta ao mundo exterior e a primeira impressão que causa nas pessoas.'
  },
  {
    title: 'Planetas Retrógrados',
    content: 'Meras ilusões de ótica onde um planeta parece mover-se para trás a partir do ponto de vista da Terra. Na astrologia, períodos retrógrados (como Mercúrio Retrógrado) indicam momentos cruciais de revisão, introspecção e reavaliação.'
  },
  {
    title: 'Os Quatro Elementos',
    content: 'Os doze signos são divididos igualmente entre Fogo (ação, paixão), Terra (estabilidade, pragmatismo), Ar (intelecto, comunicação) e Água (emoções, intuição).'
  }
];

export default function EsoterismoTab({ userZodiacSign }: EsoterismoTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'compatibility' | 'curiosities'>('profile');
  const [partnerSign, setPartnerSign] = useState('Touro');
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [compatibilityText, setCompatibilityText] = useState('');

  // Get user zodiac details
  const mySign = userZodiacSign || 'Áries';
  const mySignDetails = ZODIAC_DETAILS[mySign] || ZODIAC_DETAILS['Áries'];

  const calculateCompatibility = () => {
    // Generate a fun pseudo-random but stable score based on characters of the sign names
    const combinedStr = mySign + partnerSign;
    let score = 0;
    for (let i = 0; i < combinedStr.length; i++) {
      score += combinedStr.charCodeAt(i);
    }
    const finalScore = 55 + (score % 41); // Ranges between 55% and 96%
    setCompatibilityScore(finalScore);

    // Interpretations
    const myElement = mySignDetails.element;
    const partnerElement = ZODIAC_DETAILS[partnerSign]?.element || 'Fogo';

    let explanation = '';
    if (myElement === partnerElement) {
      explanation = `Sinergia estelar excepcional! Por compartilharem o elemento ${myElement}, vocês sintonizam na mesma frequência espiritual e se compreendem sem palavras. Há fluidez nas trocas e harmonia cósmica natural.`;
    } else if (
      (myElement === 'Fogo' && partnerElement === 'Ar') || 
      (myElement === 'Ar' && partnerElement === 'Fogo')
    ) {
      explanation = 'Uma combinação altamente inspiradora! O elemento Ar estimula e espalha o entusiasmo do elemento Fogo. Vocês impulsionam as ambições um do outro e mantêm a chama da curiosidade e do movimento sempre viva!';
    } else if (
      (myElement === 'Terra' && partnerElement === 'Água') || 
      (myElement === 'Água' && partnerElement === 'Terra')
    ) {
      explanation = 'Combinação extremamente fértil e segura. A Água nutre a Terra, permitindo que sonhos frutifiquem e se tornem tangíveis, enquanto a Terra oferece a estrutura e o porto seguro que a sensibilidade da Água precisa.';
    } else if (
      (myElement === 'Fogo' && partnerElement === 'Água') || 
      (myElement === 'Água' && partnerElement === 'Fogo')
    ) {
      explanation = 'Uma dinâmica intensa e cheia de extremos. O fogo evapora a água e a água apaga o fogo. Esta união exige alto nível de maturidade e equilíbrio para transmutar o choque de forças em uma poderosa alquimia criativa.';
    } else {
      explanation = 'Afinidade estimulante. Elementos distintos significam que vocês trazem perspectivas totalmente novas um para o outro. Com respeito e empatia, essa união pode ser um catalisador incrível para o crescimento mútuo!';
    }

    setCompatibilityText(explanation);
  };

  const renderElementIcon = (element: string) => {
    switch (element) {
      case 'Fogo': return <Flame className="w-5 h-5 text-amber-500 animate-pulse" />;
      case 'Água': return <Droplet className="w-5 h-5 text-blue-500" />;
      case 'Ar': return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'Terra': return <Mountain className="w-5 h-5 text-emerald-600" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl">
      
      {/* Title */}
      <div className="border-b-2 border-red-700 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-black text-red-700 dark:text-red-500 uppercase tracking-tight flex items-center gap-2">
            <Compass className="w-8 h-8 text-red-600 dark:text-red-400 animate-spin-slow" />
            Giro do Cosmos & Esoterismo
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono mt-1">
            Seu guia astrológico personalizado baseado no seu signo de cadastro: <strong>{mySign}</strong>
          </p>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 shrink-0 max-w-full overflow-x-auto">
          {[
            { id: 'profile', label: 'Meu Perfil Astral' },
            { id: 'compatibility', label: 'Compatibilidade' },
            { id: 'curiosities', label: 'Curiosidades Cósmicas' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id 
                  ? 'bg-red-700 text-white shadow-sm' 
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB CONTENTS: USER ASTRAL PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Sign Profile Card */}
          <div className="md:col-span-4 bg-gradient-to-b from-red-50 to-white dark:from-neutral-950 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
            <div className="absolute top-2 right-2 text-xs font-mono text-red-600 dark:text-red-400 font-bold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-0.5 rounded-full">
              Seu Signo
            </div>
            
            <div className="text-7xl mb-4 select-none animate-pulse">{mySignDetails.symbol}</div>
            <h3 className="font-serif text-3xl font-black text-neutral-900 dark:text-white mb-1">{mySign}</h3>
            <p className="text-xs text-neutral-500 font-mono mb-4">Regido por {mySignDetails.ruler}</p>

            <div className="w-full space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-left">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-500 font-bold">ELEMENTO:</span>
                <span className="flex items-center gap-1.5 font-semibold text-neutral-850 dark:text-neutral-200">
                  {renderElementIcon(mySignDetails.element)}
                  {mySignDetails.element}
                </span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-500 font-bold">CORES AFINS:</span>
                <span className="font-semibold text-neutral-850 dark:text-neutral-200">{mySignDetails.color}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-500 font-bold">NÚMEROS DA SORTE:</span>
                <span className="font-semibold text-neutral-850 dark:text-neutral-200">{mySignDetails.luckyNumbers}</span>
              </div>
            </div>
          </div>

          {/* Horoscope & Strengths Info */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-6 shadow-xs relative">
              <span className="absolute -top-3 left-4 bg-red-700 text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 rounded-sm uppercase">
                Conselho do Horóscopo do Dia
              </span>
              <p className="font-serif italic text-base leading-relaxed text-neutral-800 dark:text-neutral-300 pt-3">
                "A sintonia da Lua com seu regente indica que as próximas horas serão perfeitas para reorganizar suas prioridades espirituais e comunitárias. Um sopro de insights favoráveis inundará sua intuição ao ler o TNB News hoje. Permita-se compartilhar seu saber com quem necessita e mantenha-se sintonizado com as forças benévolas do Cosmos."
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 p-5 rounded-2xl shadow-xs">
                <h4 className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  Virtudes Principais
                </h4>
                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">{mySignDetails.strengths}</p>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-850 p-5 rounded-2xl shadow-xs">
                <h4 className="font-mono text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-red-500 text-red-500" />
                  Desafios Cósmicos
                </h4>
                <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">{mySignDetails.weaknesses}</p>
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-serif">
              <strong>Sobre seu Signo:</strong> {mySignDetails.description}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB CONTENTS: COMPATIBILITY CALCULATOR */}
      {activeSubTab === 'compatibility' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-6">
            <Heart className="w-12 h-12 text-red-600 mx-auto animate-pulse fill-red-600/10" />
            <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">Oráculo de Compatibilidade</h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">Veja a afinidade energética do seu signo com outros elementos do zodíaco</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-center">
            {/* My Sign */}
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-5 rounded-2xl text-center">
              <div className="text-4xl mb-1">{mySignDetails.symbol}</div>
              <h4 className="text-sm font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300">Meu Signo</h4>
              <p className="text-sm font-serif font-black text-red-700 dark:text-red-500">{mySign}</p>
            </div>

            {/* Spark Indicator / Action */}
            <div className="text-center flex flex-col justify-center items-center gap-3">
              <button
                onClick={calculateCompatibility}
                className="bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold uppercase tracking-wider py-3 px-5 rounded-xl hover:scale-105 transition-all shadow-md cursor-pointer"
              >
                Calcular Afinidade
              </button>
            </div>

            {/* Target Sign Selection */}
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-5 rounded-2xl text-center">
              <div className="text-4xl mb-1">
                {ZODIAC_DETAILS[partnerSign]?.symbol || '✨'}
              </div>
              <label className="block text-xs font-mono font-bold uppercase text-neutral-700 dark:text-neutral-300 mb-1">
                Signo do Parceiro
              </label>
              <select
                value={partnerSign}
                onChange={(e) => {
                  setPartnerSign(e.target.value);
                  setCompatibilityScore(null);
                }}
                className="w-full text-xs bg-white dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 py-1.5 px-2 rounded-lg text-center font-mono focus:outline-none"
              >
                {Object.keys(ZODIAC_DETAILS).map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Compatibility results */}
          {compatibilityScore !== null && (
            <div className="border border-red-200 dark:border-red-900/50 bg-red-50/55 dark:bg-red-950/20 rounded-2xl p-6 text-center shadow-sm">
              <h4 className="font-mono text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest mb-1.5">
                Resultado Alquímico
              </h4>
              
              {/* Dynamic affinity bar */}
              <div className="flex flex-col items-center gap-1.5 mb-4">
                <span className="text-4xl md:text-5xl font-black font-mono text-red-700 dark:text-red-500">
                  {compatibilityScore}%
                </span>
                <div className="w-full max-w-md h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden border dark:border-neutral-700">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${compatibilityScore}%` }}
                  />
                </div>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-300 italic max-w-lg mx-auto font-serif">
                "{compatibilityText}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB CONTENTS: CURIOSITIES */}
      {activeSubTab === 'curiosities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {ASTROLOGY_CURIOSITIES.map((item, idx) => (
            <div 
              key={idx}
              className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 p-5 rounded-2xl relative shadow-xs"
            >
              <Info className="w-4 h-4 text-red-600 dark:text-red-400 absolute top-4 right-4" />
              <h4 className="font-serif text-lg font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h4>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{item.content}</p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
