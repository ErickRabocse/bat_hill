import React, { useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import FeedbackModal from './FeedbackModal'
import './DragDropSentence.css'

// Item Type para el arrastre
const ItemTypes = {
  WORD: 'word',
}

// Componente para una palabra arrastrable
function DraggableWord({ word, onDropWord }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.WORD,
    item: { word },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (!dropResult) {
        // Si no se soltó en un target válido (blank)
        onDropWord(item.word) // Devuelve la palabra a las disponibles
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <span
      ref={drag}
      className="draggable-word"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {word}
    </span>
  )
}

// Componente para un espacio en blanco (blank)
function Blank({
  currentWord,
  onDropBlank,
  correctWord,
  isCorrect,
  showSolution,
  onRemoveWordFromBlank,
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.WORD,
    drop: (item) => {
      // Pasa la palabra soltada al handler en el componente padre
      onDropBlank(item.word)
      return { accepted: true, targetId: correctWord } // Retorna para que end() en DraggableWord sepa que fue un drop válido
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = isOver
  let backgroundColor = '#e0e0e0' // Default background for blanks
  if (isActive) {
    backgroundColor = '#c0c0c0' // Highlight when dragging over
  }

  let displayClass = 'blank-spot'
  if (showSolution && !isCorrect && currentWord) {
    // Solo si hay una palabra para mostrar el error
    displayClass += ' incorrect-solution'
  } else if (showSolution && isCorrect && currentWord) {
    // Solo si hay una palabra para mostrar el acierto
    displayClass += ' correct-solution'
  }

  return (
    <span
      ref={drop}
      className={displayClass}
      style={{ backgroundColor }}
      onClick={() => currentWord && onRemoveWordFromBlank(correctWord)} // **CORRECCIÓN 2: Uso de handleBlankClick**
    >
      {currentWord || (showSolution && !currentWord ? correctWord : '______')}{' '}
      {/* Muestra la palabra correcta si está vacío y la solución */}
    </span>
  )
}

// Componente principal de la actividad Drag & Drop
function DragDropSentence({ activityData, onActivityComplete }) {
  const [currentSentences, setCurrentSentences] = useState(() =>
    activityData.sentences.map((sentence) => ({
      ...sentence,
      parts: sentence.parts.map((part) =>
        part.type === 'blank' ? { ...part, currentWord: null } : part
      ),
    }))
  )

  const [availableWords, setAvailableWords] = useState([])
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackHint, setFeedbackHint] = useState('')
  const [isActivityCompleted, setIsActivityCompleted] = useState(false)

  useEffect(() => {
    const wordsToDrag = activityData.allWords // Usar activityData.allWords directamente
    const allWordsShuffled = shuffleArray(wordsToDrag)
    setAvailableWords(allWordsShuffled)
  }, [activityData])

  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Maneja el soltar una palabra en un blank
  const handleDropBlank = (blankCorrectWord, droppedWord) => {
    if (isActivityCompleted) return

    setCurrentSentences((prevSentences) => {
      const newSentences = prevSentences.map((sentence) => ({
        ...sentence,
        parts: sentence.parts.map((part) => {
          if (part.type === 'blank' && part.correctWord === blankCorrectWord) {
            // Si ya hay una palabra en el blank, la devolvemos al pool de disponibles
            if (part.currentWord && part.currentWord !== droppedWord) {
              setAvailableWords((prev) => [...prev, part.currentWord])
            }
            return { ...part, currentWord: droppedWord }
          }
          return part
        }),
      }))
      return newSentences
    })

    // Remueve la palabra del banco de palabras arrastrables
    setAvailableWords((prev) => prev.filter((word) => word !== droppedWord))
  }

  // Maneja el clic en un blank para remover la palabra (si ya tiene una)
  const handleRemoveWordFromBlank = (blankCorrectWord) => {
    // **CORRECCIÓN 2: Renombrado y uso**
    if (isActivityCompleted) return

    setCurrentSentences((prevSentences) => {
      const updatedSentences = prevSentences.map((sentence) => ({
        ...sentence,
        parts: sentence.parts.map((part) => {
          if (
            part.type === 'blank' &&
            part.correctWord === blankCorrectWord &&
            part.currentWord
          ) {
            setAvailableWords((prev) => [...prev, part.currentWord]) // Devuelve la palabra al pool
            return { ...part, currentWord: null } // Vacía el blank
          }
          return part
        }),
      }))
      return updatedSentences
    })
  }

  // Comprobar respuestas
  const checkAnswers = () => {
    let allCorrect = true
    let firstIncorrectMessage = ''
    let firstIncorrectHint = ''

    for (const sentence of currentSentences) {
      for (const part of sentence.parts) {
        if (part.type === 'blank') {
          if (part.currentWord === null) {
            allCorrect = false
            firstIncorrectMessage = `¡Hay un espacio vacío! Asegúrate de arrastrar una palabra a cada espacio en blanco.`
            firstIncorrectHint = `Revisa la oración y busca el espacio que falta.`
            break
          }
          if (part.currentWord !== part.correctWord) {
            allCorrect = false
            firstIncorrectMessage = `La palabra "${part.currentWord}" no es correcta aquí.`
            firstIncorrectHint =
              part.hint ||
              `Intenta recordar el vocabulario de la oración original para "${part.translation}".`
            break
          }
        }
      }
      if (!allCorrect) break
    }

    if (allCorrect) {
      setIsActivityCompleted(true)
      onActivityComplete(true)
    } else {
      setFeedbackMessage(firstIncorrectMessage)
      setFeedbackHint(firstIncorrectHint)
      setShowFeedbackModal(true)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="drag-drop-activity-container">
        <h3>{activityData.instructions}</h3>
        {currentSentences.map((sentence) => (
          <p key={sentence.id} className="sentence-line">
            {sentence.parts.map((part, pIndex) => {
              if (part.type === 'text' || part.type === '.') {
                return <span key={pIndex}>{part.value || part.word}</span>
              } else if (part.type === 'blank') {
                const isCorrect = part.currentWord === part.correctWord
                return (
                  <Blank
                    key={pIndex}
                    currentWord={part.currentWord}
                    onDropBlank={(droppedWord) =>
                      handleDropBlank(part.correctWord, droppedWord)
                    }
                    correctWord={part.correctWord}
                    isCorrect={isCorrect}
                    showSolution={isActivityCompleted}
                    onRemoveWordFromBlank={handleRemoveWordFromBlank} // **CORRECCIÓN 2: Pasa la función**
                  />
                )
              }
              return null
            })}
          </p>
        ))}

        {!isActivityCompleted && (
          <>
            <div className="word-bank">
              {availableWords.map((word, index) => (
                <DraggableWord
                  key={word + index} // Usar word + index para key si las palabras se repiten
                  word={word}
                  // La función onDropWord para DraggableWord en el banco es solo para cuando NO se suelta en un blank.
                  // Si una palabra de un blank es arrastrada de vuelta, se maneja en handleRemoveWordFromBlank.
                  // Si una palabra del banco se arrastra y se suelta fuera de un blank, queremos que vuelva.
                  onDropWord={(returnedWord) => {
                    // **CORRECCIÓN 3: Uso de droppedWord**
                    // Esta función se llama si la palabra se arrastra y no se suelta en un blank
                    setAvailableWords((prev) => {
                      if (!prev.includes(returnedWord)) {
                        // Asegurarse de no duplicar
                        return [...prev, returnedWord]
                      }
                      return prev
                    })
                  }}
                />
              ))}
            </div>
            <button onClick={checkAnswers} className="check-button">
              Comprobar
            </button>
          </>
        )}

        {isActivityCompleted && (
          <p className="activity-success-message">
            ¡Excelente! Actividad completada. Ahora puedes continuar.
          </p>
        )}

        {showFeedbackModal && (
          <FeedbackModal
            message={feedbackMessage}
            hint={feedbackHint}
            onClose={() => setShowFeedbackModal(false)}
          />
        )}
      </div>
    </DndProvider>
  )
}

export default DragDropSentence
