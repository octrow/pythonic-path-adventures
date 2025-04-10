
import { Challenge, Concept, GameLocation, NPC, Spell } from "../types/game";

export const locations: GameLocation[] = [
  {
    id: "starting_area",
    name: "The Python Academy Entrance",
    description: "A grand archway adorned with serpentine motifs marks the entrance to the legendary Python Academy. Mystical runes resembling code symbols glow with a soft blue light along the stone walls. A weathered signpost displays directions to different realms of knowledge.",
    connections: [
      {
        direction: "north",
        locationId: "data_structure_caves",
        description: "A winding path leads to what appears to be the entrance of a cave system with strange symbols representing lists, tuples, and dictionaries etched into the stone."
      },
      {
        direction: "east",
        locationId: "function_groves",
        description: "A serene forested area where trees seem to branch in patterns that resemble function calls."
      }
    ],
    npcs: [
      {
        id: "instructor_guido",
        name: "Master Guido",
        description: "A wise-looking wizard with glasses and a beard streaked with gray. His robes are adorned with subtle patterns that resemble Python syntax.",
        dialogue: [
          {
            id: "greeting",
            text: "Greetings, aspiring Pythonista! I am Master Guido, your guide in the Pythonic Path. Are you ready to embark on a journey of knowledge?",
            responseOptions: [
              {
                id: "ready",
                text: "Yes, I'm ready to learn!",
                nextDialogueId: "explain_journey"
              },
              {
                id: "question",
                text: "What will I learn here?",
                nextDialogueId: "explanation"
              }
            ]
          },
          {
            id: "explain_journey",
            text: "Excellent! The path ahead is filled with challenges that will test your understanding of Python's elegant design. Begin by exploring the Data Structure Caves to the north, where the foundations of Pythonic knowledge await.",
            responseOptions: [
              {
                id: "thanks",
                text: "Thank you for the guidance.",
                nextDialogueId: "parting"
              }
            ]
          },
          {
            id: "explanation",
            text: "This academy teaches the deeper mysteries of Python as chronicled in the tome 'Fluent Python'. You'll master data structures, functions as first-class objects, object-oriented idioms, control flow, and eventually the arcane arts of metaprogramming.",
            responseOptions: [
              {
                id: "ready_now",
                text: "I'm ready to begin now.",
                nextDialogueId: "explain_journey"
              }
            ]
          },
          {
            id: "parting",
            text: "May your code be elegant and your errors few. Return to me if you seek guidance.",
            responseOptions: []
          }
        ],
        currentDialogueId: "greeting"
      }
    ],
    firstVisit: true
  },
  {
    id: "data_structure_caves",
    name: "The Data Structure Caves",
    description: "Crystalline formations in various geometric shapes illuminate this vast cave system. The walls seem to shift occasionally, reorganizing themselves like dynamic collections. Echoes of sequence operations reverberate through the caverns.",
    connections: [
      {
        direction: "south",
        locationId: "starting_area",
        description: "The path leading back to the Academy Entrance."
      },
      {
        direction: "east",
        locationId: "sequence_chamber",
        description: "A tunnel with glowing markings of lists, tuples, and arrays leads deeper into the cave."
      },
      {
        direction: "west",
        locationId: "mapping_alcove",
        description: "An opening in the cave wall reveals a chamber filled with key-value pair formations floating in the air."
      }
    ],
    challenges: [
      {
        id: "data_model_basics",
        name: "The Rune Puzzle",
        description: "Before you stands a mysterious artifact with Python symbols etched into its surface. It seems to respond to special method names.",
        type: "multiple-choice",
        completed: false,
        xpReward: 50,
        insightReward: 10,
        conceptId: "dunder_methods",
        difficulty: "easy",
        question: "To make an object behave like a sequence that can be accessed with [], which special method must it implement?",
        choices: [
          {
            id: "choice1",
            text: "__getitem__(self, key)",
            isCorrect: true,
            explanation: "Correct! The __getitem__ method enables sequence-like access with square brackets notation. This is part of Python's Data Model where special methods define behavior."
          },
          {
            id: "choice2",
            text: "__index__(self, key)",
            isCorrect: false,
            explanation: "Not quite. __index__ is used when an object needs to be converted to an integer index, not for implementing sequence access."
          },
          {
            id: "choice3",
            text: "__getsequence__(self, key)",
            isCorrect: false,
            explanation: "This isn't a real dunder method in Python. The correct method for sequence access is __getitem__."
          },
          {
            id: "choice4",
            text: "__subscript__(self, key)",
            isCorrect: false,
            explanation: "Python doesn't have a __subscript__ method. Square bracket notation is implemented with __getitem__."
          }
        ]
      }
    ],
    firstVisit: true
  },
  {
    id: "sequence_chamber",
    name: "The Sequence Chamber",
    description: "A vast circular room with high ceilings where ethereal projections of lists, tuples, and arrays float in the air. The room pulses with energy as the sequences transform and rearrange themselves. Code snippets flicker across the walls.",
    connections: [
      {
        direction: "west",
        locationId: "data_structure_caves",
        description: "The tunnel leading back to the main Data Structure Caves."
      }
    ],
    challenges: [
      {
        id: "list_vs_tuple",
        name: "The Immutable Trial",
        description: "In the center of the chamber sits a pedestal with two crystal containers - one fluid and changing (a list), the other solid and unchanging (a tuple).",
        type: "multiple-choice",
        completed: false,
        xpReward: 60,
        insightReward: 15,
        conceptId: "sequence_types",
        difficulty: "easy",
        question: "Why might you choose to use a tuple instead of a list in Python?",
        choices: [
          {
            id: "choice1",
            text: "Because tuples are immutable, they can be used as dictionary keys.",
            isCorrect: true,
            explanation: "Correct! Tuples are immutable, which makes them hashable (assuming they contain only hashable items). This property allows them to be used as dictionary keys, unlike lists."
          },
          {
            id: "choice2",
            text: "Tuples are always faster to access than lists.",
            isCorrect: false,
            explanation: "While tuples can have some performance advantages, it's not universally true that they are always faster to access than lists. The main difference is mutability, not access speed."
          },
          {
            id: "choice3",
            text: "Tuples can contain more elements than lists.",
            isCorrect: false,
            explanation: "Both lists and tuples can contain a very large number of elements. There's no inherent size advantage to tuples."
          },
          {
            id: "choice4",
            text: "Only tuples support heterogeneous data types.",
            isCorrect: false,
            explanation: "Both lists and tuples can contain elements of different data types. Python lists are not typed like arrays in some other languages."
          }
        ]
      },
      {
        id: "list_comprehension",
        name: "The Expression Forge",
        description: "A magical forge in the corner of the chamber allows you to create new sequences from existing ones using a powerful, concise syntax.",
        type: "code-completion",
        completed: false,
        xpReward: 70,
        insightReward: 20,
        conceptId: "list_comprehensions",
        difficulty: "medium",
        codeTemplate: "# Convert this for loop into a list comprehension:\n\nsquares = []\nfor x in range(10):\n    if x % 2 == 0:\n        squares.append(x**2)\n\n# Your list comprehension:\nsquares = ",
        solution: "[x**2 for x in range(10) if x % 2 == 0]",
        hints: [
          "List comprehensions follow the pattern: [expression for item in iterable if condition]",
          "Start with the expression (what you're appending), then the for loop, then the if condition",
          "In this case, you're appending x**2 for each x in range(10) if x is even"
        ]
      }
    ],
    firstVisit: true
  },
  {
    id: "mapping_alcove",
    name: "The Mapping Alcove",
    description: "This hexagonal chamber is filled with floating pairs of objects connected by glowing lines, representing key-value relationships. The walls are inscribed with hash functions and lookup optimizations. Occasionally, the entire room reorganizes itself as if it were being rehashed.",
    connections: [
      {
        direction: "east",
        locationId: "data_structure_caves",
        description: "The passage back to the main Data Structure Caves."
      }
    ],
    challenges: [
      {
        id: "dict_challenge",
        name: "The Hashable Guardian",
        description: "A spectral guardian blocks your path, holding what appears to be a magical dictionary. It demands you demonstrate knowledge of what can be used as keys.",
        type: "multiple-choice",
        completed: false,
        xpReward: 65,
        insightReward: 15,
        conceptId: "hashable_types",
        difficulty: "medium",
        question: "Which of the following cannot be used as a dictionary key in Python?",
        choices: [
          {
            id: "choice1",
            text: "A list of integers",
            isCorrect: true,
            explanation: "Correct! Lists are mutable and therefore not hashable, making them unsuitable as dictionary keys. Only hashable objects can be used as dictionary keys."
          },
          {
            id: "choice2",
            text: "A tuple of strings",
            isCorrect: false,
            explanation: "A tuple containing only immutable elements (like strings) is hashable and can be used as a dictionary key."
          },
          {
            id: "choice3",
            text: "An integer",
            isCorrect: false,
            explanation: "Integers are immutable and hashable, making them perfectly suitable as dictionary keys."
          },
          {
            id: "choice4",
            text: "A frozenset of integers",
            isCorrect: false,
            explanation: "A frozenset is an immutable version of a set and is hashable, so it can be used as a dictionary key."
          }
        ]
      }
    ],
    firstVisit: true
  },
  {
    id: "function_groves",
    name: "The Function Groves",
    description: "A serene forest where trees grow in patterns that resemble function call stacks. Each leaf contains a snippet of code, and the canopy above forms a complex network of branches representing higher-order functions. Soft murmurs of lambda expressions whisper through the breeze.",
    connections: [
      {
        direction: "west",
        locationId: "starting_area",
        description: "The path leading back to the Academy Entrance."
      }
    ],
    challenges: [
      {
        id: "decorator_challenge",
        name: "The Wrapper's Blessing",
        description: "Before you stands an ancient tree with branches that curl around themselves. Its bark shifts and changes, wrapping new functionality around existing patterns.",
        type: "code-completion",
        completed: false,
        xpReward: 80,
        insightReward: 25,
        conceptId: "decorators",
        difficulty: "hard",
        codeTemplate: "# Create a simple timing decorator that prints how long a function takes to execute\n\nimport time\n\ndef timer_decorator(func):\n    # Complete the decorator function\n    \n\n# Example usage:\n@timer_decorator\ndef slow_function():\n    time.sleep(1)\n    return \"Function executed\"",
        solution: "def timer_decorator(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f\"{func.__name__} took {end - start:.2f} seconds to run\")\n        return result\n    return wrapper",
        hints: [
          "A decorator is a function that takes another function as input and returns a modified version of it",
          "You'll need to define a wrapper function inside your decorator that will time the execution",
          "Don't forget to use *args and **kwargs to make your decorator work with any function signature",
          "Make sure to return both the wrapper function and the original function's result"
        ]
      }
    ],
    firstVisit: true
  }
];

