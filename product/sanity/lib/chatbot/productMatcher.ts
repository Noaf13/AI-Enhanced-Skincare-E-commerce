// lib/chatbot/productMatcher.ts

import { client } from '@/sanity/lib/client';
import { Product } from './types';

// keywords that map to product categories in sanity
const PRODUCT_KEYWORDS = {
  cleanser: ['cleanser', 'cleansing', 'clean', 'wash', 'face wash'],
  serum: ['serum', 'essence', 'treatment'],
  moisturizer: ['moisturizer', 'moisturise', 'cream', 'lotion', 'hydrating cream'],
  toner: ['toner', 'toning', 'astringent'],
};

// keywords that map to skin types stored on the product in sanity
const SKIN_TYPE_KEYWORDS = {
  oily: ['oily', 'oily skin', 'oil control', 'shine'],
  dry: ['dry', 'dry skin', 'dehydrated', 'flaky'],
  sensitive: ['sensitive', 'sensitive skin', 'gentle', 'irritated'],
  combination: ['combination', 'combination skin', 'mixed'],
};

/**
 * detectProductType
 * checks the message for product type keywords and returns the matched type
 * returns null if nothing matched - caller handles the fallback
 *
 * @param {string} message
 * @returns {string | null} product type key e.g "serum" or null
 */
export function detectProductType(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type;
    }
  }
  return null;
}

/**
 * detectSkinType
 * same as detectProductType but for skin types
 *
 * @param {string} message
 * @returns {string | null} skin type key e.g "oily" or null
 */
export function detectSkinType(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SKIN_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type;
    }
  }
  
  return null;
}

/**
 * fetchProductsByType
 *
 * fetches up to 3 products from sanity matching the given product type.
 * uses a wildcard match on category name so "Serum" matches "serums" etc
 *
 * @async
 * @param {string} productType - the category to search for
 * @returns {Promise<Product[]>} matched products or empty array on error
 *
 * @example
 * const products = await fetchProductsByType("serum")
 */
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

/**
 * fetchProductsForSkinType
 * same as fetchProductsByType but queries the skinType array field instead
 *
 * @async
 * @param {string} skinType - e.g "oily", "dry", "sensitive"
 * @returns {Promise<Product[]>}
 */
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