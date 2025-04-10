import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { GameAction, GameMessage, GameState, MessageType } from "../types/game";
import { concepts, locations, spells } from "../data/gameData";
import { useToast } from "@/components/ui/use-toast";

// Initial game state
const initialState: GameState = {
  player: {
    name: "",
    stats: {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      insight: 0,
      health: 100,
      maxHealth: 100,
      pythonMastery: {
        dataStructures: 0,
        functions: 0,
        classes: 0,
        metaprogramming: 0,
        controlFlow: 0,
      },
    },
    inventory: {
      spells: [],
      items: [],
      conceptsLearned: [],
    },
    currentLocation: "starting_area",
  },
  gameProgress: {
    visitedLocations: ["starting_area"],
    completedChallenges: [],
    activeQuests: [],
    gameStage: "intro",
  },
  settings: {
    textSpeed: "normal",
    soundEnabled: true,
    helpMode: "minimal",
  },
};

// Game reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "MOVE_PLAYER":
      return {
        ...state,
        player: {
          ...state.player,
          currentLocation: action.payload.locationId,
        },
        gameProgress: {
          ...state.gameProgress,
          visitedLocations: state.gameProgress.visitedLocations.includes(action.payload.locationId)
            ? state.gameProgress.visitedLocations
            : [...state.gameProgress.visitedLocations, action.payload.locationId],
        },
      };
    case "COMPLETE_CHALLENGE":
      return {
        ...state,
        gameProgress: {
          ...state.gameProgress,
          completedChallenges: [...state.gameProgress.completedChallenges, action.payload.challengeId],
        },
      };
    case "GAIN_XP":
      const newXp = state.player.stats.xp + action.payload.amount;
      const shouldLevelUp = newXp >= state.player.stats.xpToNextLevel;
      
      return {
        ...state,
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            xp: shouldLevelUp ? newXp - state.player.stats.xpToNextLevel : newXp,
            level: shouldLevelUp ? state.player.stats.level + 1 : state.player.stats.level,
            xpToNextLevel: shouldLevelUp 
              ? Math.floor(state.player.stats.xpToNextLevel * 1.5) 
              : state.player.stats.xpToNextLevel,
          },
        },
      };
    case "GAIN_INSIGHT":
      return {
        ...state,
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            insight: state.player.stats.insight + action.payload.amount,
          },
        },
      };
    case "LEVEL_UP":
      return {
        ...state,
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            level: state.player.stats.level + 1,
            xpToNextLevel: Math.floor(state.player.stats.xpToNextLevel * 1.5),
            maxHealth: state.player.stats.maxHealth + 20,
            health: state.player.stats.maxHealth + 20,
          },
        },
      };
    case "LEARN_CONCEPT":
      return {
        ...state,
        player: {
          ...state.player,
          inventory: {
            ...state.player.inventory,
            conceptsLearned: [...state.player.inventory.conceptsLearned, action.payload.conceptId],
          },
        },
      };
    case "UNLOCK_SPELL":
      const newSpell = spells.find(spell => spell.id === action.payload.spellId);
      if (!newSpell) return state;
      
      const updatedSpell = { ...newSpell, unlocked: true };
      const updatedSpells = [...state.player.inventory.spells, updatedSpell];
      
      return {
        ...state,
        player: {
          ...state.player,
          inventory: {
            ...state.player.inventory,
            spells: updatedSpells,
          },
        },
      };
    case "SET_PLAYER_NAME":
      return {
        ...state,
        player: {
          ...state.player,
          name: action.payload.name,
        },
      };
    case "TOGGLE_SETTING":
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.setting]: action.payload.value,
        },
      };
    default:
      return state;
  }
};

