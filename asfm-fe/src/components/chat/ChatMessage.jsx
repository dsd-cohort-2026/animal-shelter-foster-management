export default function ChatMessage({ message }) {
  const isUser = message?.role === 'user';
  const senderLabel = isUser ? 'You' : 'ShelterSync';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[86%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words shadow-sm ${
          isUser
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md border border-secondary/50 bg-white text-foreground'
        }`}
      >
        <p
          className={`mb-1 text-[11px] font-semibold tracking-wide ${
            isUser ? 'text-primary-foreground/75' : 'text-muted-foreground'
          }`}
        >
          {senderLabel}
        </p>
        {message?.content || ''}
      </div>
    </div>
  );
}
