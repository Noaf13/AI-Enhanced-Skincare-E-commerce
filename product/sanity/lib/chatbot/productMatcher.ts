// lib/chatbot/productMatcher.ts

import { client } from '@/sanity/lib/client';
import { Product } from './types';

// Common product keywords
const PRODUCT_KEYWORDS = {
  cleanser: ['cleanser', 'cleansing', 'clean', 'wash', 'face wash'],
  serum: ['serum', 'essence', 'treatment'],
  moisturizer: ['moisturizer', 'moisturise', 'cream', 'lotion', 'hydrating cream'],
  toner: ['toner', 'toning', 'astringent'],
};

const SKIN_TYPE_KEYWORDS = {
  oily: ['oily', 'oily skin', 'oil control', 'shine'],
  dry: ['dry', 'dry skin', 'dehydrated', 'flaky'],
  sensitive: ['sensitive', 'sensitive skin', 'gentle', 'irritated'],
  combination: ['combination', 'combination skin', 'mixed'],
};

export function detectProductType(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type;
    }
  }
  
  return null;
}

export function detectSkinType(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SKIN_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type;
    }
  }
  
  return null;
}

export async function fetchProductsByType(productType: string): Promise<Product[]> {
  try {
    const products = await client.fetch(
      `*[_type == "product" && category->name match $productType][0...3] {
        _id,
        name,
        price,
        "image": image.asset->url,
        slug
      }`,
      { productType }
    );
    
    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductsForSkinType(skinType: string): Promise<Product[]> {
  try {
    const products = await client.fetch(
      `*[_type == "product" && $skinType in skinType][0...3] {
        _id,
        name,
        price,
        "image": image.asset->url,
        slug
      }`,
      { skinType }
    );
    
    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}