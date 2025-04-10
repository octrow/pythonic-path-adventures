
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Heart, Scroll } from 'lucide-react';

const PlayerInfo: React.FC = () => {
  const { state } = useGame();
  const { player } = state;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {/* Character Card */}
      <Card className="bg-secondary/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="title-text text-lg">{player.name || "Unnamed Pythonista"}</span>
            <span className="flex items-center bg-primary/20 px-2 py-1 rounded-md text-sm">
              <Sparkles className="h-3 w-3 mr-1 text-yellow-400" />
              Level {player.stats.level}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Health Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="flex items-center">
                <Heart className="h-3 w-3 mr-1 text-red-500" />
                Health
              </span>
              <span>{player.stats.health}/{player.stats.maxHealth}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="hp-bar"
                style={{ width: `${(player.stats.health / player.stats.maxHealth) * 100}%` }}
              />
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1 text-blue-500" />
                Experience
              </span>
              <span>{player.stats.xp}/{player.stats.xpToNextLevel}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="xp-bar"
                style={{ width: `${(player.stats.xp / player.stats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>

          {/* Insight Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="flex items-center">
                <Brain className="h-3 w-3 mr-1 text-purple-500" />
                Insight
              </span>
              <span>{player.stats.insight}</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="insight-bar"
                style={{ width: `${Math.min((player.stats.insight / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mastery Card */}
      <Card className="bg-secondary/50 backdrop-blur-sm border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Scroll className="h-4 w-4 mr-2 text-accent" />
            <span className="title-text text-lg">Python Mastery</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span>Data Structures</span>
              <span>{player.stats.pythonMastery.dataStructures}/10</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full">
              <div 
                className="bg-cyan-500 h-1.5 rounded-full" 
                style={{ width: `${(player.stats.pythonMastery.dataStructures / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Functions</span>
              <span>{player.stats.pythonMastery.functions}/10</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${(player.stats.pythonMastery.functions / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Classes</span>
              <span>{player.stats.pythonMastery.classes}/10</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full">
              <div 
                className="bg-yellow-500 h-1.5 rounded-full" 
                style={{ width: `${(player.stats.pythonMastery.classes / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Control Flow</span>
              <span>{player.stats.pythonMastery.controlFlow}/10</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full">
              <div 
                className="bg-orange-500 h-1.5 rounded-full" 
                style={{ width: `${(player.stats.pythonMastery.controlFlow / 10) * 100}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Metaprogramming</span>
              <span>{player.stats.pythonMastery.metaprogramming}/10</span>
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full">
              <div 
                className="bg-purple-500 h-1.5 rounded-full" 
                style={{ width: `${(player.stats.pythonMastery.metaprogramming / 10) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerInfo;
