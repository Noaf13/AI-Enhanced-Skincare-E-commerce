"use client";
import { useState } from 'react';
import ChatButton from './ChatButton';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '@/sanity/lib/chatbot/types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "response",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);}, 700);
      //added 700 delay to make it simulate response time 
    //bot simulation ^ 
  };

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)} />
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          <div className="p-4 bg-[#90af9f] text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">GLOWSKIN Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-red-600"
            >
              ✕
            </button>
          </div>
          
          <ChatMessage messages={messages} />
          <ChatInput onSend={handleSendMessage} />
        </div>
      )}
    </>
  );
}