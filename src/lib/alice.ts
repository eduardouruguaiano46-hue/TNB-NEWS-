/**
 * ALICE - Local AI Engine for TNB News
 * A fully self-contained AI assistant without external API dependencies
 * Base de conhecimento integrada ao repositório
 */

// ==================== KNOWLEDGE BASE ====================
const ALICE_KNOWLEDGE = {
  persona: {
    name: 'Alice',
    title: 'Assistente de IA Mística do TNB News',
    personality: 'enigmática, divertida, acolhedora, levemente bem-humorada',
    specialties: ['Tarot', 'Astrologia', 'Espiritualidade', 'Comunidade TNB'],
  },
  
  community_members: {
    'clara': {
      role: 'Moderadora',
      speciality: 'Previsões esportivas da comunidade',
      description: 'Dedicada e responsável pelas previsões esportivas',
    },
    'simon': {
      role: 'Tarólogo Oficial',
      speciality: 'Interpretação de constelações e cartas',
      description: 'Talentoso tarólogo oficial de plantão',
      aliases: ['simon astrólogo'],
    },
    'luma': {
      role: 'Integrante da Comunidade',
      speciality: 'Participante ativa',
      description: 'Integrante muito querida da comunidade',
      aliases: ['luma oliveira ravaglia'],
    },
    'eduardo': {
      role: 'Curador de Áudios',
      speciality: 'Gestão de conteúdo áudio',
      description: 'Dedicado curador de áudios da redação',
    },
    'dominique': {
      role: 'Organizadora de Eventos',
      speciality: 'Eventos, bolões e interações comunitárias',
      description: 'Responsável pela organização dos eventos',
    },
    'viih': {
      role: 'Especialista Mística',
      speciality: 'Relacionamentos e Baralho Cigano',
      description: 'Especialista mística em relacionamentos',
    },
  },

  portal_info: {
    name: 'TNB News',
    full_name: 'Tarot no Bolso News',
    description: 'Portal de jornalismo, fofocas esotéricas, humor e notícias oficiais da comunidade Tarot no Bolso',
    website: 'https://tnb-news.vercel.app',
    version: '33.33',
    
    features: [
      'Página Inicial Dinâmica com carrossel e grid de matérias',
      'Giro Esotérico Global com feed de notícias',
      'Escuta de Podcast Integrada',
      'Modo Escuro/Claro',
      'Seção de Comentários Funcional',
      'Changelog com histórico de entregas',
    ],

    podcast: {
      frequency: 'Toda terça-feira',
      note: '2º episódio reagendado (não será exibido em 14 de julho de 2026)',
    },

    app: {
      available: true,
      format: 'APK (Android)',
      stability: 'Alta',
    },

    alice_features: {
      credits: 'Suspenso por tempo indeterminado - GRATUITO',
      cost: 'Sem limite de créditos',
      api_dependency: 'NENHUMA - Engine local',
    },

    services: {
      sponsored_reporting: {
        name: 'Reportagem Patrocinada / Campanha Publicitária',
        price_original: 'R$ 20,00',
        current_discount: '17%',
        price_with_discount: 'R$ 16,60',
        promotion_valid: 'De 10 a 16 de Julho de 2026 até 23h59 (Brasília)',
      },
      
      donations: {
        method: 'Pix',
        key: 'b81276c8-8b98-44b2-906e-46803cd4802e',
        qr_code: 'https://pixqrcode-nys7envc.manus.space/',
        description: 'Contribuições voluntárias de qualquer valor',
      },
    },

    contact: {
      whatsapp: '+55 96 99182-1516',
      whatsapp_alternative: '096991821516',
      description: 'Contato exclusivo com a redação via WhatsApp',
    },

    access: {
      login_status: 'Temporariamente desativado',
      public_access: 'Liberado - 100% gratuito',
    },
  },

  tarot_knowledge: {
    major_arcana: [
      { number: 0, name: 'O Louco', meaning: 'Novo começo, liberdade' },
      { number: 1, name: 'O Mago', meaning: 'Poder, criatividade, manifestação' },
      { number: 2, name: 'A Sacerdotisa', meaning: 'Intuição, mistério, conhecimento interior' },
      { number: 3, name: 'A Imperatriz', meaning: 'Fertilidade, abundância, criação' },
      { number: 4, name: 'O Imperador', meaning: 'Autoridade, estabilidade, controle' },
      { number: 5, name: 'O Hierofante', meaning: 'Tradição, ensinamento, conformidade' },
      { number: 6, name: 'Os Enamorados', meaning: 'Amor, conexão, alinhamento de valores' },
      { number: 7, name: 'O Carro', meaning: 'Determinação, controle, vontade' },
      { number: 11, name: 'A Força', meaning: 'Coragem, paciência, controle interior' },
      { number: 12, name: 'O Enforcado', meaning: 'Sacrifício, perspectiva nova, entrega' },
      { number: 13, name: 'A Morte', meaning: 'Transformação, renascimento, transição' },
      { number: 14, name: 'A Temperança', meaning: 'Equilíbrio, moderação, harmonia' },
      { number: 15, name: 'O Diabo', meaning: 'Libertinagem, escravidão, materialismo' },
      { number: 16, name: 'A Torre', meaning: 'Mudanças bruscas, revelação, destruição' },
      { number: 17, name: 'A Estrela', meaning: 'Esperança, inspiração, clareza' },
      { number: 18, name: 'A Lua', meaning: 'Ilusão, intuição, medo' },
      { number: 19, name: 'O Sol', meaning: 'Sucesso, vitalidade, felicidade' },
      { number: 20, name: 'O Julgamento', meaning: 'Despertar, chamado, ressurreição' },
      { number: 21, name: 'O Mundo', meaning: 'Conclusão, cumprimento, viagem' },
    ],

    recent_predictions: [
      'Os Enamorados é a carta regente do segundo semestre de 2026',
      'A Torre em julho de 2026 sinaliza mudanças bruscas',
      'Ás de Paus traz energia de recomeços e iniciativa',
    ],
  },

  astrology: {
    mercury_retrograde: 'Múltiplas datas em 2026 - cuidado com comunicações',
    full_moon_in_taurus: 'Influência positiva nas finanças',
    current_season: 'Julho 2026',
  },

  spirituality: {
    concepts: [
      'Sincronicidade - significado de números iguais (11:11)',
      'Cristais de Proteção - Ametista e Turmalina Negra',
      'Jejum Espiritual - conexão com Chakras Superiores',
      'Mediunidade - sensibilidade desde a infância',
    ],
  },
};

