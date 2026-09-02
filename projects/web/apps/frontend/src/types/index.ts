// ============================================================================
// FaruTech — Sistema de tipos "Lego" (Content-Driven)
// Única fuente de verdad para la forma de los datos de contenido.
// ============================================================================

export type BlockType =
  | 'hero'
  | 'intro'
  | 'problems'
  | 'approach'
  | 'useCases'
  | 'cta'
  | 'metrics'
  | 'testimonials'
  | 'faq'
  | 'timeline'
  | 'team'
  | 'pricing'
  | 'contact'
  | 'gallery'
  | 'video'
  | 'stats'
  | 'logos'
  | 'features';

export type BlockPosition = 'left' | 'right' | 'centered' | 'full';

/** Layout visual del hero — define el "ADN" de forma (ver docs/nextsteps). */
export type HeroLayout = 'origami-left' | 'origami-right' | 'dark-authority' | 'organic';

export type AnimationType = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'none';

export interface BlockItem {
  title: string;
  description: string;
  icon?: string;
  value?: string;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  position: BlockPosition;
  title?: string;
  subtitle?: string;
  content?: string;
  items?: BlockItem[];
  cta?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'outline' };
  image?: { src: string; alt: string };
  video?: { src: string; webm?: string; poster: string; alt: string };
  bgClass?: string;
  animation?: AnimationType;
  heroLayout?: HeroLayout;
}

export interface SolutionSEO {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage: string;
}

export interface SolutionConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
  gradient: string;
  shape: string;
  seo: SolutionSEO;
  blocks: ContentBlock[];
  isActive: boolean;
  order: number;
}

export interface SiteConfig {
  siteName: string;
  url: string;
  language: 'es' | 'en';
  languages: ('es' | 'en')[];
  social: { linkedin: string; website?: string };
  contact: { email: string; address?: string };
  solutions: SolutionConfig[];
  featureFlags: { analytics: boolean; newsletter: boolean; blog: boolean; testimonials: boolean };
}

export interface CaseStudyMetric {
  label: string;
  value: string;
  icon?: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  client: string;
  industry: string;
  serviceSlug: string;
  challenge: string;
  solution: string;
  stack: string[];
  metrics: CaseStudyMetric[];
  testimonial?: { quote: string; author: string; role: string };
  url?: string;
  logo?: string;
  featured: boolean;
  order: number;
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string[];
  status: PostStatus;
  publishAt: string;
  updatedAt: string;
  seo: SolutionSEO;
  blocks: ContentBlock[];
}

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
  serviceInterest?: string;
  website?: string;
}

export interface NewsletterFormPayload {
  email: string;
  website?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data?: T;
}
