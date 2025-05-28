// src/components/DragDropSentence.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import FeedbackModal from './FeedbackModal'
import './DragDropSentence.css'

const ItemTypes = {
  WORD: 'word',
}

function Blank({
  currentWord,
  onDropBlank,
  correctWord,
  onClickBlank,
  computedClassName,
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
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

  return (
    <span
      ref={drop}
      className={computedClassName}
      style={{
        backgroundColor:
          isOver && canDrop
            ? 'var(--blank-hover-bg-color)'
            : 'var(--blank-bg-color)',
      }}
      onClick={() => onClickBlank(correctWord, currentWord)}
    >
      {currentWord || '______'}
    </span>
  )
}

function DragDropSentence({
  activityData,
  onActivityComplete,
  initialWords,
  onWordsChanged,
}) {
  const [currentSentences, setCurrentSentences] = useState([])
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackHint, setFeedbackHint] = useState('')
  const [isInternallyCompleted, setIsInternallyCompleted] = useState(false)

  useEffect(() => {
    const initialSentenceStates = activityData.sentences.map((sentence) => ({
      ...sentence,
      parts: sentence.parts.map((part) =>
        part.type === 'blank' ? { ...part, currentWord: null } : part
      ),
    }))
    setCurrentSentences(initialSentenceStates)
    setIsInternallyCompleted(false)
  }, [activityData])

  const handleDropOnBlank = useCallback(
    (blankCorrectWord, droppedWord) => {
      if (isInternallyCompleted) return

      setCurrentSentences((prevSentences) =>
        prevSentences.map((sentence) => ({
          ...sentence,
          parts: sentence.parts.map((part) => {
            if (
              part.type === 'blank' &&
              part.correctWord === blankCorrectWord
            ) {
              return { ...part, currentWord: droppedWord }
            }
            return part
          }),
        }))
      )

      const newAvailableWords = initialWords.filter((w) => w !== droppedWord)
      onWordsChanged(newAvailableWords)
    },
    [initialWords, onWordsChanged, isInternallyCompleted]
  )

  const handleClickOnBlank = useCallback(
    (blankCorrectWord, wordCurrentlyInBlank) => {
      if (isInternallyCompleted || !wordCurrentlyInBlank) return

      setCurrentSentences((prevSentences) =>
        prevSentences.map((sentence) => ({
          ...sentence,
          parts: sentence.parts.map((part) => {
            if (
              part.type === 'blank' &&
              part.correctWord === blankCorrectWord
            ) {
              return { ...part, currentWord: null }
            }
            return part
          }),
        }))
      )

      const newAvailableWords = [...initialWords]
      if (!newAvailableWords.includes(wordCurrentlyInBlank)) {
        newAvailableWords.push(wordCurrentlyInBlank)
      }
      onWordsChanged(newAvailableWords.sort(() => Math.random() - 0.5))
    },
    [initialWords, onWordsChanged, isInternallyCompleted]
  )

  const checkAnswers = () => {
    let allCorrect = true
    let firstIncorrectMessage = ''
    let firstIncorrectHint = ''

    for (const sentence of currentSentences) {
      for (const part of sentence.parts) {
        if (part.type === 'blank') {
          if (part.currentWord === null) {
            allCorrect = false
            firstIncorrectMessage = `Hay espacios vacíos. Asegúrate de completar todas las oraciones.`
            firstIncorrectHint = `Busca los espacios que dicen '______'.`
            break
          }
          if (part.currentWord !== part.correctWord) {
            allCorrect = false
            firstIncorrectMessage = `La palabra "${part.currentWord}" no es correcta en el espacio para "${part.translation}".`
            firstIncorrectHint = part.hint || `Intenta con otra palabra.`
            break
          }
        }
      }
      if (!allCorrect) break
    }

    if (allCorrect) {
      setIsInternallyCompleted(true)
      onActivityComplete(true)
    } else {
      setFeedbackMessage(firstIncorrectMessage)
      setFeedbackHint(firstIncorrectHint)
      setShowFeedbackModal(true)
    }
  }

  // CORRECCIÓN: Eliminado el bloque if vacío.
  const getBlankDisplayClass = (part) => {
    let className = 'blank-spot'
    if (isInternallyCompleted) {
      // Solo aplicar clases de solución si se ha presionado "Comprobar" y hay una palabra
      if (part.currentWord !== null) {
        if (part.currentWord === part.correctWord) {
          className += ' correct-solution'
        } else {
          className += ' incorrect-solution'
        }
      }
      // Si part.currentWord es null después de comprobar, no se añade clase extra
      // a menos que quieras una específica como 'unfilled-after-check'.
    }
    return className
  }

  return (
    <div className="drag-drop-activity-content">
      <h3>{activityData.instructions}</h3>
      {currentSentences.map((sentence) => (
        <p key={sentence.id} className="sentence-line">
          {sentence.parts.map((part, pIndex) => {
            if (part.type === 'text' || part.type === '.') {
              return (
                <span key={`${sentence.id}-text-${pIndex}`}>
                  {part.value || part.word}
                </span>
              )
            } else if (part.type === 'blank') {
              return (
                <Blank
                  key={`${sentence.id}-blank-${pIndex}`}
                  currentWord={part.currentWord}
                  onDropBlank={(droppedWord) =>
                    handleDropOnBlank(part.correctWord, droppedWord)
                  }
                  correctWord={part.correctWord}
                  onClickBlank={handleClickOnBlank}
                  computedClassName={getBlankDisplayClass(part)}
                />
              )
            }
            return null
          })}
        </p>
      ))}
      {!isInternallyCompleted && (
        <button onClick={checkAnswers} className="check-button">
          Comprobar
        </button>
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
