export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '16:9' | '9:16';

export interface LogoFormState {
  companyName: string;
  tagline: string;
  industry: string;
  description: string;
  style: string;
  colorPalette: string;
  customColors: string;
  imageSize: ImageSize;
  symbolType: string;
  additionalPrompt: string;
}

export interface GeneratedVideo {
  id: string;
  videoUrl: string;
  operationName: string;
  prompt: string;
  aspectRatio: AspectRatio;
  createdAt: number;
}

export interface GeneratedLogo {
  id: string;
  companyName: string;
  tagline?: string;
  industry?: string;
  style?: string;
  imageUrl: string;
  promptUsed: string;
  size: ImageSize;
  createdAt: number;
  videos: GeneratedVideo[];
}

export interface ConceptSuggestion {
  title: string;
  tagline: string;
  symbolMetaphor: string;
  recommendedStyle: string;
  colorTheme: string;
  promptAddition: string;
  animationIdea: string;
}

export interface MotionPreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  iconName: string;
}
