
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { 
  Search, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
  Clipboard, User, BookOpen, ScrollText, Wand2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ActionButtons: React.FC = () => {
  const { getCurrentLocation, handleCommand } = useGame();
  const { location } = getCurrentLocation();

  // Basic commands that are always available
  const basicCommands = [
    { label: 'Look', command: 'look', icon: <Search className="h-4 w-4" /> },
    { label: 'Status', command: 'status', icon: <User className="h-4 w-4" /> },
    { label: 'Inventory', command: 'inventory', icon: <Clipboard className="h-4 w-4" /> },
    { label: 'Concepts', command: 'concepts', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Help', command: 'help', icon: <ScrollText className="h-4 w-4" /> },
  ];

  // Generate movement commands based on available connections
  const movementCommands = location.connections.map(conn => {
    let icon;
    switch (conn.direction.toLowerCase()) {
      case 'north': icon = <ArrowUp className="h-4 w-4" />; break;
      case 'south': icon = <ArrowDown className="h-4 w-4" />; break;
      case 'east': icon = <ArrowRight className="h-4 w-4" />; break;
      case 'west': icon = <ArrowLeft className="h-4 w-4" />; break;
      default: icon = null;
    }
    
    return {
      label: `Go ${conn.direction}`,
      command: `go ${conn.direction}`,
      icon,
      tooltip: conn.description || `Travel ${conn.direction}`
    };
  });

  // Generate spell commands if the player has any spells
  const { state } = useGame();
  const spellCommands = state.player.inventory.spells
    .filter(spell => spell.unlocked)
    .map(spell => ({
      label: spell.name,
      command: `cast ${spell.id}`,
      icon: <Wand2 className="h-4 w-4" />,
      tooltip: spell.description
    }));

  // Handle button click
  const executeCommand = (command: string) => {
    handleCommand(command);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2 text-primary">Available Actions:</h3>
      <ScrollArea className="pb-2">
        <div className="flex flex-wrap gap-2">
          {/* Movement commands */}
          {movementCommands.map((cmd, index) => (
            <Button
              key={`move-${index}`}
              size="sm"
              variant="outline"
              className="flex items-center"
              title={cmd.tooltip}
              onClick={() => executeCommand(cmd.command)}
            >
              {cmd.icon}
              <span className="ml-1">{cmd.label}</span>
            </Button>
          ))}
          
          {/* Basic commands */}
          {basicCommands.map((cmd, index) => (
            <Button
              key={`basic-${index}`}
              size="sm"
              variant="outline"
              className="flex items-center"
              onClick={() => executeCommand(cmd.command)}
            >
              {cmd.icon}
              <span className="ml-1">{cmd.label}</span>
            </Button>
          ))}
          
          {/* Spell commands */}
          {spellCommands.length > 0 && (
            <>
              {spellCommands.map((cmd, index) => (
                <Button
                  key={`spell-${index}`}
                  size="sm"
                  variant="secondary"
                  className="flex items-center bg-purple-900/30"
                  title={cmd.tooltip}
                  onClick={() => executeCommand(cmd.command)}
                >
                  {cmd.icon}
                  <span className="ml-1">{cmd.label}</span>
                </Button>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ActionButtons;
