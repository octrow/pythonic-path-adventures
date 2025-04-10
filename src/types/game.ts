
export type GameLocation = {
  id: string;
  name: string;
  description: string;
  connections: {
    direction: string;
    locationId: string;
    description?: string;
  }[];
  challenges?: Challenge[];
  npcs?: NPC[];
  firstVisit?: boolean;
};

export type Challenge = {
  id: string;
  name: string;
  description: string;
  type: 'multiple-choice' | 'code-completion' | 'command' | 'boss';
  completed: boolean;
  xpReward: number;
  insightReward: number;
  conceptId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // For multiple choice challenges
  question?: string;
  choices?: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  
  // For code completion challenges
  codeTemplate?: string;
  solution?: string;
  hints?: string[];
  
  // For command challenges
  expectedCommand?: string;
  commandArgs?: string[];
  
  // For boss challenges
  bossStats?: {
    name: string;
    health: number;
    attacks: {
      name: string;
      description: string;
      damage: number;
    }[];
  };
};

export type NPC = {
  id: string;
  name: string;
  description: string;
  dialogue: {
    id: string;
    text: string;
    responseOptions?: {
      id: string;
      text: string;
      nextDialogueId?: string;
      action?: () => void;
    }[];
  }[];
  currentDialogueId: string;
  quest?: any; // To be expanded later
};

export type Concept = {
  id: string;
  name: string;
  description: string;
  bookReference: string;
  mastered: boolean;
  examples: string[];
};

export type Spell = {
  id: string;
  name: string;
  description: string;
  effect: string;
  code: string;
  unlocked: boolean;
  conceptId: string;
};

export type PlayerStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  insight: number;
  health: number;
  maxHealth: number;
  pythonMastery: {
    dataStructures: number;
    functions: number;
    classes: number;
    metaprogramming: number;
    controlFlow: number;
  };
};

export type PlayerInventory = {
  spells: Spell[];
  items: any[]; // To be expanded later
  conceptsLearned: string[];
};

export type GameState = {
  player: {
    name: string;
    stats: PlayerStats;
    inventory: PlayerInventory;
    currentLocation: string;
  };
  gameProgress: {
    visitedLocations: string[];
    completedChallenges: string[];
    activeQuests: any[]; // To be expanded later
    gameStage: 'intro' | 'early-game' | 'mid-game' | 'late-game' | 'end-game';
  };
  settings: {
    textSpeed: 'slow' | 'normal' | 'fast' | 'instant';
    soundEnabled: boolean;
    helpMode: 'minimal' | 'detailed';
  };
};

export type GameAction = 
  | { type: 'MOVE_PLAYER', payload: { locationId: string } }
  | { type: 'COMPLETE_CHALLENGE', payload: { challengeId: string } }
  | { type: 'GAIN_XP', payload: { amount: number } }
  | { type: 'GAIN_INSIGHT', payload: { amount: number } }
  | { type: 'LEVEL_UP' }
  | { type: 'LEARN_CONCEPT', payload: { conceptId: string } }
  | { type: 'UNLOCK_SPELL', payload: { spellId: string } }
  | { type: 'SET_PLAYER_NAME', payload: { name: string } }
  | { type: 'TOGGLE_SETTING', payload: { setting: keyof GameState['settings'], value: any } }
  | { type: 'ADD_TO_HISTORY', payload: { message: string, type: MessageType } };

export type MessageType = 
  | 'narration' 
  | 'player-input' 
  | 'system' 
  | 'combat' 
  | 'item' 
  | 'spell' 
  | 'code' 
  | 'error' 
  | 'success' 
  | 'concept';

export type GameMessage = {
  id: string;
  content: string;
  type: MessageType;
  timestamp: number;
};
