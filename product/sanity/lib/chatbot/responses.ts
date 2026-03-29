export interface ResponseRule {
  keywords: string[];
  responses: string[];
  category: string;
  quickReplies?: string[];
}

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

export const fallbackResponse = "cant help.";