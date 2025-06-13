// src/data/practice/chapter1Practice.js

export const chapter1Practice = {
  topic: 'Verb to be & Subject Pronouns',
  questions: [
    {
      id: 'c1q1',
      focus: 'el VERBO',
      sentence: ['The', 'walls', 'is', 'high', '.'],
      options: [
        { word: 'walls', isError: false },
        { word: 'is', isError: true },
        { word: 'high', isError: false },
      ],
      error: 'is', // <-- LA PROPIEDAD CLAVE QUE FALTABA
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
      error: 'is', // <-- LA PROPIEDAD CLAVE QUE FALTABA
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
      error: 'are', // <-- LA PROPIEDAD CLAVE QUE FALTABA
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
      error: 'He', // <-- LA PROPIEDAD CLAVE QUE FALTABA
      correction: 'She',
      answerBank: ['It', 'She', 'They'],
    },
  ],
}
