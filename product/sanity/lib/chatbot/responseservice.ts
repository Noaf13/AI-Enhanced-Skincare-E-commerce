import { Message, Product } from './types';

/**
 * @interface BotResponse
 * shape of what getBotResponse returns to the chat widget
 * products and quickReplies are optional - not every response will have them
 */
export interface BotResponse {
  text: string;
  quickReplies?: string[];
  products?: Product[];
}

/**
 * getQuickReplies
 *
 * generates quick reply buttons based on what the user said.
 * keeps things client side so we dont need an extra api call just for buttons
 *
 * @param {string} message - the users message
 * @returns {string[]} array of quick reply labels, empty if nothing matched
 */
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

/**
 * getBotResponse
 *
 * sends the users message to /api/chat and returns the response.
 * quick replies are generated client side from the original message
 * rather than coming back from the api
 *
 * @async
 * @param {string} userMessage - message the user typed
 * @param {Message[]} _conversationHistory - not used yet, kept for future context passing
 * @returns {Promise<BotResponse>} ai text + optional products and quick replies
 *
 * @example
 * const response = await getBotResponse("recommend a serum", [])
 * // { text: "...", products: [...], quickReplies: ["Show cleansers", ...] }
 */
export async function getBotResponse(
  userMessage: string,
  _conversationHistory: Message[]
): Promise<BotResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, }),
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