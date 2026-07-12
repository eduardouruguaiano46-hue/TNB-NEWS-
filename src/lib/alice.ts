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
    version: '89.99',
    
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
      { number: 6, name: 'Os Enamorados', meaning: 'Amor, conexão, alinhamento de valores' },
      { number: 16, name: 'A Torre', meaning: 'Mudanças bruscas, revelação, destruição' },
      { number: 17, name: 'A Estrela', meaning: 'Esperança, inspiração, clareza' },
      { number: 19, name: 'O Sol', meaning: 'Sucesso, vitalidade, felicidade' },
    ],

    recent_predictions: [
      'Os Enamorados é a carta regente do segundo semestre de 2026',
      'A Torre em julho de 2026 sinaliza mudanças bruscas',
      'Ás de Paus traz energia de recomeços e iniciativa',
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
export function generateAliceResponse(query: string): string {
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
      response += `Os **Enamorados** são a carta regente do segundo semestre de 2026! Amor, conexão e alinhamento de valores. Perfeito para relacionamentos.`;
    } else if (queryLower.includes('torre')) {
      response += `A **Torre** em julho de 2026 sinaliza mudanças bruscas! Prepare-se para revelações e transformações.`;
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
    response += `• Mercúrio Retrógrado em 2026: Cuidado com comunicações!\n`;
    response += `• Lua Cheia em Touro: Influência positiva nas finanças\n`;
    response += `• Segundo Semestre 2026: Sob a regência de Os Enamorados\n\n`;
  }

  // Handle community members queries
  if (members.length > 0) {
    response += `👥 **Membros da Comunidade:**\n\n`;
    members.forEach(memberKey => {
      const member = ALICE_KNOWLEDGE.community_members[memberKey];
      response += `**${memberKey.charAt(0).toUpperCase() + memberKey.slice(1)}** (${member.role}): ${member.description}\n`;
    });
    response += `\n`;
  }

  // Handle podcast queries
  if (topics.includes('podcast')) {
    response += `🎙️ **Podcast TNB News:**\n\nAcontece toda **terça-feira**! ${ALICE_KNOWLEDGE.portal_info.podcast.note}\n\n`;
  }

  // Handle services/donations queries
  if (topics.includes('services') || topics.includes('donations')) {
    response += `💰 **Serviços & Apoio:**\n\n`;
    response += `📢 Reportagem Patrocinada: ~~R$ 20,00~~ **R$ 16,60** (17% OFF!)\n`;
    response += `🤝 Pix: \`b81276c8-8b98-44b2-906e-46803cd4802e\`\n\n`;
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

// Export knowledge for reference
export { ALICE_KNOWLEDGE, getRandomCard, getRandomGreeting, getRandomClosing };