// Context types
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  messages: GameMessage[];
  addMessage: (content: string, type: MessageType) => void;
  getCurrentLocation: () => {
    location: any;
    challenges: any[];
    npcs: any[];
  };
  handleCommand: (command: string) => void;
  handleOptionSelect: (option: any) => void;
  handleAnswerSubmit: (challenge: any, answerId: string) => void;
  resetGame: () => void;
  isInitialized: boolean;
  setIsInitialized: (value: boolean) => void;
  gameStarted: boolean;
  startGame: (playerName: string) => void;
}

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  // Add a message to the game history
  const addMessage = (content: string, type: MessageType) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      content,
      type,
      timestamp: Date.now(),
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Get current location data
  const getCurrentLocation = () => {
    const locationData = locations.find(loc => loc.id === state.player.currentLocation) || locations[0];
    
    const locationChallenges = locationData.challenges?.filter(
      challenge => !state.gameProgress.completedChallenges.includes(challenge.id)
    ) || [];
    
    return {
      location: locationData,
      challenges: locationChallenges,
      npcs: locationData.npcs || [],
    };
  };

  // Handle player commands
  const handleCommand = (command: string) => {
    const normalizedCommand = command.trim().toLowerCase();
    addMessage(`> ${command}`, 'player-input');
    
    // Simple command parser
    if (normalizedCommand.startsWith('go ') || normalizedCommand.startsWith('move ')) {
      const direction = normalizedCommand.split(' ')[1];
      handleMovement(direction);
    } else if (normalizedCommand.startsWith('look')) {
      describeCurrentLocation();
    } else if (normalizedCommand.startsWith('help')) {
      showHelp();
    } else if (normalizedCommand.startsWith('status') || normalizedCommand === 'stats') {
      showPlayerStatus();
    } else if (normalizedCommand.startsWith('spells') || normalizedCommand === 'inventory') {
      showInventory();
    } else if (normalizedCommand.startsWith('concepts')) {
      showConcepts();
    } else if (normalizedCommand === 'clear') {
      setMessages([]);
      addMessage("Terminal cleared.", 'system');
    } else if (normalizedCommand.startsWith('challenge ')) {
      const challengeId = normalizedCommand.split(' ')[1];
      startChallenge(challengeId);
    } else if (normalizedCommand.startsWith('cast ')) {
      const spellId = normalizedCommand.split(' ')[1];
      castSpell(spellId);
    } else if (normalizedCommand.startsWith('talk ')) {
      const npcId = normalizedCommand.split(' ')[1];
      talkToNPC(npcId);
    } else {
      addMessage("I don't understand that command. Type 'help' for a list of available commands.", 'system');
    }
  };

  // Handle movement between locations
  const handleMovement = (direction: string) => {
    const { location } = getCurrentLocation();
    const connection = location.connections.find(
      conn => conn.direction.toLowerCase() === direction.toLowerCase()
    );
    
    if (connection) {
      dispatch({ type: 'MOVE_PLAYER', payload: { locationId: connection.locationId } });
      
      // Check if this is the first visit to show detailed description
      const isFirstVisit = !state.gameProgress.visitedLocations.includes(connection.locationId);
      if (isFirstVisit) {
        addMessage(`You travel ${direction} and discover a new area...`, 'narration');
        
        setTimeout(() => {
          const newLocation = locations.find(loc => loc.id === connection.locationId);
          if (newLocation) {
            addMessage(`# ${newLocation.name}`, 'narration');
            addMessage(newLocation.description, 'narration');
          }
        }, 1000);
      } else {
        const newLocation = locations.find(loc => loc.id === connection.locationId);
        addMessage(`You travel ${direction} to ${newLocation?.name}.`, 'narration');
      }
    } else {
      addMessage(`You cannot go ${direction} from here.`, 'system');
    }
  };

  // Describe the current location
  const describeCurrentLocation = () => {
    const { location, challenges, npcs } = getCurrentLocation();
    
    addMessage(`# ${location.name}`, 'narration');
    addMessage(location.description, 'narration');
    
    if (challenges.length > 0) {
      addMessage("You notice the following challenges here:", 'narration');
      challenges.forEach(challenge => {
        addMessage(`- ${challenge.name}: ${challenge.description}`, 'narration');
      });
    }
    
    if (npcs.length > 0) {
      addMessage("You see the following characters:", 'narration');
      npcs.forEach(npc => {
        addMessage(`- ${npc.name}: ${npc.description}`, 'narration');
      });
    }
    
    if (location.connections.length > 0) {
      addMessage("You can go in these directions:", 'narration');
      location.connections.forEach(conn => {
        addMessage(`- ${conn.direction}: ${conn.description}`, 'narration');
      });
    }
  };

  // Handle starting a challenge
  const startChallenge = (challengeId: string) => {
    const { challenges } = getCurrentLocation();
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      addMessage(`Challenge ${challengeId} not found in this location.`, 'error');
      return;
    }
    
    if (state.gameProgress.completedChallenges.includes(challengeId)) {
      addMessage(`You've already completed the "${challenge.name}" challenge.`, 'system');
      return;
    }
    
    addMessage(`You begin the "${challenge.name}" challenge:`, 'narration');
    addMessage(challenge.description, 'narration');
    
    if (challenge.type === 'multiple-choice' && challenge.question) {
      setTimeout(() => {
        addMessage(challenge.question!, 'system');
        if (challenge.choices) {
          challenge.choices.forEach((choice, index) => {
            addMessage(`${index + 1}. ${choice.text}`, 'system');
          });
        }
        addMessage("Use the challenge panel to select your answer.", 'system');
      }, 1000);
    } else if (challenge.type === 'code-completion' && challenge.codeTemplate) {
      setTimeout(() => {
        addMessage("Complete the following code:", 'code');
        addMessage(challenge.codeTemplate, 'code');
        addMessage("Use the challenge panel to submit your solution.", 'system');
      }, 1000);
    } else if (challenge.type === 'command') {
      setTimeout(() => {
        addMessage("Enter the appropriate command to solve this challenge.", 'system');
        if (challenge.hints && challenge.hints.length > 0) {
          addMessage(`Hint: ${challenge.hints[0]}`, 'system');
        }
      }, 1000);
    }
  };

  // Handle casting a spell
  const castSpell = (spellId: string) => {
    const spell = state.player.inventory.spells.find(s => s.id === spellId);
    
    if (!spell) {
      addMessage("You don't know that spell.", 'error');
      return;
    }
    
    if (!spell.unlocked) {
      addMessage("You haven't unlocked that spell yet.", 'error');
      return;
    }
    
    addMessage(`You cast ${spell.name}!`, 'spell');
    addMessage(`Effect: ${spell.effect}`, 'spell');
    addMessage(`Code: ${spell.code}`, 'code');
    
    // Check if the spell solves any active challenges
    const { challenges } = getCurrentLocation();
    const solvableChallenge = challenges.find(
      c => c.type === 'command' && c.expectedCommand === `cast ${spellId}`
    );
    
    if (solvableChallenge) {
      setTimeout(() => {
        addMessage("The spell worked perfectly!", 'success');
        
        // Complete challenge
        dispatch({ type: 'COMPLETE_CHALLENGE', payload: { challengeId: solvableChallenge.id } });
        
        // Grant rewards
        dispatch({ type: 'GAIN_XP', payload: { amount: solvableChallenge.xpReward } });
        dispatch({ type: 'GAIN_INSIGHT', payload: { amount: solvableChallenge.insightReward } });
        
        // Check for related concept
        const relatedConcept = concepts.find(c => c.id === solvableChallenge.conceptId);
        if (relatedConcept && !state.player.inventory.conceptsLearned.includes(relatedConcept.id)) {
          dispatch({ type: 'LEARN_CONCEPT', payload: { conceptId: relatedConcept.id } });
          addMessage(`You've gained deeper understanding of: ${relatedConcept.name}`, 'concept');
        }
      }, 1500);
    }
  };

  // Talk to an NPC
  const talkToNPC = (npcId: string) => {
    const { npcs } = getCurrentLocation();
    const npc = npcs.find(n => n.id === npcId);
    
    if (!npc) {
      addMessage(`There's no one called ${npcId} here.`, 'error');
      return;
    }
    
    const dialogue = npc.dialogue.find(d => d.id === npc.currentDialogueId);
    if (dialogue) {
      addMessage(`${npc.name}: "${dialogue.text}"`, 'narration');
      
      if (dialogue.responseOptions && dialogue.responseOptions.length > 0) {
        setTimeout(() => {
          addMessage("How do you respond?", 'system');
          dialogue.responseOptions!.forEach((option, index) => {
            addMessage(`${index + 1}. ${option.text}`, 'system');
          });
        }, 1000);
      }
    }
  };

  // Show help information
  const showHelp = () => {
    addMessage("# Available Commands", 'system');
    addMessage("- `go [direction]` - Move in a direction (north, south, east, west)", 'system');
    addMessage("- `look` - Examine your surroundings", 'system');
    addMessage("- `status` or `stats` - Check your character stats", 'system');
    addMessage("- `spells` or `inventory` - View your learned spells and items", 'system');
    addMessage("- `concepts` - Review Python concepts you've learned", 'system');
    addMessage("- `talk [character]` - Speak with an NPC", 'system');
    addMessage("- `challenge [name]` - Attempt a challenge", 'system');
    addMessage("- `cast [spell]` - Use a Python 'spell' you've learned", 'system');
    addMessage("- `help` - Show this help menu", 'system');
    addMessage("- `clear` - Clear the message history", 'system');
  };

  // Show player status
  const showPlayerStatus = () => {
    const { player } = state;
    
    addMessage(`# ${player.name} - Level ${player.stats.level} Pythonista`, 'system');
    addMessage(`Health: ${player.stats.health}/${player.stats.maxHealth}`, 'system');
    addMessage(`XP: ${player.stats.xp}/${player.stats.xpToNextLevel}`, 'system');
    addMessage(`Insight: ${player.stats.insight}`, 'system');
    
    addMessage("## Python Mastery", 'system');
    addMessage(`- Data Structures: ${player.stats.pythonMastery.dataStructures}/10`, 'system');
    addMessage(`- Functions: ${player.stats.pythonMastery.functions}/10`, 'system');
    addMessage(`- Classes: ${player.stats.pythonMastery.classes}/10`, 'system');
    addMessage(`- Control Flow: ${player.stats.pythonMastery.controlFlow}/10`, 'system');
    addMessage(`- Metaprogramming: ${player.stats.pythonMastery.metaprogramming}/10`, 'system');
  };

  // Show inventory and spells
  const showInventory = () => {
    const { player } = state;
    
    addMessage("# Your Pythonic Arsenal", 'system');
    
    if (player.inventory.spells.length === 0) {
      addMessage("You haven't learned any spells yet. Complete challenges to learn new Python techniques!", 'system');
    } else {
      addMessage("## Spells (Python Techniques)", 'spell');
      player.inventory.spells.forEach(spell => {
        addMessage(`- **${spell.name}**: ${spell.description}`, 'spell');
        addMessage(`  Usage: \`${spell.code}\``, 'code');
      });
    }
    
    if (player.inventory.items.length === 0) {
      addMessage("You don't have any items in your inventory.", 'system');
    } else {
      addMessage("## Items", 'item');
      player.inventory.items.forEach(item => {
        addMessage(`- ${item.name}: ${item.description}`, 'item');
      });
    }
  };

  // Show learned concepts
  const showConcepts = () => {
    const { player } = state;
    
    addMessage("# Python Concepts You've Mastered", 'system');
    
    if (player.inventory.conceptsLearned.length === 0) {
      addMessage("You haven't fully mastered any Python concepts yet. Complete challenges to deepen your understanding!", 'system');
      return;
    }
    
    player.inventory.conceptsLearned.forEach(conceptId => {
      const concept = concepts.find(c => c.id === conceptId);
      if (concept) {
        addMessage(`## ${concept.name}`, 'concept');
        addMessage(concept.description, 'concept');
        addMessage(`Book Reference: ${concept.bookReference}`, 'concept');
        
        if (concept.examples.length > 0) {
          addMessage("### Examples:", 'concept');
          concept.examples.forEach(example => {
            addMessage(`- ${example}`, 'code');
          });
        }
      }
    });
  };

  // Handle dialogue option selection
  const handleOptionSelect = (option: any) => {
    // Implementation for dialogue choices
    addMessage(`You selected: "${option.text}"`, 'player-input');
    
    const { location, npcs } = getCurrentLocation();
    const npc = npcs.find(n => n.dialogue.some(d => d.responseOptions?.some(o => o.id === option.id)));
    
    if (npc && option.nextDialogueId) {
      const nextDialogue = npc.dialogue.find(d => d.id === option.nextDialogueId);
      if (nextDialogue) {
        setTimeout(() => {
          addMessage(`${npc.name}: "${nextDialogue.text}"`, 'narration');
        }, 500);
      }
    }
  };

  // Handle challenge answer submission
  const handleAnswerSubmit = (challenge: any, answerId: string) => {
    const selectedChoice = challenge.choices?.find((c: any) => c.id === answerId);
    
    if (selectedChoice) {
      addMessage(`You selected: "${selectedChoice.text}"`, 'player-input');
      
      setTimeout(() => {
        if (selectedChoice.isCorrect) {
          addMessage("Correct answer!", 'success');
          addMessage(selectedChoice.explanation, 'concept');
          
          // Complete challenge
          dispatch({ type: 'COMPLETE_CHALLENGE', payload: { challengeId: challenge.id } });
          
          // Grant rewards
          dispatch({ type: 'GAIN_XP', payload: { amount: challenge.xpReward } });
          dispatch({ type: 'GAIN_INSIGHT', payload: { amount: challenge.insightReward } });
          
          // Learn concept if this is the first challenge for this concept
          const relatedConcept = concepts.find(c => c.id === challenge.conceptId);
          if (relatedConcept && !state.player.inventory.conceptsLearned.includes(relatedConcept.id)) {
            dispatch({ type: 'LEARN_CONCEPT', payload: { conceptId: relatedConcept.id } });
            
            // Find related spell
            const relatedSpell = spells.find(s => s.conceptId === relatedConcept.id);
            if (relatedSpell) {
              dispatch({ type: 'UNLOCK_SPELL', payload: { spellId: relatedSpell.id } });
              
              toast({
                title: "New Spell Learned!",
                description: `You've unlocked the ${relatedSpell.name} spell.`,
              });
            }
            
            addMessage(`You've gained deeper understanding of: ${relatedConcept.name}`, 'concept');
          }
        } else {
          addMessage("That's not correct.", 'error');
          addMessage(selectedChoice.explanation, 'concept');
        }
      }, 800);
    }
  };

  // Reset the game state
  const resetGame = () => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { name: "" } });
    setMessages([]);
    setGameStarted(false);
    window.location.reload();
  };

  // Start the game with player name
  const startGame = (playerName: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { name: playerName } });
    setGameStarted(true);
    
    // Initial narration
    addMessage("# Welcome to The Pythonic Path", 'narration');
    addMessage(
      "You stand at the threshold of the legendary Python Academy, a place where code and magic intertwine. " +
      "As an aspiring Pythonista, you seek to master the elegant and powerful ways of Python as chronicled in the sacred tome 'Fluent Python'.",
      'narration'
    );
    
    setTimeout(() => {
      addMessage(
        "Your journey will take you through realms of Data Structures, Function Groves, " +
        "Class Hierarchies, and eventually to the arcane heights of Metaprogramming.",
        'narration'
      );
    }, 3000);
    
    setTimeout(() => {
      describeCurrentLocation();
      addMessage("Type 'help' for a list of commands.", 'system');
    }, 5000);
  };

  // Context value
  const contextValue: GameContextType = {
    state,
    dispatch,
    messages,
    addMessage,
    getCurrentLocation,
    handleCommand,
    handleOptionSelect,
    handleAnswerSubmit,
    resetGame,
    isInitialized,
    setIsInitialized,
    gameStarted,
    startGame,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Hook for using the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
