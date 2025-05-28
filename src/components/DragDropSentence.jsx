// components/DragDropSentence.jsx

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

function DragDropSentence({
  activityData,
  onActivityComplete,
  initialWords, // Palabras disponibles desde App.jsx
  onWordsChanged, // Callback para notificar a App.jsx cambios en el banco de palabras
}) {
  const [currentSentences, setCurrentSentences] = useState(() => {
    console.log(
      'DragDropSentence: INICIALIZANDO/REINICIALIZANDO estado currentSentences. Activity ID:',
      activityData?.sentences?.[0]?.id.substring(
        0,
        activityData.sentences[0].id.lastIndexOf('_')
      )
    )
    return activityData.sentences.map((sentence) => ({
      ...sentence,
      parts: sentence.parts.map((part) =>
        part.type === 'blank' ? { ...part, currentWord: null } : part
      ),
    }))
  })

  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackHint, setFeedbackHint] = useState('')
  const [isActivityCompleted, setIsActivityCompleted] = useState(false)

  useEffect(() => {
    console.log(
      'DragDropSentence: useEffect detectó un CAMBIO en currentSentences. Nuevo valor:',
      JSON.parse(JSON.stringify(currentSentences))
    )
  }, [currentSentences])

  const handleDropBlank = useCallback(
    (blankCorrectWord, droppedWord) => {
      console.log(
        'DragDropSentence: Inicio de handleDropBlank. Palabra soltada:',
        droppedWord,
        'en blank para:',
        blankCorrectWord
      )
      console.log(
        'DragDropSentence: currentSentences ANTES (leído al inicio de useCallback):',
        JSON.parse(JSON.stringify(currentSentences))
      )

      if (isActivityCompleted) return

      // --- Parte 1: Determinar si una palabra se devuelve al banco desde el blank objetivo ---
      // Esto usa 'currentSentences' del scope de useCallback (que debería ser el más reciente del último render)
      let wordToReturnToBank = null
      for (const sentence of currentSentences) {
        const targetPart = sentence.parts.find(
          (p) => p.type === 'blank' && p.correctWord === blankCorrectWord
        )
        if (targetPart) {
          // Encontramos la sentencia con el blank objetivo
          if (
            targetPart.currentWord &&
            targetPart.currentWord !== droppedWord
          ) {
            wordToReturnToBank = targetPart.currentWord
          }
          break // Salimos del bucle de sentencias una vez encontrado el blank
        }
      }

      // --- Parte 2: Actualizar el banco de palabras (availableWords en App.jsx) ---
      // Esto usa 'initialWords' (prop) y 'wordToReturnToBank' (calculado arriba).
      let newAvailableWords = [...initialWords]
      if (wordToReturnToBank) {
        if (!newAvailableWords.includes(wordToReturnToBank)) {
          newAvailableWords.push(wordToReturnToBank)
        }
      }
      const indexOfDroppedWord = newAvailableWords.indexOf(droppedWord)
      if (indexOfDroppedWord > -1) {
        newAvailableWords.splice(indexOfDroppedWord, 1)
      } else {
        console.warn(
          `Palabra soltada "${droppedWord}" no se encontró en el banco para eliminarla (handleDropBlank).`
        )
      }
      onWordsChanged(newAvailableWords) // Notificar a App.jsx

      // --- Parte 3: Actualizar el estado de las oraciones (currentSentences) ---
      // Usamos la forma funcional de setCurrentSentences para asegurar que operamos sobre el estado más fresco.
      setCurrentSentences((prevCurrentSentences) => {
        console.log(
          'DragDropSentence: Dentro del updater de setCurrentSentences (handleDropBlank). prevCurrentSentences:',
          JSON.parse(JSON.stringify(prevCurrentSentences))
        )

        const newSentences = prevCurrentSentences.map((sentence) => ({
          ...sentence,
          parts: sentence.parts.map((part) => {
            if (
              part.type === 'blank' &&
              part.correctWord === blankCorrectWord
            ) {
              // La lógica de wordToReturnToBank para onWordsChanged ya se hizo arriba.
              // Aquí solo colocamos la nueva palabra.
              return { ...part, currentWord: droppedWord }
            }
            return part
          }),
        }))

        console.log(
          'DragDropSentence: newSentences calculado DENTRO del updater (handleDropBlank):',
          JSON.parse(JSON.stringify(newSentences))
        )
        return newSentences
      })
    },
    [currentSentences, initialWords, isActivityCompleted, onWordsChanged]
  ) // Dependencias de useCallback

  const handleRemoveWordFromBlank = useCallback(
    (blankCorrectWord) => {
      console.log(
        'DragDropSentence: Inicio de handleRemoveWordFromBlank para blank:',
        blankCorrectWord
      )
      console.log(
        'DragDropSentence: currentSentences ANTES (leído al inicio de useCallback en remove):',
        JSON.parse(JSON.stringify(currentSentences))
      )

      if (isActivityCompleted) return

      let wordThatWasInBlank = null
      // Determinar qué palabra estaba en el blank para devolverla al banco
      // Se usa 'currentSentences' del scope del useCallback
      for (const sentence of currentSentences) {
        const targetPart = sentence.parts.find(
          (p) =>
            p.type === 'blank' &&
            p.correctWord === blankCorrectWord &&
            p.currentWord
        )
        if (targetPart) {
          wordThatWasInBlank = targetPart.currentWord
          break
        }
      }

      // Actualizar el banco de palabras si se encontró una palabra para devolver
      if (wordThatWasInBlank) {
        let newAvailableWords = [...initialWords] // Usa 'initialWords' de la prop
        if (!newAvailableWords.includes(wordThatWasInBlank)) {
          newAvailableWords.push(wordThatWasInBlank)
        }
        onWordsChanged(newAvailableWords) // Notificar a App.jsx
      }

      // Actualizar el estado de las oraciones para quitar la palabra del blank
      setCurrentSentences((prevCurrentSentences) => {
        console.log(
          'DragDropSentence: Dentro del updater de setCurrentSentences (handleRemoveWordFromBlank). prevCurrentSentences:',
          JSON.parse(JSON.stringify(prevCurrentSentences))
        )
        const updatedSentences = prevCurrentSentences.map((sentence) => ({
          ...sentence,
          parts: sentence.parts.map((part) => {
            if (
              part.type === 'blank' &&
              part.correctWord === blankCorrectWord &&
              part.currentWord // Es importante verificar part.currentWord de prevCurrentSentences aquí
            ) {
              return { ...part, currentWord: null }
            }
            return part
          }),
        }))
        console.log(
          'DragDropSentence: newSentences calculado DENTRO del updater (handleRemoveWordFromBlank):',
          JSON.parse(JSON.stringify(updatedSentences))
        )
        return updatedSentences
      })
    },
    [currentSentences, initialWords, isActivityCompleted, onWordsChanged]
  ) // Dependencias de useCallback

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
