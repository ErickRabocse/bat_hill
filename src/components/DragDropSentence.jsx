// src/components/DragDropSentence.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import FeedbackModal from './FeedbackModal'
import './DragDropSentence.css'

const ItemTypes = { WORD: 'word' }

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
      onDropBlank(item.word, correctWord)
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
      {' '}
      {currentWord || '______'}{' '}
    </span>
  )
}

function DragDropSentence({
  activityData,
  onActivityComplete,
  initialWords, // Prop crucial: representa el estado actual del banco de palabras desde App.jsx
  onWordsChanged, // Prop para notificar a App.jsx los cambios en el banco
  isShowingTextDuringActivity,
  onToggleActivityView,
  isGlanceButtonDisabled,
}) {
  const [currentSentences, setCurrentSentences] = useState([])
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackHint, setFeedbackHint] = useState('')
  const [isInternallyCompleted, setIsInternallyCompleted] = useState(false)

  const resetInternalState = useCallback(() => {
    if (activityData && activityData.sentences) {
      const initialSentenceStates = activityData.sentences.map((sentence) => ({
        ...sentence,
        parts: sentence.parts.map((part) =>
          part.type === 'blank' ? { ...part, currentWord: null } : part
        ),
      }))
      setCurrentSentences(initialSentenceStates)
    } else {
      setCurrentSentences([])
    }
    setIsInternallyCompleted(false)
  }, [activityData])

  useEffect(() => {
    // Este console.log ya no usa 'initialWords'
    console.log(
      '[DragDropSentence.jsx] activityData o resetInternalState cambió. Reseteando estado interno de las oraciones.'
    )
    resetInternalState()
  }, [activityData, resetInternalState]) // Dependencias correctas

  const handleDropOnBlank = useCallback(
    (droppedWord, targetBlankCorrectWord) => {
      if (isInternallyCompleted) return

      let wordMovedFromOtherBlank = false

      setCurrentSentences((prevSentences) =>
        prevSentences.map((sentence) => ({
          ...sentence,
          parts: sentence.parts.map((part) => {
            if (
              part.type === 'blank' &&
              part.correctWord === targetBlankCorrectWord
            ) {
              // La palabra que estaba antes aquí (part.currentWord) se sobrescribe.
              // No se añade de nuevo al banco desde esta acción.
              return { ...part, currentWord: droppedWord }
            }
            if (part.type === 'blank' && part.currentWord === droppedWord) {
              // Si la palabra soltada se tomó de OTRO blank, vaciar ese otro blank.
              wordMovedFromOtherBlank = true
              return { ...part, currentWord: null }
            }
            return part
          }),
        }))
      )

      let newAvailableWords = [...initialWords] // Usar una copia del banco actual
      if (!wordMovedFromOtherBlank && initialWords.includes(droppedWord)) {
        // Si la palabra vino del banco (estaba en initialWords) Y no se movió entre blanks,
        // entonces se elimina del banco.
        newAvailableWords = newAvailableWords.filter((w) => w !== droppedWord)
        console.log(
          `[DragDropSentence.jsx] Palabra '${droppedWord}' usada desde el banco y ELIMINADA. Banco ahora: ${JSON.stringify(
            newAvailableWords
          )}`
        )
      }
      // Las palabras reemplazadas en un blank NO regresan al banco automáticamente desde esta función.

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
              part.correctWord === blankCorrectWord &&
              part.currentWord === wordCurrentlyInBlank
            ) {
              return { ...part, currentWord: null }
            }
            return part
          }),
        }))
      )

      let newAvailableWords = [...initialWords] // Usar una copia del banco actual
      if (
        wordCurrentlyInBlank &&
        !newAvailableWords.includes(wordCurrentlyInBlank)
      ) {
        newAvailableWords.push(wordCurrentlyInBlank) // Palabra regresa al banco
      }
      console.log(
        `[DragDropSentence.jsx] Palabra '${wordCurrentlyInBlank}' devuelta al banco desde un blank. Banco ahora: ${JSON.stringify(
          newAvailableWords
        )}`
      )
      onWordsChanged(newAvailableWords)
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
            firstIncorrectMessage = `La palabra "${part.currentWord}" no es correcta para "${part.translation}".`
            firstIncorrectHint = part.hint || `Intenta con otra palabra.`
            break
          }
        }
      }
      if (!allCorrect) break
    }
    if (allCorrect) {
      setIsInternallyCompleted(true)
      onActivityComplete(true) // Llamar a onActivityComplete
    } else {
      setFeedbackMessage(firstIncorrectMessage) // Usar setFeedbackMessage
      setFeedbackHint(firstIncorrectHint) // Usar setFeedbackHint
      setShowFeedbackModal(true)
    }
  }
  const getBlankDisplayClass = (part) => {
    let className = 'blank-spot'
    if (isInternallyCompleted) {
      if (part.currentWord !== null) {
        if (part.currentWord === part.correctWord) {
          className += ' correct-solution'
        } else {
          className += ' incorrect-solution'
        }
      }
    }
    return className
  }

  return (
    <div className="drag-drop-activity-content">
      <h3>{activityData.instructions}</h3>
      {currentSentences.map((sentence) => (
        <p key={sentence.id} className="sentence-line">
          {' '}
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
                  onDropBlank={handleDropOnBlank}
                  correctWord={part.correctWord}
                  onClickBlank={handleClickOnBlank}
                  computedClassName={getBlankDisplayClass(part)}
                />
              )
            }
            return null
          })}{' '}
        </p>
      ))}
      {!isInternallyCompleted && (
        <div className="exercise-action-buttons">
          {' '}
          <button
            onClick={checkAnswers}
            className="check-button"
            disabled={isShowingTextDuringActivity || isGlanceButtonDisabled}
          >
            {' '}
            Comprobar{' '}
          </button>{' '}
          <button
            onClick={onToggleActivityView}
            className="toggle-activity-view-button"
            disabled={isGlanceButtonDisabled}
          >
            {' '}
            {isShowingTextDuringActivity ? 'Ver Ejercicio' : 'Ver Texto'}{' '}
          </button>{' '}
        </div>
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
