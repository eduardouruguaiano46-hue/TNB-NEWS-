/**
 * Community Banner Information
 * Displayed on homepage to inform visitors about community status
 */

export const COMMUNITY_BANNER = {
  visible: true,
  type: 'info',
  
  content: {
    title: '🌟 Comunidade TNB Aberta',
    subtitle: 'Um espaço inclusivo para todos',
    
    sections: [
      {
        heading: '📢 Divulgações Bem-Vindas',
        text: 'Aceitamos divulgações de eventos e comunicados comunitários'
      },
      {
        heading: '🚫 Sem Novas Reportagens',
        text: 'Neste período, não aceitamos novas reportagens originais'
      },
      {
        heading: '💬 Participe!',
        text: 'Todos os comentários, sugestões e engajamento são encorajados'
      }
    ]
  },

  imagery: {
    qrCode: {
      visible: true,
      title: 'Acesse a Comunidade',
      url: 'https://i.postimg.cc/5YczC5pk/qr-code.jpg',
      description: 'Escaneie para acessar nossos canais'
    },
    
    ratSymbol: {
      visible: true,
      title: 'Símbolo TNB',
      url: 'https://i.postimg.cc/FdgxFnmv/rato-symbol.jpg',
      description: 'O rato: inteligência e sobrevivência'
    }
  },

  callToAction: {
    primary: {
      text: 'Junte-se à Comunidade',
      action: 'openCommunity'
    },
    secondary: {
      text: 'Saiba Mais',
      action: 'readGuidelines'
    }
  },

  // Meta information
  metadata: {
    createdAt: '2026-07-11T00:00:00Z',
    updatedAt: new Date().toISOString(),
    version: 'v1.0',
    status: 'active'
  }
};

export const COMMUNITY_TABLE_DATA = {
  title: 'Estatísticas da Comunidade',
  lastUpdated: '11 de Julho de 2026',
  
  statistics: [
    {
      label: 'Membros Ativos',
      value: '500+',
      trend: 'ascending',
      trendValue: '+15% este mês'
    },
    {
      label: 'Artigos Publicados',
      value: '20',
      trend: 'stable',
      trendValue: 'Matérias oficiais consolidadas'
    },
    {
      label: 'Comentários Totais',
      value: '1.2k',
      trend: 'ascending',
      trendValue: '+8% este mês'
    },
    {
      label: 'Categorias',
      value: '8',
      trend: 'stable',
      trendValue: 'Incluindo Sonhos e Umbanda'
    }
  ],

  categories: [
    { name: 'Comunidade', count: 5, status: 'ativo' },
    { name: 'Tarot', count: 5, status: 'ativo' },
    { name: 'Astrologia', count: 2, status: 'ativo' },
    { name: 'Espiritualidade', count: 3, status: 'ativo' },
    { name: 'Cristais', count: 1, status: 'ativo' },
    { name: 'Mediunidade', count: 1, status: 'ativo' },
    { name: 'Sonhos', count: 1, status: 'ativo' },
    { name: 'Umbanda', count: 1, status: 'ativo' }
  ],

  policies: {
    submissionStatus: 'Divulgações Abertas',
    newArticles: 'Não Aceitamos',
    comments: 'Bem-Vindos',
    community: 'Aberta'
  }
};
