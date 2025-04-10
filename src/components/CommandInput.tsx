
import React, { useState, KeyboardEvent } from 'react';
import { useGame } from '@/context/GameContext';
import { ArrowUp, ArrowDown, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CommandInput: React.FC = () => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { handleCommand } = useGame();

  // Handle command submission
  const submitCommand = () => {
    if (command.trim()) {
      handleCommand(command);
      setCommandHistory(prev => [command, ...prev.slice(0, 19)]); // Keep last 20 commands
      setCommand('');
      setHistoryIndex(-1);
    }
  };

  // Handle keyboard events for command history and submission
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  return (
    <div className="mt-4 relative flex">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        &gt;
      </div>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
        className="command-input pl-7"
        placeholder="Enter a command..."
        aria-label="Command input"
      />
      <div className="flex ml-2 space-x-1">
        <Button 
          size="icon" 
          variant="outline" 
          className="h-10 w-10"
          onClick={() => {
            if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
              const newIndex = historyIndex + 1;
              setHistoryIndex(newIndex);
              setCommand(commandHistory[newIndex]);
            }
          }}
          disabled={commandHistory.length === 0 || historyIndex >= commandHistory.length - 1}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-10 w-10"
          onClick={() => {
            if (historyIndex > 0) {
              const newIndex = historyIndex - 1;
              setHistoryIndex(newIndex);
              setCommand(commandHistory[newIndex]);
            } else if (historyIndex === 0) {
              setHistoryIndex(-1);
              setCommand('');
            }
          }}
          disabled={historyIndex <= -1}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          onClick={submitCommand}
          className="bg-primary hover:bg-primary/80"
        >
          <SendHorizonal className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default CommandInput;
