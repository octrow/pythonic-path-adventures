
import React from 'react';
import { GameProvider } from '@/context/GameContext';
import { useGame } from '@/context/GameContext';
import GameTerminal from '@/components/GameTerminal';
import CommandInput from '@/components/CommandInput';
import PlayerInfo from '@/components/PlayerInfo';
import ChallengePanel from '@/components/ChallengePanel';
import CharacterInteraction from '@/components/CharacterInteraction';
import GameIntro from '@/components/GameIntro';
import ActionButtons from '@/components/ActionButtons';

const GameContent: React.FC = () => {
  const { gameStarted } = useGame();
  
  if (!gameStarted) {
    return <GameIntro />;
  }
  
  return (
    <div className="game-container">
      <h1 className="text-3xl font-medieval text-center text-primary glow mb-4">
        The Pythonic Path
      </h1>
      
      <PlayerInfo />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <GameTerminal />
          <ActionButtons />
          <CommandInput />
        </div>
        
        <div className="space-y-4">
          <ChallengePanel />
          <CharacterInteraction />
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
