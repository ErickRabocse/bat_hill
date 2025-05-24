// components/DragDropSentence.jsx

import React, { useState } from 'react'
import { useDrop } from 'react-dnd' // useDrag ya no se importa aquí
import FeedbackModal from './FeedbackModal'
import './DragDropSentence.css'

// Item Type para el arrastre (se mantiene igual)
const ItemTypes = {
  WORD: 'word',
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
      onDropBlank(item.word)
      return { accepted: true, targetId: correctWord, droppedWord: item.word }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  const isActive = isOver
  let backgroundColor = 'var(--blank-bg-color)'
  if (isActive) {
    backgroundColor = 'var(--blank-hover-bg-color)'
  }

  let displayClass = 'blank-spot'
  if (showSolution && !isCorrect && currentWord) {
    displayClass += ' incorrect-solution'
  } else if (showSolution && isCorrect && currentWord) {
    displayClass += ' correct-solution'
  }

  return (
    <span
      ref={drop}
      className={displayClass}
      style={{ backgroundColor }}
      onClick={() => currentWord && onRemoveWordFromBlank(correctWord)}
    >
      {currentWord || (showSolution && !currentWord ? correctWord : '______')}
    </span>
  )
}

// Componente principal de la actividad Drag & Drop
// Ahora recibe initialWords (las palabras a rellenar) y onWordsChanged (callback para el pool de palabras)
function DragDropSentence({
  activityData,
  onActivityComplete,
  initialWords,
  onWordsChanged,
}) {
  const [currentSentences, setCurrentSentences] = useState(() =>
    activityData.sentences.map((sentence) => ({
      ...sentence,
      parts: sentence.parts.map((part) =>
        part.type === 'blank' ? { ...part, currentWord: null } : part
      ),
    }))
  )

  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackHint, setFeedbackHint] = useState('')
  const [isActivityCompleted, setIsActivityCompleted] = useState(false)

  // NOTA: 'availableWords' y su shuffle se manejan AHORA en App.jsx
  // useEffect(() => { ... }, []);

  // Maneja el soltar una palabra en un blank
  const handleDropBlank = (blankCorrectWord, droppedWord) => {
    if (isActivityCompleted) return

    let wordWasMovedFromAnotherBlank = false
    const newSentences = currentSentences.map((sentence) => ({
      ...sentence,
      parts: sentence.parts.map((part) => {
        if (part.type === 'blank' && part.correctWord === blankCorrectWord) {
          // Si ya hay una palabra en el blank, la devolvemos al pool EXTERNO
          if (part.currentWord && part.currentWord !== droppedWord) {
            // Asegura que la palabra devuelta no sea la misma que se está soltando
            // para evitar un bucle si una palabra se suelta sobre sí misma.
            if (droppedWord !== part.currentWord) {
              onWordsChanged([...initialWords, part.currentWord]) // Devuelve al pool externo
            }
            wordWasMovedFromAnotherBlank = true // Marca que una palabra existente fue movida
          }
          return { ...part, currentWord: droppedWord }
        }
        return part
      }),
    }))

    // Remover la palabra del pool EXTERNO de disponibles solo si no vino de otro blank
    // y no es la misma palabra que ya estaba en el blank (para evitar removerla dos veces)
    if (!wordWasMovedFromAnotherBlank && initialWords.includes(droppedWord)) {
      onWordsChanged(initialWords.filter((word) => word !== droppedWord))
    }

    setCurrentSentences(newSentences)
  }

  // Maneja el clic en un blank para remover la palabra (si ya tiene una)
  const handleRemoveWordFromBlank = (blankCorrectWord) => {
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
            onWordsChanged([...initialWords, part.currentWord]) // Devuelve la palabra al pool externo
            return { ...part, currentWord: null }
          }
          return part
        }),
      }))
      return updatedSentences
    })
  }

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
    // Ya no necesita DndProvider aquí, ya que está en App.jsx
    <div className="drag-drop-activity-content">
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
                  onRemoveWordFromBlank={handleRemoveWordFromBlank}
                />
              )
            }
            return null
          })}
        </p>
      ))}

      {!isActivityCompleted && (
        <button onClick={checkAnswers} className="check-button">
          Comprobar
        </button>
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
  )
}

export default DragDropSentence
