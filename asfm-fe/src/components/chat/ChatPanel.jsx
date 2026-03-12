import { useEffect, useRef, useState } from 'react';
import { CircleHelp, SendHorizontal } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '@/services/chatService';
import { useBoundStore } from '@/store';
import logo from '@/assets/logo.png';

const MAX_MESSAGES = 20;
const AUTH_WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm your ShelterSync assistant. Ask me about animals, medical logs, or supplies.",
};
const GUEST_WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi! I'm your ShelterSync assistant. In guest mode I can answer app info and FAQs. Sign in to ask about live shelter data.",
};
const LOG_PREFIX = '[ChatPanel]';

export default function ChatPanel() {
  const session = useBoundStore((state) => state.session);
  const user = useBoundStore((state) => state.user);
  const userRole = useBoundStore((state) => state.userRole);
  const isGuest = !session && !user;
  const normalizedRole =
    typeof userRole === 'string'
      ? userRole.toUpperCase()
      : typeof user?.role === 'string'
        ? user.role.toUpperCase()
        : null;
  const roleLabel = normalizedRole === 'STAFF' ? 'Staff' : 'Foster';
  const roleBadgeLabel = isGuest ? 'Guest' : `Signed in as ${roleLabel}`;

  const [messages, setMessages] = useState(() => [
    isGuest ? GUEST_WELCOME_MESSAGE : AUTH_WELCOME_MESSAGE,
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isLoading) return;

    const userMessage = { role: 'user', content };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);
    console.log(`${LOG_PREFIX} Sending chat request.`, {
      messageCount: nextMessages.length,
      outgoingCount: nextMessages.slice(-MAX_MESSAGES).length,
      isGuest,
      role: user?.role,
    });

    try {
      const reply = await sendChatMessage(nextMessages.slice(-MAX_MESSAGES));
      if (typeof reply === 'string' && reply.includes("Sorry, I'm having trouble right now")) {
        console.error(`${LOG_PREFIX} Backend returned friendly fallback response.`, { reply });
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            typeof reply === 'string' && reply.trim()
              ? reply.trim()
              : 'I could not generate a response. Please try again.',
        },
      ]);
    } catch (error) {
      console.error(`${LOG_PREFIX} Chat request failed.`, {
        message: error?.message,
        status: error?.response?.status,
        response: error?.response?.data,
      });
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSend();
  };

  return (
    <Card className="fixed bottom-24 left-2 right-2 z-50 flex h-[min(32rem,calc(100dvh-7.5rem))] flex-col gap-0 overflow-hidden rounded-3xl border border-secondary/60 bg-card/95 py-0 shadow-xl backdrop-blur-sm sm:bottom-20 sm:left-auto sm:right-6 sm:w-96">
      <CardHeader className="bg-gradient-to-r from-secondary/40 via-accent/30 to-transparent px-4 py-0 [&&]:grid-rows-[auto] [&&]:gap-0">
        <div className="flex items-center justify-between gap-3 border-b border-secondary/40 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white shadow-sm">
              <img src={logo} alt="ShelterSync logo" className="h-7 w-7 object-contain" loading="lazy" />
            </div>
            <div className="leading-tight">
              <CardTitle className="text-sm font-semibold">ShelterSync Assistant</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                {isGuest ? 'Guest mode: app FAQs only' : 'Live shelter data assistant'}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-primary">
            {roleBadgeLabel}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 space-y-2 overflow-y-auto bg-gradient-to-b from-secondary/15 to-transparent p-3">
        {messages.map((message, index) => (
          <ChatMessage key={`${message.role}-${index}`} message={message} />
        ))}

        {isLoading && (
          <div className="flex items-center justify-start gap-2 px-1">
            <Spinner className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </CardContent>

      <CardFooter className="border-t border-secondary/40 bg-white/80 p-3">
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={isGuest ? 'Ask about app features or FAQs...' : 'Ask about ShelterSync data...'}
            disabled={isLoading}
            maxLength={500}
            className="h-11 rounded-full border-secondary/60 bg-white"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || input.trim().length === 0}
            className="h-11 w-11 rounded-full"
          >
            {isGuest ? <CircleHelp /> : <SendHorizontal />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
