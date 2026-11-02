'use client';

import { FaCommentDots } from 'react-icons/fa';

/**
 * floating chat button fixed to the bottom right of the screen
 * clicking it toggles the chat widget open/closed
 *
 * @param {{ onClick: () => void }} props
 */
export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 bg-[#90af9f] rounded-full shadow-lg hover:bg-[#7a9a8a] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
    >
      <FaCommentDots className="w-8 h-8 text-white" />
    </button>
  );
}