export const concepts: Concept[] = [
  {
    id: "dunder_methods",
    name: "Special Methods (Dunder Methods)",
    description: "Python's special methods, often called 'dunder' (double underscore) methods, are the key to Python's data model. They allow you to define how objects of your classes behave in various operations and contexts.",
    bookReference: "Chapter 1: The Python Data Model",
    mastered: false,
    examples: [
      "__len__: Define behavior for len(obj)",
      "__getitem__: Enable indexing with obj[key]",
      "__str__: String representation for str(obj)",
      "__repr__: Official representation for repr(obj)",
      "__call__: Make objects callable like functions"
    ]
  },
  {
    id: "sequence_types",
    name: "Sequence Types and Operations",
    description: "Python offers various sequence types with different characteristics. Understanding when to use lists, tuples, arrays, and other sequences is fundamental to writing Pythonic code.",
    bookReference: "Chapter 2: An Array of Sequences",
    mastered: false,
    examples: [
      "Lists: Mutable sequences [1, 2, 3]",
      "Tuples: Immutable sequences (1, 2, 3)",
      "Sequence unpacking: a, b, c = some_sequence",
      "Slicing: sequence[start:stop:step]",
      "Sorting: sorted(sequence) vs. sequence.sort()"
    ]
  },
  {
    id: "list_comprehensions",
    name: "List Comprehensions and Generator Expressions",
    description: "List comprehensions and generator expressions provide a concise way to create lists and iterables based on existing ones. They're a hallmark of Pythonic code.",
    bookReference: "Chapter 2: An Array of Sequences",
    mastered: false,
    examples: [
      "List comprehension: [x for x in iterable]",
      "Filtered: [x for x in iterable if condition]",
      "With transformation: [f(x) for x in iterable]",
      "Generator expression: (x for x in iterable)",
      "Nested: [x+y for x in A for y in B]"
    ]
  },
  {
    id: "hashable_types",
    name: "Dictionaries and Hashable Types",
    description: "Dictionaries are fundamental mapping types in Python. Understanding hashable types is key to using dictionaries and sets effectively.",
    bookReference: "Chapter 3: Dictionaries and Sets",
    mastered: false,
    examples: [
      "Dict creation: {key: value}",
      "Dict comprehension: {k: v for k, v in pairs}",
      "Only hashable objects can be dict keys",
      "Immutable types are generally hashable",
      "Custom __hash__ and __eq__ methods define hashability for custom types"
    ]
  },
  {
    id: "decorators",
    name: "Function Decorators and Closures",
    description: "Decorators are a powerful way to modify or enhance functions and methods. They rely on closures and the concept of functions as first-class objects.",
    bookReference: "Chapter 9: Decorators and Closures",
    mastered: false,
    examples: [
      "@decorator syntax sugar for func = decorator(func)",
      "Decorators can accept arguments",
      "functools.wraps preserves metadata",
      "Closures capture their environment",
      "Stacking multiple decorators: @dec1 @dec2 def func()..."
    ]
  }
];

