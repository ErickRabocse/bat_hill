// src/data/chapters/index.js

// Importa los datos de cada archivo de capítulo
import { introductionChapterData } from './introductionChapter' // Para el capítulo con id: 0
import { chapter1Data } from './chapter1Data' // Para el capítulo con id: 1
import { chapter2Data } from './chapter2Data' // Para el capítulo con id: 2
import { chapter3Data } from './chapter3Data' // Para el capítulo con id: 3
import { chapter4Data } from './chapter4Data' // Para el capítulo con id: 4
import { chapter5Data } from './chapter5Data' // Para el capítulo con id: 5
import { chapter6Data } from './chapter6Data' // Para el capítulo con id: 6
import { chapter7Data } from './chapter7Data' // Para el capítulo con id: 7
import { chapter8Data } from './chapter8Data' // Para el capítulo con id: 8

// Crea un array que contenga todos los datos de los capítulos en orden
export const allChapters = [
  introductionChapterData,
  chapter1Data,
  chapter2Data,
  chapter3Data,
  chapter4Data,
  chapter5Data,
  chapter6Data,
  chapter7Data,
  chapter8Data,
]

// Opcional: Si también necesitas acceder a los capítulos por su ID de forma directa,
// podrías crear y exportar un objeto como este:
/*
export const chaptersById = {
  0: introductionChapterData,
  1: chapter1Data,
  2: chapter2Data,
  3: chapter3Data,
  4: chapter4Data,
  5: chapter5Data,
  6: chapter6Data,
  7: chapter7Data,
  8: chapter8Data,
};
*/
