import { Message, Product } from './types';

export interface BotResponse {
  text: string;
  quickReplies?: string[];
  products?: Product[];
}

function getQuickReplies(message: string): string[] {
  const lower = message.toLowerCase();

  if (lower.includes('product') || lower.includes('shop') || lower.includes('buy')) {
    return ['Show cleansers', 'Show serums', 'Show moisturizers'];
  }
  if (lower.includes('skin') || lower.includes('routine')) {
    return ['Oily skin', 'Dry skin', 'Sensitive skin'];
  }
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return ['Show products', 'Skin types', 'Shipping info'];
  }
  return [];
}

export async function getBotResponse(
  userMessage: string,
  _conversationHistory: Message[]
): Promise<BotResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    return { text: "Sorry, I'm having trouble connecting. Please try again!" };
  }

  const data = await response.json();

  return {
    text: data.text,
    products: data.products,
    quickReplies: getQuickReplies(userMessage),
  };
}