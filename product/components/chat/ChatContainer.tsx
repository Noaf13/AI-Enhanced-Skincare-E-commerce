/**
 * Chat Widget Component
 *
 * Floating chat widget that renders the GLOWSKIN AI assistant.
 * Manages open/close state, message history and the typing indicator.
 * Calls getBotResponse which hits the /api/chat route with the users message.
 *
 * @component
 * @returns {JSX.Element} chat button + expandable chat window
 *
 * @dependencies
 * - ChatButton: the floating button that toggles the widget
 * - ChatMessage: renders the message list and typing indicator
 * - ChatInput: the text input at the bottom
 * - getBotResponse: sends message to groq and returns ai response
 */
"use client";

import { useState } from 'react';
import ChatButton from './ChatButton';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '@/sanity/lib/chatbot/types';
import { getBotResponse } from '@/sanity/lib/chatbot/responseservice';

/**
 * ChatWidget
 * main container for the chat - handles state and message flow
 * disclaimer is pre-loaded so users see it straight away
 *
 * @returns {JSX.Element}
 */
export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

  // first message is a disclaimer so user knows its an AI not a real person
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "disclaimer",
      text: "Just so you know - I'm an AI assistant and cant provide medical advice. For skin conditions always see a dermatologist. Happy to help with general skincare and product questions though!",
      sender: "bot",
      timestamp: new Date(),
      quickReplies: ["Show products", "Skin types", "Shipping info"],
    }
  ]);

  /**
   * adds the users message to state, shows typing indicator
   * then calls the api and appends the bot response
   *
   * @async
   * @param {string} text - message the user sent
   */
  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

   try {
      const botResponse = await getBotResponse(text, messages);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: botResponse.quickReplies,
        products: botResponse.products,
      };

      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false); // turn off typing indicator whether it worked or not
    }
  };

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)} />

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* header */}
          <div className="p-4 bg-[#90af9f] text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">GLOWSKIN Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-200 transition">
              ✕
            </button>
          </div>

          <ChatMessage messages={messages} isTyping={isTyping}
            onQuickReply={handleSendMessage}/>
          <ChatInput onSend={handleSendMessage} />
        </div>
      )}
    </>
  );
}