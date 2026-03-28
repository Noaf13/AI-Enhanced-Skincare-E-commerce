// components/chat/ChatWidget.tsx
"use client";

import { useState } from 'react';
import ChatButton from './ChatButton';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatButton onClick={() => setIsOpen(!isOpen)} />
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50">
          <div className="p-4 bg-[#90af9f] text-white rounded-t-lg">
            <h3 className="font-semibold">GLOWSKIN Assistant</h3>
          </div>
          <div className="p-5">
            <p className="text-gray-500"> text</p>
          </div>
        </div>
      )}
    </>
  );
}