export const spells: Spell[] = [
  {
    id: "list_comprehension_spell",
    name: "List Comprehension",
    description: "A powerful spell that transforms and filters sequences in a single, elegant expression.",
    effect: "Creates a new list by applying an expression to each item in a sequence, optionally filtering the items.",
    code: "[expr for item in iterable if condition]",
    unlocked: false,
    conceptId: "list_comprehensions"
  },
  {
    id: "sequence_unpacking_spell",
    name: "Sequence Unpacking",
    description: "A spell that extracts multiple values from a sequence in one fluid motion.",
    effect: "Assigns individual elements from a sequence to multiple variables simultaneously.",
    code: "a, b, *rest = some_sequence",
    unlocked: false,
    conceptId: "sequence_types"
  },
  {
    id: "dunder_call_spell",
    name: "Callable Object",
    description: "A spell that imbues objects with the power to be called like functions.",
    effect: "Makes an object callable using the () syntax by implementing __call__.",
    code: "def __call__(self, *args, **kwargs): ...",
    unlocked: false,
    conceptId: "dunder_methods"
  },
  {
    id: "dict_get_spell",
    name: "Safe Key Retrieval",
    description: "A protective spell that safely retrieves values from dictionaries without raising KeyError.",
    effect: "Returns a default value if the key is not found in the dictionary.",
    code: "dictionary.get(key, default_value)",
    unlocked: false,
    conceptId: "hashable_types"
  },
  {
    id: "decorator_spell",
    name: "Function Adornment",
    description: "A transformative spell that enhances functions with additional capabilities.",
    effect: "Wraps a function, adding behavior before or after its execution.",
    code: "@decorator\ndef function(): ...",
    unlocked: false,
    conceptId: "decorators"
  }
];
