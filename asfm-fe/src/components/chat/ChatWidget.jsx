import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatPanel from './ChatPanel';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatPanel />}

      <Button
        type="button"
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full border-2 border-white/80 bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(6,61,48,0.35)] transition-transform hover:scale-[1.04] active:scale-[0.98] sm:bottom-6 sm:right-6"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Button>
    </>
  );
}
