// src/components/PracticeExercise.jsx
import React, { useState, useEffect } from 'react' // 1. AÑADIDO: useEffect a la importación

export function PracticeExercise({ practiceData, onPracticeComplete }) {
  // --- ESTADOS DEL JUEGO ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [streak, setStreak] = useState(0)
  const [gameState, setGameState] = useState('identifying_error')
  const [selectedWord, setSelectedWord] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)

  useEffect(() => {
    if (lives <= 0) {
      setFeedback('¡Oh no! Te has quedado sin vidas.')
      setIsGameOver(true)
    }
  }, [lives])

  const handleCheckAnswer = (event) => {
    event.preventDefault()
    if (isGameOver) return
    const correctAnswer = currentQuestion.correction.toLowerCase()
    const userAnswerClean = userAnswer.trim().toLowerCase()

    if (userAnswerClean === correctAnswer) {
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > 0 && newStreak % 3 === 0) {
        setLives((prevLives) => prevLives + 1)
        setFeedback('¡Correcto! ¡Ganaste una vida extra por tu racha!')
      } else {
        setFeedback('¡Muy bien! Respuesta correcta.')
      }
      const isLastQuestion =
        currentQuestionIndex === practiceData.questions.length - 1
      setTimeout(() => {
        if (isLastQuestion) {
          onPracticeComplete(lives)
        } else {
          setFeedback('')
          setUserAnswer('')
          setGameState('identifying_error') // Volvemos a la etapa de identificar
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        }
      }, 1500)
    } else {
      setFeedback('Respuesta incorrecta. ¡Inténtalo de nuevo!')
      setLives((prevLives) => prevLives - 1)
      setStreak(0)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setLives(3)
    setStreak(0)
    setFeedback('')
    setUserAnswer('')
    setGameState('identifying_error')
    setIsGameOver(false)
  }

  const handleOptionClick = (clickedOption) => {
    if (gameState !== 'identifying_error') return
    if (clickedOption.isError) {
      setFeedback('')
      setSelectedWord(clickedOption.word)
      setGameState('correcting_error')
    } else {
      setLives((prevLives) => prevLives - 1)
      setStreak(0)
      setFeedback(
        `'${clickedOption.word}' es una palabra correcta. Intenta de nuevo.`
      )
    }
  }

  const currentQuestion = practiceData.questions[currentQuestionIndex]

  // Si no hay más preguntas (porque ganaste), onPracticeComplete ya fue llamado.
  // Mostramos un mensaje intermedio antes de que App.jsx cambie la vista.
  if (!currentQuestion) {
    return (
      <div className="practice-exercise-container">
        <h2>¡Felicidades!</h2>
        <p>Has completado todos los ejercicios.</p>
      </div>
    )
  }

  // --- RENDERIZADO ---
  // REEMPLAZA TU RETURN COMPLETO CON ESTE
  return (
    <div className="practice-exercise-container">
      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-box">
            <h2>Game Over</h2>
            <p>{feedback}</p>
            <button onClick={handleRestart}>Intentar de Nuevo</button>
          </div>
        </div>
      )}

      {/* --- Encabezado y Vidas --- */}
      <div className="practice-header">
        <h1>{practiceData.topic}</h1>
        <div className="lives-container">
          <span>Vidas:</span> {'❤️'.repeat(lives)}
        </div>
      </div>
      <h2>
        Pregunta {currentQuestionIndex + 1} de {practiceData.questions.length}
      </h2>

      {/* --- INSTRUCCIONES DINÁMICAS (AJUSTE 1) --- */}
      <p className="instructions">
        {gameState === 'identifying_error'
          ? `El error está en ${currentQuestion.focus}. ¡Haz clic en la palabra incorrecta!`
          : `¡Correcto! Ahora, escribe la palabra correcta y presiona "Comprobar".`}
      </p>
      <hr />

      {/* --- FORMULARIO QUE ENVUELVE LA ORACIÓN Y EL BOTÓN --- */}
      <form onSubmit={handleCheckAnswer}>
        {/* Banco de Palabras (solo en etapa de corrección) */}
        {gameState === 'correcting_error' && (
          <div className="answer-bank">
            <h3>Opciones de Respuesta:</h3>
            <div className="bank-words">
              {currentQuestion.answerBank.map((word) => (
                <span key={word} className="bank-word">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Oración con INPUT INTEGRADO (AJUSTE 2) */}
        {/* Oración con INPUT INTEGRADO */}
        <div className="sentence-display">
          {currentQuestion.sentence.map((word, index) => {
            // --- ESTA ES LA LÓGICA CORREGIDA ---
            // Si estamos en la etapa de corrección Y la palabra actual es la palabra del error...
            if (gameState === 'correcting_error' && word === selectedWord) {
              // ...la reemplazamos por el campo de texto.
              return (
                <input
                  key={index}
                  type="text"
                  className="correction-input"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  autoFocus
                  style={{
                    minWidth: '100px',
                    width: `${currentQuestion.correction.length * 1.2}ch`,
                  }}
                />
              )
            }

            // Si estamos en la etapa de identificar, vemos si la palabra es una opción clickeable.
            const optionData = currentQuestion.options.find(
              (opt) => opt.word === word
            )
            if (optionData && gameState === 'identifying_error') {
              return (
                <span
                  key={index}
                  className="error-option"
                  onClick={() => handleOptionClick(optionData)}
                >
                  {word}
                </span>
              )
            }

            // En cualquier otro caso, es solo texto normal.
            return <span key={index}> {word} </span>
          })}
        </div>

        {/* Botón de Comprobar CENTRADO (AJUSTE 3) */}
        {gameState === 'correcting_error' && (
          <div className="check-answer-area">
            <button type="submit" className="check-answer-button">
              Comprobar
            </button>
          </div>
        )}
      </form>

      {/* Feedback para el usuario (ahora solo para errores) */}
      <div className="feedback-display">{feedback}</div>
    </div>
  )
}
