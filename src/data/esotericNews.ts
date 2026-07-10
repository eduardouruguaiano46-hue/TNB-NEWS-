export interface EsotericNewsItem {
  id: string;
  title: string;
  source: string;
  category: 'Astrologia' | 'Tarot' | 'Espiritualidade' | 'Cristais' | 'Mediunidade' | 'Sonhos' | 'Umbanda';
  summary: string;
  date: string;
  url?: string;
  author: string;
  imageUrl: string;
  content: string[];
}

export const ESOTERIC_SOURCES = [
  'Personare', 'Astrocentro', 'WeMystic Brasil', 'João Bidu', 'Horóscopo Virtual',
  'Revista Cláudia Esotérica', 'Bons Fluidos', 'Estrela Guia Tarot', 'Universo da Cabala',
  'Espiritualidade Hoje', 'Portal Místicos', 'Revista Caminho Sagrado', 'Luz do Terceiro Olho',
  'Instituto de Pesquisas Psíquicas', 'O Segredo', 'Vibracoes Positivas', 'Almanaque Esotérico',
  'Oráculo de Delfos', 'Jornal Astrológico', 'Tarot de Marselha Online', 'Casa dos Anjos',
  'Tenda dos Orixás', 'Espaço Holístico', 'Clube do Tarot', 'Astros e Runas', 'Guia das Pratas',
  'Misticismo e Fé', 'Universo Violeta', 'Luz da Alma', 'Sabedoria Ancestral', 'Ganesha Portal',
  'Mandala Esotérica', 'Conexão Urânia', 'Portal Wicca Brasil', 'Caminhos do Xamanismo',
  'Energia Dos Cristais', 'Zen Channel', 'Oásis da Alma', 'Despertar Quântico'
];

