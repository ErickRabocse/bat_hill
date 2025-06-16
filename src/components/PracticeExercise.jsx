// src/components/PracticeExercise.jsx
import React, { useState, useEffect } from 'react'

export function PracticeExercise({ practiceData, onPracticeComplete }) {
  // --- ESTADOS DEL JUEGO ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameState, setGameState] = useState('identifying_error')
  const [feedback, setFeedback] = useState({ msg: '', type: 'info' })
  const [userAnswer, setUserAnswer] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)

  // --- LÓGICA DEL JUEGO ---

  // Efecto que vigila las vidas para terminar el juego
  useEffect(() => {
    if (lives <= 0) {
      setFeedback({ msg: '¡Oh no! Te has quedado sin vidas.', type: 'error' })
      setIsGameOver(true)
    }
  }, [lives])

  // Maneja el clic en una de las palabras de la oración
  const handleOptionClick = (clickedOption) => {
    if (gameState !== 'identifying_error' || isGameOver) return

    if (clickedOption.isError) {
      setFeedback({ msg: '', type: 'info' })
      setGameState('correcting_error') // Pasa a la etapa de corrección
    } else {
      setLives((prevLives) => prevLives - 1)
      setFeedback({
        msg: `'${clickedOption.word}' es una palabra correcta. Intenta de nuevo.`,
        type: 'error',
      })
    }
  }

  // Maneja el envío de la respuesta escrita
  const handleCheckAnswer = (event) => {
    event.preventDefault()
    if (isGameOver) return

    const correctAnswer = currentQuestion.correction.toLowerCase()
    const userAnswerClean = userAnswer.trim().toLowerCase()

    if (userAnswerClean === correctAnswer) {
      setFeedback({ msg: '¡Muy bien! Respuesta correcta.', type: 'success' })
      const isLastQuestion =
        currentQuestionIndex === practiceData.questions.length - 1

      setTimeout(() => {
        if (isLastQuestion) {
          onPracticeComplete(lives) // Llama al padre para indicar la victoria
        } else {
          // Prepara la siguiente pregunta
          setFeedback({ msg: '', type: 'info' })
          setUserAnswer('')
          setGameState('identifying_error')
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
        }
      }, 1500)
    } else {
      setFeedback({
        msg: 'Respuesta incorrecta. ¡Inténtalo de nuevo!',
        type: 'error',
      })
      setLives((prevLives) => prevLives - 1)
    }
  }

  // Reinicia el juego desde la pantalla de Game Over
  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setLives(3)
    setFeedback({ msg: '', type: 'info' })
    setUserAnswer('')
    setGameState('identifying_error')
    setIsGameOver(false)
  }

  const currentQuestion = practiceData.questions[currentQuestionIndex]

  // Mensaje de victoria antes de que App.jsx cambie de vista
  if (!currentQuestion && !isGameOver) {
    return (
      <div className="practice-exercise-container">
        <h2>¡Felicidades!</h2>
        <p>Has completado todos los ejercicios.</p>
      </div>
    )
  }

  // --- RENDERIZADO DEL COMPONENTE ---
  // Por favor, reemplaza todo tu return con este bloque final
  return (
    <div className="practice-exercise-container">
      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-box">
            <h2>Game Over</h2>
            <p>{feedback.msg}</p>
            <button onClick={handleRestart}>Intentar de Nuevo</button>
          </div>
        </div>
      )}

      <div className="practice-header">
        <h1 className="practice-topic-title">{practiceData.topic}</h1>
        <div className="lives-container">
          <span>Vidas:</span> {'❤️'.repeat(lives)}
        </div>
      </div>

      <p className="instructions">
        {gameState === 'identifying_error' ? (
          <>
            Haz clic en la palabra "incorrecta".
            <ul>
              <li> El error está en {currentQuestion.focus}</li>
              <li>
                Probablemente es una palabra que no encaja con lo que ocurre en
                la historia
              </li>
            </ul>
          </>
        ) : (
          <>¡Muy bien! Ahora escribe la corrección y presiona “Comprobar”.</>
        )}
      </p>

      <div className="progress-bar-container">
        <div className="progress-bar-outer">
          <div
            className="progress-bar-inner"
            style={{
              width: `${
                (currentQuestionIndex / practiceData.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleCheckAnswer}>
        {gameState === 'correcting_error' && (
          <div className="answer-bank">
            <h2>Opciones de Respuesta:</h2>
            <div className="bank-words">
              {currentQuestion.answerBank.map((word) => (
                <span key={word} className="bank-word">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* --- ESTA ES LA LÓGICA DE RENDERIZADO CORREGIDA Y FINAL --- */}
        <div className="sentence-display">
          {currentQuestion.sentence.map((word, index) => {
            // Si estamos en la etapa de corrección y esta es la palabra del error...
            if (
              gameState === 'correcting_error' &&
              word.trim() === currentQuestion.error.trim()
            ) {
              // ...la reemplazamos por el campo de texto.
              return (
                <input
                  key={`${currentQuestion.id}-input`}
                  type="text"
                  className="correction-input"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  autoFocus
                  style={{
                    minWidth: '100px',
                    width: `${currentQuestion.correction.length * 1.5}ch`,
                  }}
                />
              )
            }

            // Si estamos en la etapa de identificar, vemos si es una opción clickeable.
            const optionData = currentQuestion.options.find(
              (opt) => opt.word === word
            )
            if (optionData && gameState === 'identifying_error') {
              return (
                <span
                  key={`${currentQuestion.id}-option-${index}`}
                  className="error-option"
                  onClick={() => handleOptionClick(optionData)}
                >
                  {word}
                </span>
              )
            }

            // En cualquier otro caso, es solo texto normal.
            return (
              <span key={`${currentQuestion.id}-word-${index}`}> {word} </span>
            )
          })}
        </div>

        {gameState === 'correcting_error' && (
          <div className="check-answer-area">
            <button
              type="submit"
              className="check-answer-button"
              disabled={feedback.type === 'success'}
            >
              Comprobar
            </button>
          </div>
        )}
      </form>

      <div className={`feedback-display feedback--${feedback.type}`}>
        {feedback.msg}
      </div>
    </div>
  )
}
