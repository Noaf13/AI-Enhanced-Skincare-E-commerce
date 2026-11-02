"use client";

import { Message } from '@/sanity/lib/chatbot/types';
import { useEffect, useRef } from 'react';
import ProductCard from './ProductResponse';

/**
 * @interface Props
 * @property {Message[]} messages - full message history to render
 * @property {boolean} isTyping - shows the bouncing dots when true
 * @property {function} onQuickReply - fired when user clicks a quick reply button
 */
interface Props {
  messages: Message[]
  isTyping: boolean
  onQuickReply: (text: string) => void
}

/**
 * MessageList
 *
 * renders the chat message history inside the widget.
 * auto scrolls to the bottom whenever a new message is added or typing starts.
 * handles user messages, bot messages, product cards and quick reply buttons
 *
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function MessageList({ messages, isTyping, onQuickReply }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // scroll to bottom whenever messages update or typing indicator changes
    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>Hi I am the GLOWSKIN assistant how can I help you?</p>
        </div>
      ) : (
        messages.map((message) => {
        const isUser = message.sender === 'user'
          return (
        
        <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className="flex flex-col gap-2 max-w-[80%]">
                <div className={`rounded-lg px-4 py-2 ${isUser ? 'bg-[#90af9f] text-white' : 'bg-gray-100 text-gray-900'}`}>
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'})}
                  </span>
                </div>

                  {/* show product cards if bot returned any */}
                  {!isUser && message.products && message.products.length > 0 && (
                  <div className="flex flex-col gap-2">
                      {message.products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                  </div>
                )}

                {/* quick reply buttons below bot messages */}
                {!isUser && message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                    {message.quickReplies.map((reply) => (
                      <button key={reply}
                        onClick={() => onQuickReply(reply)}
                        className="text-xs border border-[#90af9f] text-[#90af9f] rounded-full px-3 py-1 hover:bg-[#90af9f] hover:text-white transition-colors">
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}

    
      <div ref={messagesEndRef} />
    </div>
  )
}