export const ESOTERIC_NEWS_ITEMS: EsotericNewsItem[] = [
  {
    id: 'eso-6',
    title: 'Tarô: Os Enamorados é a carta regente do segundo semestre de 2026',
    source: 'Estrela Guia Tarot',
    category: 'Tarot',
    summary: 'O segundo semestre de 2026 convida a um protagonismo consciente. Em vez de se sentir à mercê dos acontecimentos, a energia dos Enamorados pede decisões baseadas no coração e na ética.',
    date: '04 de Julho de 2026',
    author: 'Renata Souza (Estrela Guia Tarot)',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/QHdUsGxPicHIvOTt.jpg',
    content: [
      'O segundo semestre de 2026 convida a um protagonismo consciente. Em vez de se sentir à mercê dos acontecimentos, a energia dos Enamorados pede decisões baseadas no coração e na ética.',
      'Segundo tarólogos renomados de portais como o Estrela Guia Tarot, a regência desta carta nos próximos seis meses enfatiza a necessidade de alinhar escolhas materiais com os anseios da alma. É um período ideal para reavaliar parcerias e compromissos profissionais.',
      'Diferente de visões simplistas que associam os Enamorados apenas a dilemas amorosos, o arcano fala sobre a busca pela inteireza. Cada escolha moldará o futuro de magnitude de cada indivíduo na comunidade, exigindo coragem para assumir as consequências de suas resoluções.'
    ]
  },
  {
    id: 'eso-7',
    title: 'Previsões de Tarot: A Torre em julho de 2026 sinaliza mudanças bruscas',
    source: 'Portal Místicos',
    category: 'Tarot',
    summary: 'As previsões para julho de 2026 trazem A Torre como alerta. É um momento de desconstrução para que o novo possa surgir, exigindo resiliência e desapego de padrões obsoletos.',
    date: '29 de Junho de 2026',
    author: 'Luiz Místico (Portal Místicos)',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/jOcmrKmPJTrpKNHc.jpg',
    content: [
      'As previsões para julho de 2026 trazem A Torre como alerta. É um momento de desconstrução para que o novo possa surgir, exigindo resiliência e desapego de padrões obsoletos.',
      'De acordo com o Portal Místicos, o décimo sexto Arcano Maior aparece como carta coletiva do mês, indicando que estruturas de ego e crenças rígidas serão testadas. Rompimentos inesperados podem ser necessários para abrir espaço à verdade sutil.',
      'Enfrentar a queda da torre exige coragem. Em vez de resistir à mudança, a sabedoria esotérica recomenda permitir o fluxo de transmutação, lembrando que após a destruição da torre, resta apenas a terra limpa e o céu aberto para novas e luminosas construções.'
    ]
  },
  {
    id: 'eso-8',
    title: 'Tarot Semanal: Ás de Paus traz energia de recomeços e iniciativa',
    source: 'Tarot de Marselha Online',
    category: 'Tarot',
    summary: 'A energia da semana é de ação. O Ás de Paus simboliza a centelha criativa e a força de vontade necessária para tirar planos do papel e iniciar novas jornadas profissionais.',
    date: '05 de Julho de 2026',
    author: 'Taróloga Simone',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/NEcJPgmBGmiZHVrY.jpg',
    content: [
      'A energia da semana é de ação. O Ás de Paus simboliza a centelha criativa e a força de vontade necessária para tirar planos do papel e iniciar novas jornadas profissionais.',
      'Como aponta o Tarot de Marselha Online, a semana de 06 a 12 de julho será marcada por um sopro de vitalidade e ideias originais. Projetos que estavam engavetados voltam a ganhar tração por conta deste canal energético de iniciativa pura.',
      'Aproveite esta centelha mística para tomar as rédeas de suas metas. O fogo do Ás de Paus traz a energia necessária para liderar transformações pessoais, mas cabe à disciplina humana manter essa chama acesa no longo prazo.'
    ]
  },
  {
    id: 'eso-9',
    title: 'Mercúrio Retrógrado em 2026: Datas e como se preparar para os desafios',
    source: 'Personare',
    category: 'Astrologia',
    summary: 'O fenômeno de Mercúrio Retrógrado exige cautela com contratos, eletrônicos e mal-entendidos. Saiba as datas exatas e como usar esse tempo para introspecção e revisão.',
    date: '01 de Julho de 2026',
    author: 'Equipe Editorial Personare',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/RbQRtLvmOgbJTdnL.jpg',
    content: [
      'O fenômeno de Mercúrio Retrógrado exige cautela com contratos, eletrônicos e mal-entendidos. Saiba as datas exatas e como usar esse tempo para introspecção e revisão.',
      'Segundo especialistas do Personare, o movimento aparente de retrogradação demanda atenção especial com canais digitais. Mensagens em aplicativos de mensagens podem ser mal interpretadas se enviadas sem o devido cuidado.',
      'Aproveite este ciclo não com medo, mas como uma oportunidade cósmica para rever, refazer e organizar pendências. É um período excelente para meditações de silenciamento e reconexão com a própria verdade sutil.'
    ]
  },
  {
    id: 'eso-10',
    title: 'A Ascensão do Tarot de Marselha entre a Geração Z',
    source: 'Horóscopo Virtual',
    category: 'Tarot',
    summary: 'O Tarot de Marselha vive um renascimento nas redes sociais. A estética clássica e o simbolismo profundo atraem uma nova geração em busca de respostas existenciais.',
    date: '08 de Julho de 2026',
    author: 'Júlia Mendes (Horóscopo Virtual)',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/RaaZONFFXmlfYLkN.jpg',
    content: [
      'O Tarot de Marselha vive um renascimento nas redes sociais. A estética clássica e o simbolismo profundo atraem uma nova geração em busca de respostas existenciais.',
      'De acordo com o Horóscopo Virtual, a Geração Z tem resgatado o baralho clássico como ferramenta de autoanálise terapêutica. A abordagem afasta-se de previsões dogmáticas e foca no empoderamento e autoconhecimento diário.',
      'Esse movimento une o digital à sabedoria secular das cartas, provando que as imagens medievais permanecem extremamente relevantes para os dilemas contemporâneos dos jovens.'
    ]
  },
  {
    id: 'eso-11',
    title: 'A influência da Lua Cheia em Touro nas finanças',
    source: 'Jornal Astrológico',
    category: 'Astrologia',
    summary: 'Com a Lua em Touro, o foco volta-se para a segurança e o conforto. É um período ideal para organizar orçamentos e investir em projetos de longo prazo.',
    date: '07 de Julho de 2026',
    author: 'Cláudio Bernardes (Astrólogo)',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/ZDByKFEHLqbVHgny.jpg',
    content: [
      'Com a Lua em Touro, o foco volta-se para a segurança e o conforto. É um período ideal para organizar orçamentos e investir em projetos de longo prazo.',
      'O Jornal Astrológico destaca que a estabilidade material estará em evidência. É o momento de colher os frutos do esforço e firmar compromissos comerciais de forma madura e calculada.',
      'Dica esotérica: medite carregando cristais de abundância, como a Pirita ou Citrino, sintonizando seu campo vibracional com as forças de materialização desta lua de terra.'
    ]
  },
  {
    id: 'eso-12',
    title: 'Sincronicidade: O significado de ver números iguais como 11:11',
    source: 'O Segredo',
    category: 'Espiritualidade',
    summary: 'Ver sequências numéricas repetitivas não é coincidência. Para muitos, são sinais do universo ou guias espirituais tentando chamar a atenção para o momento presente.',
    date: '06 de Julho de 2026',
    author: 'Redação O Segredo',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/GKDxlUokJpsIAzzl.jpg',
    content: [
      'Ver sequências numéricas repetitivas não é coincidência. Para muitos, são sinais do universo ou guias espirituais tentando chamar a atenção para o momento presente.',
      'O Segredo analisa que avistar 11:11 ou 22:22 constantemente está intimamente ligado à psicologia analítica de Carl Jung sobre a sincronicidade, indicando um alinhamento entre o inconsciente e o mundo externo.',
      'Ao ver estes números, pare por alguns instantes, respire fundo e tome consciência de seus pensamentos e emoções vigentes, acolhendo o lembrete de que você está no caminho certo.'
    ]
  },
  {
    id: 'eso-13',
    title: 'Cristais de Proteção: Ametista e Turmalina Negra contra energias densas',
    source: 'Energia Dos Cristais',
    category: 'Cristais',
    summary: 'A combinação de Ametista e Turmalina Negra é considerada uma das mais potentes para limpeza e proteção. Aprenda a consagrar e posicionar seus cristais.',
    date: '09 de Julho de 2026',
    author: 'Renata Souza (Cristaloterapeuta)',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/HqsMDFHFWubhZFNX.jpg',
    content: [
      'A combinação de Ametista e Turmalina Negra é considerada uma das mais potentes para limpeza e proteção. Aprenda a consagrar e posicionar seus cristais.',
      'Conforme a editoria de Energia Dos Cristais, a Turmalina Negra funciona como um escudo absorvedor de vibrações densas, enquanto a Ametista transmuta as cargas remanescentes em frequências elevadas de paz.',
      'Manter esta dupla de minerais em sua mesa de escritório ou na cabeceira ajuda a purificar o campo sutil e afastar o estresse provocado pelas interações cotidianas.'
    ]
  },
  {
    id: 'eso-14',
    title: 'Jejum Espiritual e os Chakras Superiores',
    source: 'Revista Caminho Sagrado',
    category: 'Espiritualidade',
    summary: 'Como a abstenção consciente pode potencializar a intuição e a mediunidade.',
    date: '09 de Julho de 2026',
    author: 'Yogi Shivananda',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/enjWTNVmeSXFfqzS.jpg',
    content: [
      'Práticas milenares de jejum visam a purificação do corpo sutil. Ao silenciar o sistema digestivo, a energia flui com mais facilidade para os centros de percepção superior.',
      'Segundo a Revista Caminho Sagrado, abster-se conscientemente de alimentos por curtos períodos direciona o Prana (energia vital) para o chakra coronário e o terceiro olho, ampliando a sensibilidade intuitiva.',
      'É vital realizar a prática com reverência espiritual e acompanhamento adequado, unindo o jejum à oração e meditação silenciosa para colher benefícios na percepção sutil.'
    ]
  },
  {
    id: 'eso-15',
    title: 'Mediunidade na Infância: Como acolher crianças altamente sensíveis',
    source: 'Instituto de Pesquisas Psíquicas',
    category: 'Mediunidade',
    summary: 'Especialistas orientam pais sobre sinais de percepção aguçada e campos magnéticos.',
    date: '08 de Julho de 2026',
    author: 'Dra. Sandra Alencar',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/rhkwMMxqkNhVxwii.jpg',
    content: [
      'Crianças que manifestam sensibilidade espiritual precisam de um ambiente seguro e acolhedor. O suporte psicológico e espiritual é fundamental para um desenvolvimento saudável.',
      'O Instituto de Pesquisas Psíquicas alerta sobre a importância de validar os relatos infantis sem causar medo. Acolher traços de alta sensibilidade com afeto e serenidade fortalece o equilíbrio energético da criança.',
      'Ensinar visualizações simples de blindagem, como imaginar uma bolha de luz dourada ao redor de si, é uma ótima maneira de ajudá-las a lidar com campos magnéticos intensos.'
    ]
  },
  {
    id: 'eso-16',
    title: 'Métodos de Tiragem de Tarot: As 5 mais adequadas para cada situação',
    source: 'Clube do Tarot',
    category: 'Tarot',
    summary: 'Escolher o método certo é o primeiro passo para uma leitura precisa.',
    date: '23 de Junho de 2026',
    author: 'Mestre Arcanologia',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/AcefblNDXfXMCIhJ.jpg',
    content: [
      'Do método das 3 cartas à Cruz Celta, cada tiragem tem um propósito específico. Aprenda qual usar para questões de amor, carreira ou decisões rápidas.',
      'O Clube do Tarot ensina que escolher a estrutura de jogo correta é o primeiro passo para uma leitura assertiva e clara. Métodos lineares servem perfeitamente para análises de causa e efeito em tempo recorde.',
      'Pratique tiragens regulares com perguntas objetivas para afinar sua leitura intuitiva e compreender as ricas conexões entre os arcanos do baralho.'
    ]
  },
  {
    id: 'eso-17',
    title: 'Significado Espiritual da Aranha: Criatividade e Destino',
    source: 'WeMystic Brasil',
    category: 'Espiritualidade',
    summary: 'A tecelã do universo traz mensagens sobre paciência e a construção do próprio caminho.',
    date: '23 de Junho de 2026',
    author: 'Redação WeMystic Brasil',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/UKtAhbgNLuQxMLmo.jpg',
    content: [
      'A aranha simboliza a capacidade de tecer a própria realidade. Ver uma aranha pode ser um lembrete para usar sua criatividade e habilidades para manifestar seus sonhos.',
      'O canal WeMystic Brasil aborda a aranha sob a ótica do xamanismo urbano, representando a paciência estratégica de quem aguarda o momento perfeito para agir.',
      'Aceite a mensagem da aranha como um convite para costurar seus próprios projetos com dedicação, fiando cada detalhe com foco e maestria pessoal.'
    ]
  },
  {
    id: 'eso-18',
    title: 'Sonhar com Incêndio: Guia completo de interpretações',
    source: 'Bons Fluidos',
    category: 'Sonhos',
    summary: 'O fogo nos sonhos pode representar tanto destruição quanto purificação e paixão.',
    date: '01 de Julho de 2026',
    author: 'Equipe Bons Fluidos',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/ixRPzkNGCpmzOCHp.jpg',
    content: [
      'Interpretar sonhos com fogo exige análise do contexto. Pode indicar uma fase de transformações intensas ou a necessidade de controlar emoções explosivas.',
      'A Revista Bons Fluidos destaca que sonhar com incêndio simboliza a transmutação alquímica e a destruição de velhos hábitos para que uma nova versão de si mesma possa florescer das cinzas.',
      'Se o fogo causava paz ou desespero no sonho ditará o tom da interpretação: purificação sagrada ou alerta de estresse mental acumulado sob a superfície.'
    ]
  },
  {
    id: 'eso-19',
    title: 'Significado Espiritual do Rato: Inteligência e Sobrevivência',
    source: 'Caminhos do Xamanismo',
    category: 'Espiritualidade',
    summary: 'Muitas vezes mal interpretado, o rato traz lições sobre adaptabilidade e foco.',
    date: '24 de Junho de 2026',
    author: 'Pajé Pena Branca',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/hcbtNyIrFQSZdVHj.jpg',
    content: [
      'Na espiritualidade, o rato pode representar a necessidade de prestar atenção aos pequenos detalhes ou a busca por recursos inusitados em tempos de escassez.',
      'Segundo o portal Caminhos do Xamanismo, o rato ensina lições profundas de adaptabilidade, sobrevivência silenciosa e foco nos pormenores que costumam passar despercebidos.',
      'Seja cauteloso com dispersões energéticas de magnitude. Avalie onde pequenos vazamentos de foco estão drenando seu poder pessoal no cotidiano.'
    ]
  },
  {
    id: 'eso-20',
    title: 'Tipos de Pombagira na Umbanda e suas características',
    source: 'Tenda dos Orixás',
    category: 'Umbanda',
    summary: 'Conheça as principais entidades e como elas atuam na proteção e no amor.',
    date: '24 de Junho de 2026',
    author: 'Pai de Santo da Tenda',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663826546061/HNuUWeKJeykUCVIZ.jpg',
    content: [
      'Da Pombagira Maria Padilha à Sete Saias, cada entidade possui sua própria falange e forma de trabalho espiritual, sempre focada no equilíbrio e na força feminina.',
      'A Tenda dos Orixás aborda com respeito as características dessas guardiãs da Umbanda, que atuam na proteção, caminhos afetivos e no corte de demandas energéticas negativas.',
      'Entender suas atuações purifica conceitos preconceituosos e revela a alta magnitude dessas entidades que operam na linha de frente do equilíbrio espiritual e da justiça sutil.'
    ]
  }
];
