'use client';

import { FaCommentDots } from 'react-icons/fa'; 

export default function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 w-14 h-14 bg-[#90af9f] rounded-full shadow-lg hover:bg-[#7a9a8a] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
      aria-label="Open chat"
    >
      <FaCommentDots className="w-8 h-8 text-white" />
    </button>
  );
}