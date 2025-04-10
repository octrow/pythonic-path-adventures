
import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

const GameTerminal: React.FC = () => {
  const { messages } = useGame();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (!isScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isScrolling]);

  // Handle manual scrolling
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = Math.abs(
      (target.scrollHeight - target.scrollTop) - target.clientHeight
    ) < 50;
    
    setIsScrolling(!isAtBottom);
  };

  // Render message based on its type
  const renderMessage = (message: any) => {
    switch (message.type) {
      case 'narration':
        if (message.content.startsWith('#')) {
          const headingLevel = message.content.match(/^#+/)[0].length;
          const titleClass = `text-${headingLevel}xl font-bold text-primary glow title-text my-4`;
          const content = message.content.replace(/^#+\s*/, '');
          return <h1 className={titleClass}>{content}</h1>;
        }
        return <p className="text-line text-narrator">{message.content}</p>;
        
      case 'player-input':
        return <p className="text-line code-text text-green-400">{message.content}</p>;
        
      case 'system':
        return <p className="text-line text-slate-300">{message.content}</p>;
        
      case 'combat':
        return <p className="text-line text-red-400 font-semibold">{message.content}</p>;
        
      case 'item':
        return <p className="text-line text-item">{message.content}</p>;
        
      case 'spell':
        return <p className="text-line text-spell">{message.content}</p>;
        
      case 'code':
        return <pre className="text-code code-text p-2">{message.content}</pre>;
        
      case 'error':
        return <p className="text-line text-destructive font-semibold">{message.content}</p>;
        
      case 'success':
        return <p className="text-line text-accent font-semibold">{message.content}</p>;
        
      case 'concept':
        // Process markdown-style formatting for concepts
        const processedContent = message.content
          .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
          .replace(/\*(.*?)\*/g, '<span class="italic">$1</span>')
          .replace(/`(.*?)`/g, '<code class="bg-secondary/70 px-1 py-0.5 rounded text-sm code-text">$1</code>');
          
        return (
          <p 
            className="text-line text-concept" 
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        );
        
      default:
        return <p className="text-line">{message.content}</p>;
    }
  };

  return (
    <div 
      className="text-terminal"
      onScroll={handleScroll}
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground italic">Game messages will appear here...</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <div 
            key={message.id} 
            className={cn(
              "message-container",
              index === messages.length - 1 && "fade-in"
            )}
          >
            {renderMessage(message)}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default GameTerminal;
