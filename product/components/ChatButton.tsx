'use client';

import { FaCommentDots } from 'react-icons/fa'; 

export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 bg-[#90af9f] rounded-full shadow-lg hover:bg-[#7a9a8a] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      aria-label="Open chat"
    >
      <FaCommentDots className="w-8 h-8 text-white" />
    </button>
  );
}