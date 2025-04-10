
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sword, Award, Lightbulb } from 'lucide-react';

const ChallengePanel: React.FC = () => {
  const { getCurrentLocation, handleAnswerSubmit } = useGame();
  const { challenges } = getCurrentLocation();
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Get the currently active challenge
  const challenge = challenges.find(c => c.id === activeChallenge);

  // Handle starting a challenge
  const startChallenge = (challengeId: string) => {
    setActiveChallenge(challengeId);
    setSelectedAnswer(null);
  };

  // Handle submitting an answer
  const submitAnswer = () => {
    if (challenge && selectedAnswer) {
      handleAnswerSubmit(challenge, selectedAnswer);
      setActiveChallenge(null);
      setSelectedAnswer(null);
    }
  };

  return (
    <Card className="bg-secondary/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sword className="h-5 w-5 mr-2 text-red-400" />
          <span className="title-text">Challenges</span>
        </CardTitle>
        <CardDescription>
          Test your Pythonic knowledge
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {challenges.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No challenges available in this location.
          </div>
        ) : !challenge ? (
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {challenges.map(c => (
                <div key={c.id} className="bg-secondary/70 rounded-md p-3 border border-primary/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{c.name}</h3>
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      c.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      c.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {c.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 mb-3">{c.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-3 text-xs">
                      <span className="flex items-center">
                        <Award className="h-3 w-3 mr-1 text-blue-400" />
                        {c.xpReward} XP
                      </span>
                      <span className="flex items-center">
                        <Lightbulb className="h-3 w-3 mr-1 text-purple-400" />
                        {c.insightReward} Insight
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => startChallenge(c.id)}
                      className="text-xs h-7"
                    >
                      Begin
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="pb-2">
            <div className="mb-4">
              <h3 className="font-semibold title-text text-lg mb-2">{challenge.name}</h3>
              <p className="text-sm mb-4">{challenge.description}</p>
              
              {challenge.type === 'multiple-choice' && (
                <div>
                  <p className="font-semibold mb-3 text-cyan-400">{challenge.question}</p>
                  
                  <RadioGroup 
                    value={selectedAnswer || ""}
                    onValueChange={setSelectedAnswer}
                    className="space-y-3"
                  >
                    {challenge.choices?.map((choice) => (
                      <div 
                        key={choice.id}
                        className="flex items-center space-x-2 bg-secondary/70 p-2 rounded-md border border-primary/10"
                      >
                        <RadioGroupItem value={choice.id} id={choice.id} />
                        <Label htmlFor={choice.id} className="flex-1 cursor-pointer">
                          {choice.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              {challenge.type === 'code-completion' && (
                <div>
                  <pre className="text-code code-text p-3 mb-4 text-sm max-h-[200px] overflow-auto">
                    {challenge.codeTemplate}
                  </pre>
                  
                  <div className="mb-2">
                    <Label htmlFor="solution" className="text-sm block mb-1">
                      Your solution:
                    </Label>
                    <textarea 
                      id="solution"
                      className="w-full bg-secondary/70 text-green-400 code-text p-2 rounded border border-primary/20 focus:outline-none focus:border-primary/60"
                      rows={3}
                      placeholder="Write your solution here..."
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {challenge ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setActiveChallenge(null)}
              className="w-1/3"
            >
              Cancel
            </Button>
            <Button 
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="w-2/3 ml-2 bg-primary hover:bg-primary/80"
            >
              Submit
            </Button>
          </>
        ) : (
          <div className="w-full text-center text-xs text-muted-foreground">
            Select a challenge to begin
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChallengePanel;
