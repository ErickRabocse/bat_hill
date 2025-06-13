export const chapter4Data = {
  id: 4,
  title: 'Finding a Home',
  titleTranslation: 'En busca de un hogar',
  scenes: [
    {
      id: 1,
      image: '/images/4.1.png',
      text: [
        { word: 'Sofia and Luna arrive', translation: 'Sofia y Luna llegan' },
        { word: 'at school', translation: 'a la escuela' },
        { word: '.', translation: '' },
        { word: 'Luna stays quiet', translation: 'Luna permanece callada' },
        { word: 'inside the backpack', translation: 'dentro de la mochila' },
        { word: '.', translation: '' },
        { word: 'But in class', translation: 'Pero en clase' },
        { word: ',', translation: '' },
        { word: 'she lets out', translation: 'ella deja escapar' },
        { word: 'a tiny bark', translation: 'un pequeño ladrido' },
        { word: '.', translation: '' },
        { word: '"Arf!"', translation: '"¡Guau!"' },
        { word: 'The teacher looks', translation: 'La maestra mira' },
        { word: 'around', translation: 'alrededor' },
        { word: '.', translation: '' },
        { word: '"What was', translation: '"¿Qué fue' },
        { word: 'that noise?"', translation: 'ese ruido?"' },
        { word: 'Sofia whispers', translation: 'Sofia susurra' },
        { word: ',', translation: '' },
        { word: '"Shhh, Luna.', translation: '"Shhh, Luna.' },
        { word: 'Stay calm."', translation: 'Mantente tranquila."' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch4_sc1',
            parts: [
              { type: 'text', value: 'Sofia and Luna ' },
              {
                type: 'blank',
                correctWord: 'arrive',
                hint: '¿Qué hacen al llegar a la escuela?',
              },
              { type: 'text', value: ' at school.' },
            ],
          },
          {
            id: 'sentence2_ch4_sc1',
            parts: [
              { type: 'text', value: 'Luna stays ' },
              {
                type: 'blank',
                correctWord: 'quiet',
                hint: '¿Cómo se mantiene en la mochila?',
              },
              { type: 'text', value: ' inside the backpack.' },
            ],
          },
          {
            id: 'sentence3_ch4_sc1',
            parts: [
              { type: 'text', value: 'She lets out a tiny ' },
              { type: 'blank', correctWord: 'bark', hint: '¿Qué sonido hace?' },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence4_ch4_sc1',
            parts: [
              { type: 'text', value: 'The teacher looks ' },
              {
                type: 'blank',
                correctWord: 'around',
                hint: '¿Hacia dónde mira la maestra?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence5_ch4_sc1',
            parts: [
              { type: 'text', value: 'Sofia ' },
              {
                type: 'blank',
                correctWord: 'whispers',
                hint: '¿Cómo habla para no ser descubierta?',
              },
              { type: 'text', value: ', "Shhh, Luna."' },
            ],
          },
        ],
        allWords: ['arrive', 'quiet', 'bark', 'around', 'whispers'],
      },
    },
    {
      id: 2,
      image: '/images/4.2.png',
      text: [
        { word: 'After school', translation: 'Después de la escuela' },
        { word: ',', translation: '' },
        { word: 'Sofia walks home', translation: 'Sofia camina a casa' },
        { word: '.', translation: '' },
        { word: 'Her house is small', translation: 'Su casa es pequeña' },
        { word: 'and yellow', translation: 'y amarilla' },
        { word: '.', translation: '' },
        { word: 'There are flowers', translation: 'Hay flores' },
        { word: 'in the garden', translation: 'en el jardín' },
        { word: '.', translation: '' },
        { word: 'She opens the door', translation: 'Ella abre la puerta' },
        { word: '.', translation: '' },
        { word: 'Her mom is cooking', translation: 'Su mamá está cocinando' },
        { word: '.', translation: '' },
        { word: 'The smell is nice', translation: 'El olor es agradable' },
        { word: '.', translation: '' },
        { word: 'Sofia', translation: 'Sofia' },
        { word: 'takes a deep breath', translation: 'respira profundo' },
        { word: '.', translation: '' },
        { word: 'She knows her mom', translation: 'Ella sabe que a su mamá' },
        {
          word: "doesn't like animals",
          translation: 'no le gustan los animales',
        },
        { word: 'in the house', translation: 'en la casa' },
        { word: '.', translation: '' },
        { word: '"Hi, Mom,"', translation: '"Hola, mamá,"' },
        { word: 'Sofia says', translation: 'Sofia dice' },
        { word: '.', translation: '' },
        { word: '"I found a dog."', translation: '"Encontré una perrita."' },
        { word: 'Her name is Luna."', translation: 'Su nombre es Luna."' },
        {
          word: 'Her mom turns around',
          translation: 'Su mamá se da la vuelta',
        },
        { word: '.', translation: '' },
        { word: '"A dog?"', translation: '"¿Un perro?"' },
        {
          word: 'She says, surprised',
          translation: 'Ella dice, sorprendida',
        },
        { word: '.', translation: '' },
        {
          word: '"We don\'t have space."',
          translation: '"No tenemos espacio."',
        },
        {
          word: 'Dogs are messy."',
          translation: 'Los perros son un desastre."',
        },
        {
          word: '"She isn\'t messy."',
          translation: '"Ella no es desastrosa."',
        },
        { word: 'She is sweet.', translation: 'Ella es dulce.' },
        { word: 'She saved me!"', translation: '¡Ella me salvó!"' },
        { word: 'says Sofia', translation: 'dice Sofia' },
        { word: '.', translation: '' },
        {
          word: 'Luna sits down quietly',
          translation: 'Luna se sienta tranquilamente',
        },
        { word: '.', translation: '' },
        { word: 'She wags her tail', translation: 'Ella mueve su cola' },
        { word: 'slowly', translation: 'lentamente' },
        { word: '.', translation: '' },
        { word: 'Her eyes are soft', translation: 'Tiene una mirada dulce' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch4_sc2',
            parts: [
              { type: 'text', value: 'Her house is small and ' },
              {
                type: 'blank',
                correctWord: 'yellow',
                hint: '¿De qué color es la casa?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence2_ch4_sc2',
            parts: [
              { type: 'text', value: 'There are ' },
              {
                type: 'blank',
                correctWord: 'flowers',
                hint: '¿Qué plantas hay en el jardín?',
              },
              { type: 'text', value: ' in the garden.' },
            ],
          },
          {
            id: 'sentence3_ch4_sc2',
            parts: [
              { type: 'text', value: 'Her mom is ' },
              {
                type: 'blank',
                correctWord: 'cooking',
                hint: '¿Qué hace la mamá en la cocina?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence4_ch4_sc2',
            parts: [
              { type: 'text', value: 'The smell is ' },
              {
                type: 'blank',
                correctWord: 'nice',
                hint: '¿A qué huele la comida?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence5_ch4_sc2',
            parts: [
              { type: 'text', value: 'Luna sits down ' },
              {
                type: 'blank',
                correctWord: 'quietly',
                hint: '¿Cómo se sienta Luna?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['yellow', 'flowers', 'cooking', 'nice', 'quietly'],
      },
    },
    {
      id: 3,
      image: '/images/4.3.png',
      text: [
        { word: "Sofia's mom", translation: 'La mamá de Sofia' },
        { word: 'looks at Luna', translation: 'mira a Luna' },
        { word: '.', translation: '' },
        { word: 'She thinks', translation: 'Ella piensa' },
        { word: 'for a moment', translation: 'por un momento' },
        { word: '.', translation: '' },
        { word: '"Okay," she says,', translation: '"Está bien," dice ella,' },
        { word: '"but she must', translation: '"pero ella debe' },
        { word: 'stay outside', translation: 'quedarse afuera."' },
        { word: '."', translation: '' },
        {
          word: 'The backyard is big',
          translation: 'El patio trasero es grande',
        },
        { word: '.', translation: '' },
        { word: 'There is grass', translation: 'Hay pasto' },
        { word: '.', translation: '' },
        { word: 'There is a small', translation: 'Hay un pequeño' },
        { word: 'wooden shelter', translation: 'refugio de madera' },
        { word: '.', translation: '' },
        { word: 'Sofia brings', translation: 'Sofia trae' },
        { word: 'a blanket', translation: 'una manta' },
        { word: 'and a bowl', translation: 'y un tazón' },
        { word: 'of water', translation: 'de agua' },
        { word: '.', translation: '' },
        { word: 'Luna lies down', translation: 'Luna se acuesta' },
        { word: '.', translation: '' },
        { word: 'She is clean now', translation: 'Ella está limpia ahora' },
        { word: '.', translation: '' },
        { word: 'She is not cold', translation: 'Ella no tiene fría' },
        { word: '.', translation: '' },
        { word: 'But Luna', translation: 'Pero Luna' },
        { word: 'is still learning', translation: 'aún está aprendiendo' },
        { word: '.', translation: '' },
        { word: 'She digs in', translation: 'Ella cava en' },
        { word: 'the garden', translation: 'el jardín' },
        { word: '.', translation: '' },
        { word: 'She chews sticks', translation: 'Ella muerde palos' },
        { word: '.', translation: '' },
        { word: 'One day, she finds', translation: 'Un día, ella encuentra' },
        {
          word: "Sofia's mom's favorite shoes",
          translation: 'los zapataos favoritos de la mamá de Sofia',
        },
        { word: '.', translation: '' },
        {
          word: 'She chews them',
          translation: 'Ella los muerde',
        },
        {
          word: 'too',
          translation: 'también',
        },
        { word: '.', translation: '' },
        {
          word: 'The shoes are ruined',
          translation: 'Los zapatos están arruinados',
        },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch4_sc3',
            parts: [
              { type: 'text', value: 'She must stay ' },
              {
                type: 'blank',
                correctWord: 'outside',
                hint: '¿Cuál es la condición para que Luna se quede?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence2_ch4_sc3',
            parts: [
              { type: 'text', value: 'There is a small wooden ' },
              {
                type: 'blank',
                correctWord: 'shelter',
                hint: '¿Dónde puede dormir Luna?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence3_ch4_sc3',
            parts: [
              { type: 'text', value: 'Sofia brings a ' },
              {
                type: 'blank',
                correctWord: 'blanket',
                hint: '¿Qué le trae Sofia para que no tenga frío?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence4_ch4_sc3',
            parts: [
              { type: 'text', value: 'She ' },
              {
                type: 'blank',
                correctWord: 'chews',
                hint: '¿Qué travesura hace con los palos y los zapatos?',
              },
              { type: 'text', value: ' sticks.' },
            ],
          },
          {
            id: 'sentence5_ch4_sc3',
            parts: [
              { type: 'text', value: 'The shoes are ' },
              {
                type: 'blank',
                correctWord: 'ruined',
                hint: '¿En qué estado quedaron los zapatos?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['outside', 'shelter', 'blanket', 'chews', 'ruined'],
      },
    },
    {
      id: 4,
      image: '/images/4.4.png',
      text: [
        { word: "Sofia's parents", translation: 'Los papás de Sofia ' },
        { word: 'are upset', translation: 'están molestos' },
        { word: '.', translation: '' },
        { word: '"This dog', translation: '"¡Esta perrita' },
        { word: 'is trouble!"', translation: 'es problemática!"' },
        { word: 'they shout', translation: 'ellos gritan' },
        { word: '.', translation: '' },
        { word: 'Luna hides in', translation: 'Luna se esconde en' },
        { word: 'her little house', translation: 'su pequeña casita' },
        { word: '.', translation: '' },
        { word: 'Sofia hugs her', translation: 'Sofia la abraza' },
        { word: '.', translation: '' },
        {
          word: '"Don\'t worry, Luna,"',
          translation: '"No te preocupes, Luna,"',
        },
        { word: 'she says', translation: 'ella dice' },
        { word: '.', translation: '' },
        {
          word: '"You\'re still learning."',
          translation: '"Tú aún estás aprendiendo."',
        },
        { word: 'Luna looks at', translation: 'Luna mira a' },
        { word: 'Sofia', translation: 'Sofia' },
        { word: '.', translation: '' },
        { word: 'Her eyes are big', translation: 'Sus ojos son grandes' },
        { word: '.', translation: '' },
        { word: 'Her tail moves', translation: 'Su cola se mueve' },
        { word: 'just a little', translation: 'solo un poco' },
        { word: '.', translation: '' },
        { word: 'She knows Sofia', translation: 'Ella sabe que Sofia' },
        { word: 'loves her', translation: 'la ama' },
        { word: '.', translation: '' },
        { word: 'That gives her', translation: 'Eso le da' },
        { word: 'courage', translation: 'valor' },
        { word: '.', translation: '' },
      ],
      activity: {
        type: 'DragDropSentence',
        instructions:
          'Arrastra las palabras a los espacios en blanco para completar las oraciones.',
        sentences: [
          {
            id: 'sentence1_ch4_sc4',
            parts: [
              { type: 'text', value: "Sofia's parents are " },
              {
                type: 'blank',
                correctWord: 'upset',
                hint: '¿Cómo están los papás por los zapatos arruinados?',
              },
              { type: 'text', value: '.' },
            ],
          },
          {
            id: 'sentence2_ch4_sc4',
            parts: [
              { type: 'text', value: '"This dog is ' },
              {
                type: 'blank',
                correctWord: 'trouble',
                hint: '¿Qué es esta perrita, según ellos?',
              },
              { type: 'text', value: '!"' },
            ],
          },
          {
            id: 'sentence3_ch4_sc4',
            parts: [
              { type: 'text', value: 'Luna ' },
              {
                type: 'blank',
                correctWord: 'hides',
                hint: '¿Qué hace Luna por miedo?',
              },
              { type: 'text', value: ' in her little house.' },
            ],
          },
          {
            id: 'sentence4_ch4_sc4',
            parts: [
              { type: 'text', value: 'Sofia ' },
              {
                type: 'blank',
                correctWord: 'hugs',
                hint: '¿Qué hace Sofia para tranquilizarla?',
              },
              { type: 'text', value: ' her.' },
            ],
          },
          {
            id: 'sentence5_ch4_sc4',
            parts: [
              { type: 'text', value: 'That gives her ' },
              {
                type: 'blank',
                correctWord: 'courage',
                hint: '¿Qué sentimiento le da el amor de Sofia?',
              },
              { type: 'text', value: '.' },
            ],
          },
        ],
        allWords: ['upset', 'trouble', 'hides', 'hugs', 'courage'],
      },
    },
  ],
}
