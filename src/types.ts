export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  image?: string; // Base64 data URL
  imageName?: string;
  isEmergencyAlert?: boolean;
  category?: 'general' | 'medicine' | 'report' | 'nutrition' | 'emergency' | 'content' | 'symptom';
  suggestedFollowUps?: string[];
}

export type LanguageMode = 'hinglish' | 'hindi' | 'english';

export interface ContentStudioRequest {
  topic: string;
  contentType: 'reel_script' | 'shorts_script' | 'caption_hashtags' | 'hooks_ideas' | 'myth_fact' | 'image_prompt';
  targetAudience: string;
  language: 'hinglish' | 'hindi' | 'english';
  duration?: '30s' | '60s' | '90s';
}

export interface ContentStudioResult {
  title: string;
  script?: string;
  visualCues?: string[];
  hookOptions?: string[];
  caption?: string;
  hashtags?: string[];
  imagePrompt?: string;
  seoTags?: string[];
}

export interface LabTestReference {
  name: string;
  category: string;
  normalRange: string;
  unit: string;
  simpleExplanation: string;
  whenHigh: string;
  whenLow: string;
}
