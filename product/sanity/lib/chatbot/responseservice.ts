
import { Message,Product } from './types';
import { matchKeywords, getQuickReplies } from './keywordmatch';
import { detectProductType, detectSkinType, fetchProductsByType,
  fetchProductsForSkinType } from './productMatcher';

export interface BotResponse {
  text: string;
  quickReplies?: string[];
products?: Product[];

}
export async function getBotResponse(
  userMessage: string,
  conversationHistory: Message[]
//   Replace with AI api 


): Promise<BotResponse> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const responseText = matchKeywords(userMessage);
  const quickReplies = getQuickReplies(userMessage);

  let products: Product[] = [];
  
  const productType = detectProductType(userMessage);
  if (productType) {
    products = await fetchProductsByType(productType);
  }
  
  const skinType = detectSkinType(userMessage);
  if (skinType && products.length === 0) {
    products = await fetchProductsForSkinType(skinType);
  }
  
  return {
    text: responseText,
    quickReplies: quickReplies.length > 0 ? quickReplies : undefined,
    products: products.length > 0 ? products : undefined,

  };
}