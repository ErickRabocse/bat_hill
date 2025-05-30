// src/data/chapters/chapter1Data.js

export const chapter1Data = {
  id: 1,
  title: 'A Cold Night',
  titleTranslation: 'Una noche fría',
  scenes: [
    {
      id: 1,
      image: '/images/1.1.png',
      text: [
        { word: 'It is', translation: 'Es' },
        { word: 'a cold night', translation: 'una noche fría' },
        { word: '.', translation: '' },
        { word: 'The wind is strong', translation: 'El viento es fuerte' },
        { word: '.', translation: '' },
        { word: 'The moon', translation: 'La luna' },
        { word: 'is big and bright', translation: 'es grande y brillante' },
        { word: 'in the dark sky', translation: 'en el cielo oscuro' },
        { word: '.', translation: '' },
        { word: 'Mama is', translation: 'Mamá es' },
        { word: 'a stray dog', translation: 'una perrita callejera' },
        { word: '.', translation: '' },
        { word: 'Her fur', translation: 'Su pelaje' },
        { word: 'is messy', translation: 'está alborotado' },
        { word: '.', translation: '' },
        { word: 'Her eyes', translation: 'Sus ojos' },
        { word: 'are tired', translation: 'están cansados' },
        { word: '.', translation: '' },
        { word: 'Her belly', translation: 'Su vientre' },
        { word: 'is round', translation: 'está redondo' },
        { word: '.', translation: '' },
        { word: 'She is going to', translation: 'Ella va a' },
        { word: 'have puppies', translation: 'tener cachorros' },
        { word: '.', translation: '' },
        { word: 'She', translation: 'Ella' },
        { word: 'walks slowly into', translation: 'se adentra lentamente en' },
        { word: 'a quiet alley', translation: 'un callejón tranquilo' },
        { word: '.', translation: '' },
        { word: 'The walls', translation: 'Las paredes' },
        { word: 'are high', translation: 'son altas' },
        { word: '.', translation: '' },
        { word: 'The space', translation: 'El espacio' },
        { word: 'is small', translation: 'es pequeño' },
        { word: '.', translation: '' },
        { word: 'It feels lonely', translation: 'Se siente solitario' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch1_sc1',
            parts: [
              { type: 'text', value: 'It is a ' },
              {
                type: 'blank',
                correctWord: 'cold',
                translation: 'fría',
                hint: 'Describe la temperatura de la noche.',
              },
              { type: 'text', value: ' night.' },
            ],
          },
          {
            id: 'sentence2_ch1_sc1',
            parts: [
              { type: 'text', value: 'The wind is ' },
              {
                type: 'blank',
                correctWord: 'strong',
                translation: 'fuerte',
                hint: '¿Cómo es la intensidad del viento?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence3_ch1_sc1',
            parts: [
              { type: 'text', value: 'Mama is a ' },
              {
                type: 'blank',
                correctWord: 'stray',
                translation: 'callejera',
                hint: 'Describe el tipo de perro que es Mama.',
              },
              { type: 'text', value: ' dog.' },
            ],
          },
          {
            id: 'sentence4_ch1_sc1',
            parts: [
              { type: 'text', value: 'Her belly is ' },
              {
                type: 'blank',
                correctWord: 'round',
                translation: 'redondo',
                hint: '¿Cómo es su barriga?',
              },
              { type: '.' },
            ],
          },
          {
            // NUEVA ORACIÓN 5
            id: 'sentence5_ch1_sc1',
            parts: [
              { type: 'text', value: 'The moon is big and ' },
              {
                type: 'blank',
                correctWord: 'bright',
                translation: 'brillante',
                hint: '¿Cómo es la luna además de grande?',
              },
              { type: '.' },
            ],
          },
        ],
        allWords: ['cold', 'strong', 'stray', 'round', 'bright'], // Añadida 'bright', 'high', 'sky'
      },
    },
    {
      id: 2,
      image: '/images/1.2.png',
      text: [
        /* ... (texto original de la escena 2) ... */ {
          word: 'Mama finds',
          translation: 'Mama encuentra',
        },
        { word: 'a corner', translation: 'una esquina' },
        { word: '.', translation: '' },
        { word: 'There is a box', translation: 'Hay una caja' },
        { word: 'of cardboard', translation: 'de cartón' },
        { word: '.', translation: '' },
        { word: 'It is soft', translation: 'Es suave' },
        { word: 'and dry', translation: 'y seca' },
        { word: '.', translation: '' },
        { word: 'She lies down', translation: 'Ella se acuesta' },
        { word: 'inside the box', translation: 'dentro de la caja' },
        { word: '.', translation: '' },
        {
          word: 'She breathes deeply',
          translation: 'Ella respira profundamente',
        },
        { word: '.', translation: '' },
        { word: 'She is ready', translation: 'Ella está lista' },
        { word: '.', translation: '' },
        { word: 'One by one', translation: 'Uno por uno' },
        { word: ',', translation: '' },
        { word: 'the puppies are born', translation: 'los cachorros nacen' },
        { word: '.', translation: '' },
        { word: 'The first is black', translation: 'El primero es negro' },
        { word: '.', translation: '' },
        { word: 'The second is black', translation: 'El segundo es negro' },
        { word: 'also', translation: 'también' },
        { word: '.', translation: '' },
        { word: 'The third is', translation: 'El tercero es' },
        { word: 'light orange', translation: 'naranja claro' },
        { word: '.', translation: '' },
        { word: 'Mama looks at them', translation: 'Mamá los mira' },
        { word: 'with love', translation: 'con amor' },
        { word: '.', translation: '' },
        { word: 'She licks them', translation: 'Ella los lame' },
        { word: 'gently', translation: 'suavemente' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch1_sc2',
            parts: [
              { type: 'text', value: 'Mama ' },
              {
                type: 'blank',
                correctWord: 'finds',
                translation: 'encuentra',
                hint: '¿Qué hace mamá en la esquina?',
              },
              { type: 'text', value: ' a corner.' },
            ],
          },
          {
            id: 'sentence2_ch1_sc2',
            parts: [
              { type: 'text', value: 'It is ' },
              {
                type: 'blank',
                correctWord: 'soft',
                translation: 'suave',
                hint: '¿Cómo es la caja de cartón?',
              },
              { type: 'text', value: ' and dry.' },
            ],
          },
          {
            id: 'sentence3_ch1_sc2',
            parts: [
              { type: 'text', value: 'The puppies are ' },
              {
                type: 'blank',
                correctWord: 'born',
                translation: 'nacen',
                hint: '¿Qué les sucede a los cachorros?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence4_ch1_sc2',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'licks',
                translation: 'lame',
                hint: '¿Qué hace mamá a sus cachorros?',
              },
              { type: 'text', value: ' them gently.' },
            ],
          },
          {
            // NUEVA ORACIÓN 5
            id: 'sentence5_ch1_sc2',
            parts: [
              { type: 'text', value: 'The third is light ' },
              {
                type: 'blank',
                correctWord: 'orange',
                translation: 'naranja',
                hint: '¿De qué color es el tercer cachorro?',
              },
              { type: '.' },
            ],
          },
        ],
        allWords: ['finds', 'soft', 'born', 'licks', 'orange'], // Añadida 'orange', 'cardboard', 'love'
      },
    },
    {
      id: 3,
      image: '/images/1.3.png',
      text: [
        /* ... (texto original de la escena 3) ... */ {
          word: 'She tries',
          translation: 'Ella intenta',
        },
        { word: 'to feed them', translation: 'alimentarlos' },
        { word: ',', translation: '' },
        { word: 'but there is not', translation: 'pero no hay' },
        { word: 'enough milk', translation: 'suficiente leche' },
        { word: '.', translation: '' },
        { word: 'Her tummy growls', translation: 'Su panza ruge' },
        { word: '.', translation: '' },
        { word: 'She is hungry', translation: 'Ella está hambrienta' },
        { word: '.', translation: '' },
        { word: 'Her legs', translation: 'Sus piernas' },
        { word: 'are weak', translation: 'están débiles' },
        { word: '.', translation: '' },
        { word: 'She wants', translation: 'Ella quiere' },
        { word: 'to find food', translation: 'encontrar comida' },
        { word: '.', translation: '' },
        { word: 'She walks out', translation: 'Ella sale' },
        { word: 'of the alley', translation: 'del callejón' },
        { word: '.', translation: '' },
        { word: 'She checks', translation: 'Ella revisa' },
        { word: 'trash cans', translation: 'botes de basura' },
        { word: '.', translation: '' },
        { word: 'She finds a', translation: 'Ella encuentra un' },
        { word: 'small piece', translation: 'pequeño pedazo' },
        { word: 'of sandwich', translation: 'de sándwich' },
        { word: 'and eats it', translation: 'y lo come' },
        { word: 'fast', translation: 'rápido' },
        { word: '.', translation: '' },
        { word: 'She drinks from', translation: 'Ella bebe de' },
        { word: 'a puddle', translation: 'un charco' },
        { word: '.', translation: '' },
        { word: 'The water is grey', translation: 'El agua está gris' },
        { word: 'and sour', translation: 'y agria' },
        { word: ',', translation: '' },
        { word: 'but she is thirsty', translation: 'pero ella está sedienta' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch1_sc3',
            parts: [
              { type: 'text', value: 'She is ' },
              {
                type: 'blank',
                correctWord: 'hungry',
                translation: 'hambrienta',
                hint: '¿Cómo se siente mamá?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence2_ch1_sc3',
            parts: [
              { type: 'text', value: 'Her legs are ' },
              {
                type: 'blank',
                correctWord: 'weak',
                translation: 'débiles',
                hint: '¿Cómo están sus piernas?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence3_ch1_sc3',
            parts: [
              { type: 'text', value: 'She wants to find ' },
              {
                type: 'blank',
                correctWord: 'food',
                translation: 'comida',
                hint: '¿Qué busca ella?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence4_ch1_sc3',
            parts: [
              { type: 'text', value: 'The water is grey and ' },
              {
                type: 'blank',
                correctWord: 'sour',
                translation: 'agria',
                hint: '¿Cómo es el agua?',
              },
              { type: '.' },
            ],
          },
          {
            // NUEVA ORACIÓN 5
            id: 'sentence5_ch1_sc3',
            parts: [
              { type: 'text', value: 'She checks ' },
              {
                type: 'blank',
                correctWord: 'trash',
                translation: 'basura',
                hint: '¿Qué revisa para buscar comida?',
              },
              { type: 'text', value: ' cans.' },
            ],
          },
        ],
        allWords: ['hungry', 'weak', 'food', 'sour', 'trash'], // Añadida 'trash', 'puddle'
      },
    },
    {
      id: 4,
      image: '/images/1.4.png',
      text: [
        /* ... (texto original de la escena 4) ... */ {
          word: 'Then',
          translation: 'Después',
        },
        { word: 'she turns back', translation: 'ella regresa' },
        { word: '.', translation: '' },
        { word: 'She wants', translation: 'Ella quiere' },
        { word: 'to see her babies', translation: 'ver a sus bebés' },
        { word: '.', translation: '' },
        { word: 'She crosses', translation: 'Ella cruza' },
        { word: 'the street', translation: 'la calle' },
        { word: '.', translation: '' },
        { word: 'A car comes', translation: 'Un auto viene' },
        { word: 'too fast', translation: 'demasiado rápido' },
        { word: '.', translation: '' },
        { word: 'It hits her', translation: 'La golpea' },
        { word: '.', translation: '' },
        { word: 'Mama falls', translation: 'Mamá cae' },
        { word: '.', translation: '' },
        { word: 'Her body hurts', translation: 'Su cuerpo le duele' },
        { word: '.', translation: '' },
        { word: 'She lies still', translation: 'Ella permanece quieta' },
        { word: 'on the road', translation: 'en la carretera' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch1_sc4',
            parts: [
              { type: 'text', value: 'She wants to see her ' },
              {
                type: 'blank',
                correctWord: 'babies',
                translation: 'bebés',
                hint: '¿A quién quiere ver?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence2_ch1_sc4',
            parts: [
              { type: 'text', value: 'A car comes too ' },
              {
                type: 'blank',
                correctWord: 'fast',
                translation: 'rápido',
                hint: '¿Cómo viene el auto?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence3_ch1_sc4',
            parts: [
              { type: 'text', value: 'It ' },
              {
                type: 'blank',
                correctWord: 'hits',
                translation: 'golpea',
                hint: '¿Qué le hace el auto?',
              },
              { type: 'text', value: ' her.' },
            ],
          },
          {
            id: 'sentence4_ch1_sc4',
            parts: [
              { type: 'text', value: 'Her body ' },
              {
                type: 'blank',
                correctWord: 'hurts',
                translation: 'duele',
                hint: '¿Cómo está su cuerpo?',
              },
              { type: '.' },
            ],
          },
          {
            // NUEVA ORACIÓN 5
            id: 'sentence5_ch1_sc4',
            parts: [
              { type: 'text', value: 'She lies ' },
              {
                type: 'blank',
                correctWord: 'still',
                translation: 'quieta',
                hint: '¿Cómo yace en la carretera?',
              },
              { type: 'text', value: ' on the road.' },
            ],
          },
        ],
        allWords: ['babies', 'fast', 'hits', 'hurts', 'still'], // Añadida 'still', 'falls', 'car'
      },
    },
    {
      id: 5,
      image: '/images/1.5.png',
      text: [
        /* ... (texto original de la escena 5) ... */ {
          word: 'The car stops',
          translation: 'El auto se detiene',
        },
        { word: 'for a moment', translation: 'por un momento' },
        { word: '.', translation: '' },
        { word: 'Mama opens', translation: 'Mamá abre' },
        { word: 'her eyes', translation: 'sus ojos' },
        { word: '.', translation: '' },
        { word: 'She hopes', translation: 'Ella espera' },
        { word: 'someone will help', translation: 'que alguien la ayude' },
        { word: '.', translation: '' },
        { word: 'But the car', translation: 'Pero el auto' },
        { word: 'speeds away', translation: 'acelera y se va' },
        { word: '.', translation: '' },
        { word: 'Mama cannot move', translation: 'Mamá no puede moverse' },
        { word: '.', translation: '' },
        { word: 'She thinks of', translation: 'Ella piensa en' },
        { word: 'her puppies', translation: 'sus cachorritas' },
        { word: '.', translation: '' },
        { word: 'She lets out', translation: 'Ella deja salir' },
        { word: 'one soft howl', translation: 'un suave aullido' },
        { word: ',', translation: '' },
        { word: 'then', translation: 'y luego' },
        { word: 'closes her eyes', translation: 'cierra sus ojos' },
        { word: 'forever', translation: 'para siempre' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch1_sc5',
            parts: [
              { type: 'text', value: 'The car ' },
              {
                type: 'blank',
                correctWord: 'stops',
                translation: 'se detiene',
                hint: '¿Qué hace el auto?',
              },
              { type: 'text', value: ' for a moment.' },
            ],
          },
          {
            id: 'sentence2_ch1_sc5',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'hopes',
                translation: 'espera',
                hint: '¿Qué siente ella?',
              },
              { type: 'text', value: ' someone will help.' },
            ],
          },
          {
            id: 'sentence3_ch1_sc5',
            parts: [
              { type: 'text', value: 'Mama cannot ' },
              {
                type: 'blank',
                correctWord: 'move',
                translation: 'moverse',
                hint: '¿Qué no puede hacer mamá?',
              },
              { type: '.' },
            ],
          },
          {
            id: 'sentence4_ch1_sc5',
            parts: [
              { type: 'text', value: 'She closes her eyes ' },
              {
                type: 'blank',
                correctWord: 'forever',
                translation: 'para siempre',
                hint: '¿Por cuánto tiempo?',
              },
              { type: '.' },
            ],
          },
          {
            // NUEVA ORACIÓN 5
            id: 'sentence5_ch1_sc5',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'thinks',
                translation: 'piensa',
                hint: '¿Qué hace ella sobre sus cachorros?',
              },
              { type: 'text', value: ' of her puppies.' },
            ],
          },
        ],
        allWords: ['stops', 'hopes', 'move', 'forever', 'thinks'], // Añadida 'thinks', 'eyes'
      },
    },
  ],
}
