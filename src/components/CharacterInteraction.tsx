
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRound, MessageSquare } from 'lucide-react';

const CharacterInteraction: React.FC = () => {
  const { getCurrentLocation, handleOptionSelect } = useGame();
  const { npcs } = getCurrentLocation();
  const [activeNPC, setActiveNPC] = useState<any | null>(null);

  // Get current dialogue for the active NPC
  const currentDialogue = activeNPC
    ? activeNPC.dialogue.find((d: any) => d.id === activeNPC.currentDialogueId)
    : null;

  // Talk to an NPC
  const startConversation = (npc: any) => {
    setActiveNPC({
      ...npc,
      currentDialogueId: npc.dialogue[0].id
    });
  };

  // Handle selecting a dialogue option
  const selectOption = (option: any) => {
    handleOptionSelect(option);
    
    if (option.nextDialogueId) {
      setActiveNPC({
        ...activeNPC,
        currentDialogueId: option.nextDialogueId
      });
    } else {
      // End conversation if no next dialogue
      setActiveNPC(null);
    }
  };

  return (
    <Card className="bg-secondary/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserRound className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="title-text">Characters</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {npcs.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No characters to interact with in this location.
          </div>
        ) : !activeNPC ? (
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {npcs.map((npc) => (
                <div 
                  key={npc.id} 
                  className="bg-secondary/70 rounded-md p-3 border border-primary/20"
                >
                  <h3 className="font-semibold mb-1">{npc.name}</h3>
                  <p className="text-sm text-foreground/80 mb-3">{npc.description}</p>
                  <div className="flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => startConversation(npc)}
                      className="text-xs h-7"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Talk
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : currentDialogue ? (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary/30 flex items-center justify-center">
                <UserRound className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{activeNPC.name}</h3>
            </div>
            
            <div className="bg-secondary/70 rounded-md p-3 border border-primary/20 mb-4">
              <p className="text-sm">{currentDialogue.text}</p>
            </div>
            
            {currentDialogue.responseOptions && currentDialogue.responseOptions.length > 0 ? (
              <div className="space-y-2">
                {currentDialogue.responseOptions.map((option: any) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    onClick={() => selectOption(option)}
                    className="w-full justify-start text-left text-sm h-auto py-2"
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            ) : (
              <Button
                onClick={() => setActiveNPC(null)}
                className="w-full"
              >
                End conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center p-4">
            <Button onClick={() => setActiveNPC(null)}>Back</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterInteraction;
