// src/components/DragDropSentence.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
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
      console.log(
        `[BlankComponent] Palabra '${item.word}' SOLTADA sobre blank con correctWord: '${correctWord}'`
      )
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
        padding: '0 0.2em', // Añadir un poco de padding para que no se vea tan pegado el texto
      }}
      onClick={() => onClickBlank(correctWord, currentWord)}
    >
      {currentWord || '______'}
    </span>
  )
}

const DragDropSentence = forwardRef(
  (
    {
      activityData,
      onActivityComplete,
      onBlanksStateChange,
      isInternallyCompletedProp,
    },
    ref
  ) => {
    const [currentSentences, setCurrentSentences] = useState([])
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [feedbackHint, setFeedbackHint] = useState('')
    const [isInternallyCompleted, setIsInternallyCompleted] = useState(
      !!isInternallyCompletedProp
    )

    useEffect(() => {
      setIsInternallyCompleted(!!isInternallyCompletedProp)
    }, [isInternallyCompletedProp])

    // En DragDropSentence.jsx

    const notifyBlanksChange = useCallback(
      (sentencesToReport, actionContext = '') => {
        if (onBlanksStateChange) {
          const wordsInBlanks = new Set()
          ;(sentencesToReport || []).forEach((sentence) => {
            ;(sentence.parts || []).forEach((part) => {
              if (part.type === 'blank' && part.currentWord) {
                wordsInBlanks.add(part.currentWord)
              }
            })
          })
          console.log(
            `[DragDropSentence.jsx] ${actionContext} - Notificando a App.jsx. Palabras en blanks:`,
            Array.from(wordsInBlanks)
          )
          onBlanksStateChange(wordsInBlanks)
        }
      },
      [onBlanksStateChange]
    )

    const resetInternalState = useCallback(() => {
      if (
        activityData &&
        activityData.sentences &&
        Array.isArray(activityData.sentences)
      ) {
        const initialSentenceStates = activityData.sentences.map(
          (sentence) => ({
            ...sentence,
            parts: sentence.parts.map((part) =>
              part.type === 'blank' ? { ...part, currentWord: null } : part
            ),
          })
        )
        setCurrentSentences(initialSentenceStates)
        notifyBlanksChange(initialSentenceStates)
      } else {
        setCurrentSentences([])
        notifyBlanksChange([])
      }
      setIsInternallyCompleted(false)
    }, [activityData, notifyBlanksChange])

    useEffect(() => {
      resetInternalState()
    }, [activityData, resetInternalState])

    const handleDropOnBlank = useCallback(
      (droppedWordParam, targetBlankCorrectWordParam) => {
        if (isInternallyCompleted) return
        let newSentencesState
        setCurrentSentences((prevSentences) => {
          newSentencesState = prevSentences.map((sentence) => ({
            ...sentence,
            parts: sentence.parts.map((part) => {
              if (
                part.type === 'blank' &&
                part.correctWord === targetBlankCorrectWordParam
              ) {
                return { ...part, currentWord: droppedWordParam }
              }
              if (
                part.type === 'blank' &&
                part.currentWord === droppedWordParam &&
                part.correctWord !== targetBlankCorrectWordParam
              ) {
                return { ...part, currentWord: null }
              }
              return part
            }),
          }))
          return newSentencesState
        })
        if (newSentencesState) notifyBlanksChange(newSentencesState)
      },
      [isInternallyCompleted, notifyBlanksChange]
    )

    // En DragDropSentence.jsx

    const handleClickOnBlank = useCallback(
      (blankCorrectWordParam, wordCurrentlyInBlankParam) => {
        if (isInternallyCompleted || !wordCurrentlyInBlankParam) return

        console.log(
          `[DragDropSentence.jsx] handleClickOnBlank - Palabra a quitar: '${wordCurrentlyInBlankParam}' del blank con correctWord: '${blankCorrectWordParam}'`
        )

        let newSentencesState
        setCurrentSentences((prevSentences) => {
          newSentencesState = prevSentences.map((sentence) => ({
            ...sentence,
            parts: sentence.parts.map((part) => {
              if (
                part.type === 'blank' &&
                part.correctWord === blankCorrectWordParam &&
                part.currentWord === wordCurrentlyInBlankParam
              ) {
                return { ...part, currentWord: null }
              }
              return part
            }),
          }))
          return newSentencesState
        })

        // Es crucial que notifyBlanksChange se llame con el estado actualizado.
        // Si newSentencesState se actualiza correctamente y se pasa a notifyBlanksChange, App.jsx recibirá la información correcta.
        if (newSentencesState) {
          // Asegurarse de que newSentencesState tiene un valor (después de la actualización síncrona del closure)
          notifyBlanksChange(
            newSentencesState,
            `handleClickOnBlank quitando '${wordCurrentlyInBlankParam}'`
          )
        } else {
          // Esto podría pasar si setCurrentSentences no actualiza newSentencesState inmediatamente en este scope,
          // lo cual es el comportamiento normal de setState.
          // Para mayor robustez, la notificación se hace en un useEffect que depende de currentSentences.
          // (Ya tenemos ese useEffect en la última versión que te di).
          console.warn(
            '[DragDropSentence.jsx] handleClickOnBlank: newSentencesState no estaba disponible inmediatamente. La notificación se hará vía useEffect[currentSentences].'
          )
        }
      },
      [isInternallyCompleted, notifyBlanksChange]
    ) // notifyBlanksChange es una dependencia

    // En DragDropSentence.jsx

    // Efecto para notificar a App.jsx cuando cambian las palabras en los blanks
    useEffect(() => {
      // No necesitamos un actionContext específico aquí, o podemos poner uno genérico
      notifyBlanksChange(currentSentences, 'useEffect[currentSentences]')
    }, [currentSentences, notifyBlanksChange]) // Se ejecuta cada vez que currentSentences cambia

    const checkAnswersInternal = () => {
      if (isInternallyCompleted) return
      let allCorrect = true
      let firstIncorrectMessage = ''
      let firstIncorrectHint = ''
      if (!currentSentences || currentSentences.length === 0) {
        allCorrect = false
        firstIncorrectMessage = 'No hay oraciones para comprobar.'
      } else {
        for (const sentence of currentSentences) {
          if (!sentence.parts || !Array.isArray(sentence.parts)) continue
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
      }
      if (allCorrect) {
        setIsInternallyCompleted(true)
        if (onActivityComplete) onActivityComplete(true)
      } else {
        setFeedbackMessage(firstIncorrectMessage)
        setFeedbackHint(firstIncorrectHint)
        setShowFeedbackModal(true)
      }
    }
    const getBlankDisplayClass = (part) => {
      let className = 'blank-spot'
      if (
        isInternallyCompleted ||
        (isInternallyCompletedProp &&
          part.currentWord &&
          part.currentWord === part.correctWord)
      ) {
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

    useImperativeHandle(ref, () => ({
      triggerCheckAnswers: checkAnswersInternal,
      resetActivityState: resetInternalState,
    }))

    if (!currentSentences || currentSentences.length === 0) {
      if (
        activityData &&
        activityData.sentences &&
        Array.isArray(activityData.sentences) &&
        activityData.sentences.length > 0
      ) {
        return (
          <div
            className="drag-drop-activity-content"
            style={{
              padding: '20px',
              border: '1px solid orange',
              color: 'var(--text-color)',
              minHeight: '100px',
            }}
          >
            Cargando oraciones del ejercicio...
          </div>
        )
      }
      return (
        <div
          className="drag-drop-activity-content"
          style={{
            padding: '20px',
            border: '1px solid red',
            color: 'var(--text-color)',
            minHeight: '100px',
          }}
        >
          <p>No hay ejercicio definido para esta escena.</p>
        </div>
      )
    }

    return (
      <div className="drag-drop-activity-content">
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
)

export default DragDropSentence
