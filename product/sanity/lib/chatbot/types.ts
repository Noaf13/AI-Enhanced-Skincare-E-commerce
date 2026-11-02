/**
 * @interface Message
 * shape of a single message in the chat widget
 * products and quickReplies are optional - only bot messages will have them
 */
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
  quickReplies?: string[];
  //takes message from chatbot 
}

/**
 * @interface ChatState
 * tracks the overall state of the chat widget
 * not currently used directly but kept for reference
 */
export interface ChatState {
  isOpen: boolean;
  isTyping: boolean;
  messages: Message[];
  //monitor whats the chatbot is doing
  
}

/**
 * @interface Product
 * trimmed down product shape used inside chat responses
 * only the fields we need to show the product card in the chat
 */
export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug: { current: string };
}