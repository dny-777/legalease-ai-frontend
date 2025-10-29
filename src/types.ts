export interface AnalyzedData {
  raw: string;
  simplified: string;
  translated: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}