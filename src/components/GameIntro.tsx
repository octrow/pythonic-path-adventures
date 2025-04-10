
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Code, BookOpen, Sparkles } from 'lucide-react';

const GameIntro: React.FC = () => {
  const { startGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleStart = () => {
    if (playerName.trim()) {
      startGame(playerName);
    } else {
      setPlayerName('Anonymous Pythonista');
      startGame('Anonymous Pythonista');
    }
  };

  if (isReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-medieval text-primary glow mb-6">The Pythonic Path</h1>
        
        <div className="mb-8 space-y-4">
          <p className="text-lg">
            Welcome, <span className="text-primary font-semibold">{playerName || 'Pythonista'}</span>!
          </p>
          
          <p>
            You stand at the entrance of the legendary Python Academy, where code and magic intertwine. 
            As an aspiring Pythonista, you seek to master the elegant and powerful ways of Python as chronicled 
            in the sacred tome 'Fluent Python'.
          </p>
          
          <p>
            Your journey will take you through realms of Data Structures, Function Groves, 
            Class Hierarchies, and eventually to the arcane heights of Metaprogramming.
          </p>
        </div>
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 flex flex-col items-center">
            <Code className="h-10 w-10 text-cyan-400 mb-2" />
            <h3 className="font-semibold mb-1">Master Python Concepts</h3>
            <p className="text-sm text-foreground/80 text-center">Learn and practice with interactive challenges</p>
          </div>
          
          <div className="bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 flex flex-col items-center">
            <BookOpen className="h-10 w-10 text-yellow-400 mb-2" />
            <h3 className="font-semibold mb-1">Explore the Lore</h3>
            <p className="text-sm text-foreground/80 text-center">Discover the wisdom of Fluent Python</p>
          </div>
          
          <div className="bg-secondary/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 flex flex-col items-center">
            <Sparkles className="h-10 w-10 text-purple-400 mb-2" />
            <h3 className="font-semibold mb-1">Cast Python Spells</h3>
            <p className="text-sm text-foreground/80 text-center">Unlock powerful code techniques</p>
          </div>
        </div>
        
        <Button 
          onClick={handleStart} 
          className="bg-primary hover:bg-primary/80 text-lg py-6 px-8"
        >
          Begin Your Journey
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center max-w-xl mx-auto">
      <h1 className="text-5xl font-medieval text-primary glow mb-2">The Pythonic Path</h1>
      <h2 className="text-xl mb-8">A Fluent Python Adventure</h2>
      
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30"></div>
        <div className="bg-secondary/50 backdrop-blur-sm relative border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-medieval mb-6">Create Your Character</h3>
          
          <div className="mb-6">
            <Label htmlFor="playerName" className="block text-left mb-2">
              Your Name, Pythonista:
            </Label>
            <Input
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="bg-secondary/70 border-primary/30"
              placeholder="Enter your name"
            />
          </div>
          
          <Button 
            onClick={() => setIsReady(true)} 
            className="w-full bg-primary hover:bg-primary/80"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
