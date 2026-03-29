
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  products?: Product[];
  quickReplies?: string[];
  //takes message from chatbot 
}


export interface ChatState {
  isOpen: boolean;
  isTyping: boolean;
  messages: Message[];
  //monitor whats the chatbot is doing
  
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug: { current: string };
}