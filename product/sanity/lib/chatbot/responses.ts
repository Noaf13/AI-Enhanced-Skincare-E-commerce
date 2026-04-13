/**
 * @interface ResponseRule
 * defines the shape of a single rule in the responseRules array
 * keywords are what the user has to say, responses is what the bot replies
 * quickReplies are optional buttons shown below the response
 */
export interface ResponseRule {
  keywords: string[];
  responses: string[];
  category: string;
  quickReplies?: string[];
}

/**
 * responseRules
 *
 * list of keyword rules for the phase 1 rule based chatbot.
 * each rule has a category, keywords to match on, and possible responses.
 * matchKeywords picks a random response from the matched rule so it
 * doesnt always say the same thing
 *
 * note: this is only used as a fallback now - phase 2 uses groq instead
 */
export const responseRules: ResponseRule[] = [
  { category: 'intro',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hi Welcome to GLOWSKIN. How can I help you today?",
      "Hi I'm here to help you find the perfect skincare products. What are you looking for?",
      "Ready to discover the best skincare routine?"
    ],
    quickReplies: ['Show products', 'Shipping info', 'Skin types']
  },
  
  {
    category: 'products',
    keywords: ['products', 'what do you sell', 'what do you have', 'catalog', 'shop'],
    responses: [
      "We offer cleansers, serums, moisturizers, and toners for all skin types, What type of product are you looking for?",
      "Our collection has cleansers, serums, moisturizers, and toners. Which would you like to explore?"
    ],
    quickReplies: ['Cleansers', 'Serums', 'Moisturizers', 'Toners']
  },
  
  
  {
    category: 'skinType',
    keywords: ['oily skin', 'dry skin', 'combination', 'sensitive skin', 'acne', 'wrinkles'],
    responses: [
      "I can help you find products for your skin type! Tell me more about your skin concerns.",
      "Every skin type needs different care. What's your main skin concern?"
    ],
    quickReplies: ['Oily skin', 'Dry skin', 'Sensitive', 'Anti-aging']
  },
  
  
  {
    category: 'thanks',
    keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
    responses: [
      "No problem is there anything else I can help you with?",
      
    ]
  }
];

// shown when nothing in the rules matched - shouldnt really show in phase 2 since groq handles it
export const fallbackResponse = "I can only help with skincare questions!";