"use client";
import { Message } from '@/sanity/lib/chatbot/types';
interface Props {
  messages: Message[];
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>Hi! I am GLOWSKIN assistant how can I help you?</p>
        </div>
      ) : (
        messages.map((message) => {
          const isUser = message.sender === 'user';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isUser
                    ? 'bg-[#90af9f] text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}