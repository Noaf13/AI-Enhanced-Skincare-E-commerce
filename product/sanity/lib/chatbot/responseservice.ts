
import { Message } from './types';
import { matchKeywords, getQuickReplies } from './keywordmatch';

export interface BotResponse {
  text: string;
  quickReplies?: string[];
}
export async function getBotResponse(
  userMessage: string,
  conversationHistory: Message[]
//   Replace with AI api 
): Promise<BotResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const responseText = matchKeywords(userMessage);
  const quickReplies = getQuickReplies(userMessage);
  
  return {
    text: responseText,
    quickReplies: quickReplies.length > 0 ? quickReplies : undefined
  };
}