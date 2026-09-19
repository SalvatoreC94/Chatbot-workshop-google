export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  cta?: 'calendly' | 'whatsapp' | 'both' | null;
}
