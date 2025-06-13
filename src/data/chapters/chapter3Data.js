export const chapter3Data = {
  id: 3,
  title: 'Sofia',
  titleTranslation: 'Sofia',
  scenes: [
    {
      id: 1,
      image: '/images/3.1.png',
      text: [
        { word: 'Luna wakes up', translation: 'Luna se despierta' },
        { word: 'under the bench', translation: 'debajo del banco' },
        { word: '.', translation: '' },
        { word: 'Her nose', translation: 'Su nariz' },
        { word: 'is cold', translation: 'está fría' },
        { word: '.', translation: '' },
        { word: 'Her belly', translation: 'Su barriga' },
        { word: 'is empty', translation: 'está vacía' },
        { word: '.', translation: '' },
        { word: 'She walks slowly', translation: 'Ella camina lentamente' },
        { word: 'down the street', translation: 'por la calle' },
        { word: '.', translation: '' },
        { word: 'The sun is out', translation: 'El sol ha salido' },
        { word: '.', translation: '' },
        { word: 'It is Monday', translation: 'Es lunes' },
        { word: '.', translation: '' },
        {
          word: 'People are walking fast',
          translation: 'Las personas están caminando rápido',
        },
        { word: '.', translation: '' },
        { word: 'They are busy', translation: 'Ellos están ocupados' },
        { word: '.', translation: '' },
        { word: 'They do not see', translation: 'Ellos no ven' },
        { word: 'Luna', translation: 'a Luna' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch3_sc1',
            parts: [
              { type: 'text', value: 'Luna ' },
              {
                type: 'blank',
                correctWord: 'wakes up',
                hint: '¿Qué hace Luna al inicio de la mañana?',
              },
              { type: 'text', value: ' under the bench.' },
            ],
          },
          {
            id: 'sentence2_ch3_sc1',
            parts: [
              { type: 'text', value: 'Her belly is ' },
              {
                type: 'blank',
                correctWord: 'empty',
                hint: '¿Cómo está su barriga si tiene hambre?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence3_ch3_sc1',
            parts: [
              { type: 'text', value: 'She walks ' },
              {
                type: 'blank',
                correctWord: 'slowly',
                hint: '¿De qué forma camina?',
              },
              { type: 'text', value: ' down the street.' },
            ],
          },
          {
            id: 'sentence4_ch3_sc1',
            parts: [
              { type: 'text', value: 'People are walking ' },
              {
                type: 'blank',
                correctWord: 'fast',
                hint: 'Describe la velocidad de la gente.',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence5_ch3_sc1',
            parts: [
              { type: 'text', value: 'They are ' },
              {
                type: 'blank',
                correctWord: 'busy',
                hint: '¿Cómo están las personas en la calle?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['wakes up', 'empty', 'slowly', 'fast', 'busy'],
      },
    },
    {
      id: 2,
      image: '/images/3.2.png',
      text: [
        { word: 'Suddenly', translation: 'De repente' },
        { word: ',', translation: '' },
        { word: 'Luna smells something', translation: 'Luna huele algo' },
        { word: 'delicious', translation: 'delicioso' },
        { word: '.', translation: '' },
        { word: 'It is tuna', translation: 'Es atún' },
        { word: '!', translation: '' },
        { word: 'She lifts', translation: 'Ella levanta' },
        { word: 'her nose', translation: 'su nariz' },
        { word: 'and follows', translation: 'y sigue' },
        { word: 'the smell', translation: 'el olor' },
        { word: '.', translation: '' },
        { word: 'The smell comes', translation: 'El olor viene' },
        { word: 'from a backpack', translation: 'de una mochila' },
        { word: '.', translation: '' },
        { word: 'A girl', translation: 'Una niña' },
        { word: 'is wearing it', translation: 'la lleva puesta' },
        { word: '.', translation: '' },
        { word: 'She has a', translation: 'Ella tiene una' },
        { word: 'soft smile', translation: 'sonrisa suave' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch3_sc2',
            parts: [
              { type: 'text', value: 'Luna smells something ' },
              {
                type: 'blank',
                correctWord: 'delicious',
                hint: '¿Cómo era lo que olía?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence2_ch3_sc2',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'lifts',
                hint: '¿Qué hace con su nariz para oler mejor?',
              },
              { type: 'text', value: ' her nose.' },
            ],
          },
          {
            id: 'sentence3_ch3_sc2',
            parts: [
              { type: 'text', value: 'and ' },
              {
                type: 'blank',
                correctWord: 'follows',
                hint: '¿Qué hace después de olerlo?',
              },
              { type: 'text', value: ' the smell.' },
            ],
          },
          {
            id: 'sentence4_ch3_sc2',
            parts: [
              { type: 'text', value: 'The smell comes from a ' },
              {
                type: 'blank',
                correctWord: 'backpack',
                hint: '¿De dónde viene el olor?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence5_ch3_sc2',
            parts: [
              { type: 'text', value: 'She has a soft ' },
              {
                type: 'blank',
                correctWord: 'smile',
                hint: '¿Qué tiene la niña en su cara?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['delicious', 'lifts', 'follows', 'backpack', 'smile'],
      },
    },
    {
      id: 3,
      image: '/images/3.3.png',
      text: [
        {
          word: 'Luna runs after her',
          translation: 'Luna corre detrás de ella',
        },
        { word: '.', translation: '' },
        { word: 'She barks', translation: 'Ella ladra' },
        { word: ',', translation: '' },
        { word: '"Woof! Woof!"', translation: '"¡Guau! ¡Guau!"' },
        { word: 'But the girl', translation: 'Pero la niña' },
        {
          word: 'is listening to music',
          translation: 'está escuchando música',
        },
        { word: '.', translation: '' },
        { word: "She doesn't hear her", translation: 'Ella no la oye' },
        { word: '.', translation: '' },
        { word: 'At the stoplight', translation: 'En el semáforo' },
        { word: ',', translation: '' },
        { word: 'Luna chews', translation: 'Luna muerde' },
        { word: "the girl's shoelace", translation: 'la agujeta de la niña' },
        { word: '.', translation: '' },
        { word: 'It gets stuck in', translation: 'Se queda atorada en' },
        { word: 'her baby teeth', translation: 'sus dientes de leche' },
        { word: '.', translation: '' },
        { word: 'The girl is ready', translation: 'La niña está lista' },
        { word: 'to cross', translation: 'para cruzar' },
        { word: '.', translation: '' },
        { word: 'A bike ', translation: 'Una bicicleta' },
        { word: 'is coming fast', translation: 'se acerca rápido' },
        { word: '.', translation: '' },
        { word: 'She feels', translation: 'Ella siente' },
        { word: 'a tug', translation: 'un tirón' },
        { word: '.', translation: '' },
        { word: 'She looks down', translation: 'Ella mira hacia abajo' },
        { word: '.', translation: '' },
        { word: 'She sees Luna', translation: 'Ella ve a Luna' },
        { word: ',', translation: '' },
        { word: 'small and scared', translation: 'pequeña y asustada' },
        { word: ',', translation: '' },
        { word: 'with the shoelace', translation: 'con la agujeta' },
        { word: 'in her mouth', translation: 'en su boca' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch3_sc3',
            parts: [
              { type: 'text', value: 'Luna ' },
              {
                type: 'blank',
                correctWord: 'runs',
                hint: '¿Qué hace Luna para seguir a la niña?',
              },
              { type: 'text', value: ' after her.' },
            ],
          },
          {
            id: 'sentence2_ch3_sc3',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'barks',
                hint: '¿Qué sonido hace para llamar la atención?',
              },
              { type: 'text', value: ', "Woof! Woof!"' },
            ],
          },
          {
            id: 'sentence3_ch3_sc3',
            parts: [
              { type: 'text', value: 'Luna ' },
              {
                type: 'blank',
                correctWord: 'chews',
                hint: '¿Qué le hace a la agujeta?',
              },
              { type: 'text', value: " the girl's shoelace." },
            ],
          },
          {
            id: 'sentence4_ch3_sc3',
            parts: [
              { type: 'text', value: 'A bike is coming ' },
              {
                type: 'blank',
                correctWord: 'fast',
                hint: '¿A qué velocidad viene la bicicleta?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence5_ch3_sc3',
            parts: [
              { type: 'text', value: 'She feels a ' },
              {
                type: 'blank',
                correctWord: 'tug',
                hint: '¿Qué siente la niña en su zapato?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['runs', 'barks', 'chews', 'fast', 'tug'],
      },
    },
    {
      id: 4,
      image: '/images/3.4.png',
      text: [
        { word: 'Luna is black', translation: 'Luna es negra' },
        { word: 'with a white spot', translation: 'con una mancha blanca' },
        { word: 'on her forehead', translation: 'en su frente' },
        { word: '.', translation: '' },
        { word: 'The spot', translation: 'La mancha' },
        { word: 'looks like', translation: 'parece' },
        { word: 'a moon', translation: 'una luna' },
        { word: '.', translation: '' },
        { word: 'The girl', translation: 'La niña' },
        { word: 'kneels down', translation: 'se arrodilla' },
        { word: '.', translation: '' },
        { word: 'She laughs', translation: 'Ella ríe' },
        { word: 'a little', translation: 'un poco' },
        { word: '.', translation: '' },
        { word: '"Oh!', translation: '"¡Oh!' },
        { word: 'You saved me!"', translation: '¡Tú me salvaste!"' },
        { word: 'I almost got hit,"', translation: 'Casi me atropellan,"' },
        { word: 'she says', translation: 'dice ella' },
        { word: '.', translation: '' },
        { word: '"You are', translation: '"Eres' },
        { word: 'a tiny hero."', translation: 'una pequeña heroína."' },
        { word: '"My name is Sofia,"', translation: '"Mi nombre es Sofía,"' },
        { word: 'she adds', translation: 'ella añade' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch3_sc4',
            parts: [
              { type: 'text', value: 'The spot looks like a ' },
              {
                type: 'blank',
                correctWord: 'moon',
                hint: '¿A qué se parece su mancha?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence2_ch3_sc4',
            parts: [
              { type: 'text', value: 'The girl ' },
              {
                type: 'blank',
                correctWord: 'kneels',
                hint: '¿Qué hace para estar a la altura de Luna?',
              },
              { type: 'text', value: ' down.' },
            ],
          },
          {
            id: 'sentence3_ch3_sc4',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'laughs',
                hint: '¿Cuál es su reacción al ver a Luna?',
              },
              { type: 'text', value: ' a little.' },
            ],
          },
          {
            id: 'sentence4_ch3_sc4',
            parts: [
              { type: 'text', value: 'You ' },
              {
                type: 'blank',
                correctWord: 'saved',
                hint: '¿Qué hizo Luna por Sofia?',
              },
              { type: 'text', value: ' me!"' },
            ],
          },
          {
            id: 'sentence5_ch3_sc4',
            parts: [
              { type: 'text', value: '"You are a tiny ' },
              {
                type: 'blank',
                correctWord: 'hero',
                hint: '¿Cómo llama a Luna?',
              },
              { type: 'text', value: '."' },
            ],
          },
        ],
        allWords: ['moon', 'kneels', 'laughs', 'saved', 'hero'],
      },
    },
    {
      id: 5,
      image: '/images/3.5.png',
      text: [
        { word: 'Sofia takes off', translation: 'Sofia se quita' },
        { word: 'her backpack', translation: 'su mochila' },
        { word: '.', translation: '' },
        { word: 'She gives Luna', translation: 'Ella le da a Luna' },
        { word: 'a piece of', translation: 'un pedazo de' },
        { word: 'her sandwich', translation: 'su sándwich' },
        { word: '.', translation: '' },
        { word: 'Luna eats it', translation: 'Luna lo come' },
        { word: 'fast', translation: 'rápidamente' },
        { word: '.', translation: '' },
        { word: 'She wags', translation: 'Ella mueve' },
        { word: 'her tail', translation: 'su cola' },
        { word: '.', translation: '' },
        { word: 'Sofia smiles', translation: 'Sofia sonríe' },
        { word: '.', translation: '' },
        { word: '"You are coming', translation: '"Tú vienes' },
        { word: 'with me."', translation: 'conmigo."' },
        { word: 'I have to go', translation: 'Tengo que ir' },
        { word: 'to school now', translation: 'a la escuela ahora' },
        { word: ',', translation: '' },
        { word: 'but later', translation: 'pero más tarde' },
        { word: ',', translation: '' },
        { word: 'we go home', translation: 'nos iremos a casa' },
        { word: '."', translation: '' },
        { word: 'She gently places', translation: 'Ella coloca suavemente ' },
        { word: 'Luna in her backpack', translation: 'a Luna en su mochila' },
        { word: '.', translation: '' },
        { word: 'Luna feels warm', translation: 'Luna está calientita' },
        { word: '.', translation: '' },
        { word: 'She feels safe', translation: 'Ella se siente segura' },
        { word: '.', translation: '' },
        { word: 'She sticks out', translation: 'Ella saca' },
        { word: 'her nose and', translation: 'su nariz y' },
        { word: 'looks at the world', translation: 'mira al mundo' },
        { word: '.', translation: '' },
        { word: 'For the first time', translation: 'Por primera vez' },
        { word: ',', translation: '' },
        { word: 'she is not alone', translation: 'ella no está sola' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch3_sc5',
            parts: [
              { type: 'text', value: 'She gives Luna a piece of her ' },
              {
                type: 'blank',
                correctWord: 'sandwich',
                hint: '¿Qué comida le da a Luna?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence2_ch3_sc5',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'wags',
                hint: '¿Qué hace con la cola?',
              },
              { type: 'text', value: ' her tail.' },
            ],
          },
          {
            id: 'sentence3_ch3_sc5',
            parts: [
              { type: 'text', value: 'She gently ' },
              {
                type: 'blank',
                correctWord: 'places',
                hint: '¿Qué hace para meter a Luna en la mochila?',
              },
              { type: 'text', value: ' Luna in her backpack.' },
            ],
          },
          {
            id: 'sentence4_ch3_sc5',
            parts: [
              { type: 'text', value: 'Luna feels ' },
              {
                type: 'blank',
                correctWord: 'safe',
                hint: '¿Cómo se siente ahora?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence5_ch3_sc5',
            parts: [
              { type: 'text', value: 'she is not ' },
              {
                type: 'blank',
                correctWord: 'alone',
                hint: '¿Cómo no está por primera vez?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['sandwich', 'wags', 'places', 'safe', 'alone'],
      },
    },
  ],
}
