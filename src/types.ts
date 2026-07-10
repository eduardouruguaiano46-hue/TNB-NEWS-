export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
}

export type Category = 'ultima-hora' | 'comunidade' | 'eventos' | 'opiniao' | 'podcast' | 'contato';

export type ArticleType = 'factual' | 'opiniao' | 'humor' | 'misterio';

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  content: string[]; // long text split by paragraphs
  category: Category;
  type: ArticleType;
  author: string;
  date: string;
  imageUrl?: string;
  technicalSpecs?: { label: string; value: string }[];
  comments: Comment[];
}

export interface SupportCampaign {
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  whatsapp: string;
  whatsappLink: string;
}
