// src/data/practice/chapter1Practice.js

export const chapter1Practice = {
  topic: 'Verb to be & Subject Pronouns',
  questions: [
    // --- PREGUNTAS EXISTENTES ---
    {
      id: 'c1q1',
      focus: 'el VERBO',
      sentence: ['The', 'walls', 'is', 'high', '.'],
      options: [
        { word: 'walls', isError: false },
        { word: 'is', isError: true },
        { word: 'high', isError: false },
      ],
      error: 'is',
      correction: 'are',
      answerBank: ['am', 'are', 'it'],
    },
    {
      id: 'c1q2',
      focus: 'el VERBO',
      sentence: ['Her', 'eyes', 'is', 'tired', '.'],
      options: [
        { word: 'Her', isError: false },
        { word: 'eyes', isError: false },
        { word: 'is', isError: true },
      ],
      error: 'is',
      correction: 'are',
      answerBank: ['he', 'are', 'is'],
    },
    {
      id: 'c1q3',
      focus: 'el VERBO',
      sentence: ['It', 'are', 'a', 'cold', 'night', '.'],
      options: [
        { word: 'It', isError: false },
        { word: 'are', isError: true },
        { word: 'cold', isError: false },
      ],
      error: 'are',
      correction: 'is',
      answerBank: ['is', 'they', 'are'],
    },
    {
      id: 'c1q4',
      focus: 'el PRONOMBRE',
      sentence: ['He', 'is', 'a', 'stray', 'dog', '.'],
      options: [
        { word: 'He', isError: true },
        { word: 'is', isError: false },
        { word: 'dog', isError: false },
      ],
      error: 'He',
      correction: 'She',
      answerBank: ['It', 'She', 'They'],
    },

    // --- 6 PREGUNTAS NUEVAS ---
    {
      id: 'c1q5',
      focus: 'el VERBO',
      sentence: ['Her', 'belly', 'are', 'round', '.'],
      options: [
        { word: 'belly', isError: false },
        { word: 'are', isError: true },
        { word: 'round', isError: false },
      ],
      error: 'are',
      correction: 'is',
      answerBank: ['is', 'it', 'she'],
    },
    {
      id: 'c1q6',
      focus: 'el VERBO',
      sentence: ['The', 'box', 'are', 'soft', 'and', 'dry', '.'],
      options: [
        { word: 'box', isError: false },
        { word: 'are', isError: true }, // El error es el verbo, pero lo justificamos con el pronombre 'It'
        { word: 'soft', isError: false },
      ],
      error: 'are',
      correction: 'is',
      answerBank: ['is', 'they', 'are'],
    },
    {
      id: 'c1q7',
      focus: 'el VERBO',
      sentence: ['The', 'puppies', 'is', 'all', 'black', 'and', 'orange', '.'],
      options: [
        { word: 'puppies', isError: false },
        { word: 'is', isError: true }, // El error es el verbo, pero se justifica con el pronombre 'They'
        { word: 'black', isError: false },
      ],
      error: 'is',
      correction: 'are',
      answerBank: ['are', 'it', 'is'],
    },
    {
      id: 'c1q8',
      focus: 'el VERBO',
      sentence: ['The', 'water', 'are', 'grey', 'and', 'sour', '.'],
      options: [
        { word: 'water', isError: false },
        { word: 'are', isError: true },
        { word: 'grey', isError: false },
      ],
      error: 'are',
      correction: 'is',
      answerBank: ['is', 'am', 'are'],
    },
    {
      id: 'c1q9',
      focus: 'el PRONOMBRE',
      sentence: [
        'A',
        'car',
        'hits',
        'her',
        '.',
        'She',
        'is',
        'too',
        'fast',
        '.',
      ],
      options: [
        { word: 'She', isError: true },
        { word: 'is', isError: false },
        { word: 'fast', isError: false },
      ],
      error: 'She',
      correction: 'It',
      answerBank: ['He', 'It', 'They'],
    },
    {
      id: 'c1q10',
      focus: 'el VERBO',
      sentence: ['Mama', 'am', 'hungry', 'and', 'thirsty', '.'],
      options: [
        { word: 'Mama', isError: false },
        { word: 'am', isError: true },
        { word: 'hungry', isError: false },
      ],
      error: 'am',
      correction: 'is',
      answerBank: ['are', 'is', 'it'],
    },
  ],
}