// ==================== RESPONSE TEMPLATES ====================
const TAROT_CARDS = ALICE_KNOWLEDGE.tarot_knowledge.major_arcana;

function getRandomCard() {
  return TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
}

function getRandomGreeting() {
  const greetings = [
    '✨ Que as energias cósmicas te guiem bem!',
    '🔮 Saudações do universo, querido viajante!',
    '🌙 A intuição me diz que você chegou no momento certo!',
    '⭐ Bem-vindo à dimensão mística do TNB News!',
    '🧿 As cartas me sussurraram sua chegada!',
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

function getRandomClosing() {
  const card = getRandomCard();
  const closings = [
    `🎴 Carta do dia: **${card.name}** — ${card.meaning}`,
    `🔮 Oráculo diz: *${card.meaning}*`,
    `✨ Mensagem das estrelas: ${card.name} — ${card.meaning}`,
    `🌟 Previsão: A energia de **${card.name}** te acompanha hoje!`,
  ];
  return closings[Math.floor(Math.random() * closings.length)];
}

// ==================== KEYWORD MATCHING ====================
function findMembersInQuery(query: string): string[] {
  const members: string[] = [];
  const queryLower = query.toLowerCase();
  
  Object.entries(ALICE_KNOWLEDGE.community_members).forEach(([key, member]) => {
    if (queryLower.includes(key)) {
      members.push(key);
    }
    if (member.aliases?.some(alias => queryLower.includes(alias))) {
      members.push(key);
    }
  });
  
  return [...new Set(members)];
}

function findTopicsInQuery(query: string) {
  const queryLower = query.toLowerCase();
  const topics = {
    tarot: ['tarot', 'baralho', 'carta', 'arcano', 'cartomancia'],
    astrology: ['astrologia', 'horóscopo', 'signo', 'planeta', 'mercúrio retrógrado'],
    podcast: ['podcast', 'episódio', 'áudio', 'terça'],
    app: ['aplicativo', 'apk', 'android', 'celular', 'mobile'],
    donations: ['doação', 'apoio', 'pix', 'contribuir'],
    services: ['publicidade', 'reportagem', 'campanha', 'patrocínio', 'contratar'],
    community: ['comunidade', 'membros', 'tnb', 'tarot no bolso'],
  };

  const foundTopics: string[] = [];
  Object.entries(topics).forEach(([topic, keywords]) => {
    if (keywords.some(kw => queryLower.includes(kw))) {
      foundTopics.push(topic);
    }
  });

  return foundTopics;
}

// ==================== RESPONSE GENERATION ====================
function generateResponse(query: string): string {
  const greeting = getRandomGreeting();
  const topics = findTopicsInQuery(query);
  const members = findMembersInQuery(query);
  const queryLower = query.toLowerCase();

  let response = `${greeting}\n\n`;

  // Handle different query types
  if (queryLower.includes('olá') || queryLower.includes('oi') || queryLower.includes('opa')) {
    response += `Que alegria te receber no TNB News! 🌟\n\n`;
    response += `Sou a **Alice**, sua assistente mística do portal. Aqui você encontra:\n`;
    response += `• 📰 Notícias da comunidade\n`;
    response += `• 🔮 Previsões de tarot e astrologia\n`;
    response += `• 🎙️ Podcasts semanais\n`;
    response += `• 💬 Interação com a comunidade\n\n`;
    response += `**Como posso ajudar você hoje?**\n`;
  }

  // Handle tarot queries
  if (topics.includes('tarot')) {
    response += `🔮 **Sabedoria Tarótica do Momento:**\n\n`;
    if (queryLower.includes('enamorados')) {
      response += `Os **Enamorados** são a carta regente do segundo semestre de 2026! `;
      response += `Esta carta representa amor, conexão e alinhamento de valores. `;
      response += `Um período fabuloso para relacionamentos e decisões importantes.`;
    } else if (queryLower.includes('torre')) {
      response += `A **Torre** em julho de 2026 sinaliza mudanças bruscas! `;
      response += `Prepare-se para revelações e transformações. É hora de destruir o que não serve mais.`;
    } else if (queryLower.includes('ás de paus')) {
      response += `O **Ás de Paus** traz energia de recomeços e iniciativa! `;
      response += `Perfeito para começar novos projetos e abraçar desafios.`;
    } else {
      const randomCard = getRandomCard();
      response += `A carta que ressoa com sua pergunta é: **${randomCard.name}**\n`;
      response += `*Significado:* ${randomCard.meaning}\n`;
    }
    response += `\n\n`;
  }

  // Handle astrology queries
  if (topics.includes('astrology')) {
    response += `🌙 **Insights Astrológicos:**\n\n`;
    response += `• **Mercúrio Retrógrado em 2026:** Múltiplas datas — cuidado com comunicações! `;
    response += `Revise contratos e mensagens importantes.\n`;
    response += `• **Lua Cheia em Touro:** Influência positiva nas finanças! `;
    response += `Momento estratégico para investimentos.\n`;
    response += `• **Segundo Semestre 2026:** Sob a regência de Os Enamorados — `;
    response += `energia amorosa e de conexão.\n\n`;
  }

  // Handle community members queries
  if (members.length > 0) {
    response += `👥 **Membros da Comunidade:**\n\n`;
    members.forEach(memberKey => {
      const member = ALICE_KNOWLEDGE.community_members[memberKey];
      response += `**${memberKey.charAt(0).toUpperCase() + memberKey.slice(1)}** `;
      response += `(${member.role}): ${member.description}\n`;
    });
    response += `\n`;
  }

  // Handle podcast queries
  if (topics.includes('podcast')) {
    response += `🎙️ **Podcast TNB News:**\n\n`;
    response += `Acontece toda **terça-feira**! `;
    response += `⚠️ **IMPORTANTE:** O 2º episódio NÃO será exibido no dia 14 de julho de 2026 `;
    response += `devido ao recesso administrativo. Ele foi reagendado para data posterior.\n\n`;
  }

  // Handle app queries
  if (topics.includes('app')) {
    response += `📱 **Aplicativo TNB News:**\n\n`;
    response += `Disponível para Android em formato **APK**. `;
    response += `Acompanhe tudo direto no celular com total estabilidade! `;
    response += `Acesso gratuito e sem limitações.\n\n`;
  }

  // Handle services/donations queries
  if (topics.includes('services') || topics.includes('donations')) {
    response += `💰 **Serviços & Apoio:**\n\n`;
    response += `📢 **Reportagem Patrocinada / Campanha Publicitária:**\n`;
    response += `  • Preço: ~~R$ 20,00~~ **R$ 16,60** (17% OFF!)\n`;
    response += `  • Promoção válida até 16 de julho 2026 às 23h59\n\n`;
    response += `🤝 **Contribuições Voluntárias (Pix):**\n`;
    response += `  • Chave: \`b81276c8-8b98-44b2-906e-46803cd4802e\`\n`;
    response += `  • QR Code: https://pixqrcode-nys7envc.manus.space/\n`;
    response += `  • Qualquer valor é bem-vindo!\n\n`;
  }

  // Handle contact queries
  if (queryLower.includes('contato') || queryLower.includes('suporte') || queryLower.includes('redação')) {
    response += `📞 **Contato com a Redação:**\n\n`;
    response += `WhatsApp Oficial: **+55 96 99182-1516**\n`;
    response += `⏰ Atendimento durante horário comercial (segunda a sexta)\n\n`;
  }

  // Handle general site info
  if (queryLower.includes('tnb news') || queryLower.includes('sobre') || queryLower.includes('o que é')) {
    response += `📰 **Sobre o TNB News:**\n\n`;
    response += `${ALICE_KNOWLEDGE.portal_info.description}\n\n`;
    response += `**Versão:** v${ALICE_KNOWLEDGE.portal_info.version}\n`;
    response += `**Website:** ${ALICE_KNOWLEDGE.portal_info.website}\n`;
    response += `**Acesso:** 100% Gratuito e Aberto\n\n`;
  }

  // Default helpful response if no specific topic matched
  if (!topics.length && !members.length) {
    response += `Sua pergunta é mysteriosa! 🌌 Talvez você queira saber sobre:\n\n`;
    response += `• 🔮 **Tarot** - Previsões e cartas do dia\n`;
    response += `• 🌙 **Astrologia** - Influências cósmicas\n`;
    response += `• 👥 **Comunidade** - Membros do TNB\n`;
    response += `• 🎙️ **Podcast** - Episódios semanais\n`;
    response += `• 💬 **TNB News** - Sobre o portal\n`;
    response += `• 🤝 **Apoio** - Doações e patrocínios\n\n`;
    response += `Reformule sua pergunta e a magia acontecerá! ✨\n`;
  }

  // Add closing tarot card message
  response += `\n---\n\n`;
  response += getRandomClosing();

  return response;
}

// ==================== CHAT INTERFACE ====================
export interface AliceMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface AliceChat {
  messages: AliceMessage[];
  addMessage(role: 'user' | 'assistant', text: string): void;
  getResponse(userMessage: string): Promise<string>;
  clearHistory(): void;
}

export function createAliceChat(): AliceChat {
  const messages: AliceMessage[] = [];

  return {
    messages,

    addMessage(role: 'user' | 'assistant', text: string) {
      messages.push({
        role,
        text,
        timestamp: Date.now(),
      });
    },

    async getResponse(userMessage: string): Promise<string> {
      // Add user message
      this.addMessage('user', userMessage);

      // Generate response (synchronous, no API calls)
      const response = generateResponse(userMessage);

      // Add assistant response
      this.addMessage('assistant', response);

      return response;
    },

    clearHistory() {
      messages.length = 0;
    },
  };
}

// Export knowledge for reference
export { ALICE_KNOWLEDGE, getRandomCard, getRandomGreeting, getRandomClosing };
