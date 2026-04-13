"use client";

import { useState } from 'react';

/**
 * @interface Props
 * @property {function} onSend - callback fired when the user submits a message
 */
interface Props {
  onSend: (text: string) => void;
}

/**
 * ChatInput
 *
 * text input at the bottom of the chat widget.
 * user can send by clicking the button or pressing enter
 * ignores empty/whitespace messages
 *
 * @param {Props} props
 * @returns {JSX.Element}
 */
export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return; // dont send empty messages
    onSend(input.trim());
    setInput('');
  };

  // lets user send with enter key instead of clicking the button
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className=" text-gray-950 flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ]"/>
      <button
        onClick={handleSubmit}
        className="bg-[#90af9f] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#7a9a8a] transition-colors"
      >
        Send
      </button>
    </div>
  );
}