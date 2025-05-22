// En App.jsx

import { useEffect, useState, useRef } from 'react'
import Word from './Word'
import chapters from './chapters'
import ChapterSelector from './components/ChapterSelector'
import DragDropSentence from './components/DragDropSentence'
import { motion, AnimatePresence } from 'framer-motion'
import './app.css'

// Constantes para la lógica de los vistazos y el temporizador
const MAX_GLANCES_ALLOWED = 2
const LOCK_DURATION_MS = 3 * 60 * 1000

function App() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex')
    return saved !== null ? parseInt(saved, 10) : 2
  })

  const [isActivityCompleted, setIsActivityCompleted] = useState(() => {
    const savedActivities = localStorage.getItem('completedActivities')
    return savedActivities ? JSON.parse(savedActivities) : {}
  })

  const [showActivity, setShowActivity] = useState(false)
  const [isTextBlurred, setIsTextBlurred] = useState(false)

  const [glanceCount, setGlanceCount] = useState(() => {
    const savedGlanceData = localStorage.getItem('glanceData')
    if (savedGlanceData) {
      const data = JSON.parse(savedGlanceData)
      if (
        data.currentChapterIndex === chapterIndex &&
        data.currentSceneIndex === sceneIndex
      ) {
        return data.count
      }
    }
    return MAX_GLANCES_ALLOWED
  })

  const [lockTimestamp, setLockTimestamp] = useState(() => {
    const savedGlanceData = localStorage.getItem('glanceData')
    if (savedGlanceData) {
      const data = JSON.parse(savedGlanceData)
      if (
        data.currentChapterIndex === chapterIndex &&
        data.currentSceneIndex === sceneIndex
      ) {
        return data.lockUntil
      }
    }
    return null
  })
  const [remainingLockTime, setRemainingLockTime] = useState(0)
  const lockTimerRef = useRef(null)

  const currentChapter = chapters[chapterIndex]
  const currentScene = currentChapter.scenes[sceneIndex]
  const hasActivity = currentScene.activity !== undefined
  const currentActivityId = `${chapterIndex}-${sceneIndex}`
  const activityIsCompletedForCurrentScene =
    isActivityCompleted[currentActivityId]

  const isActivityLocked = lockTimestamp && lockTimestamp > Date.now()

  const isChapterSelectorDisabled =
    hasActivity && !activityIsCompletedForCurrentScene && showActivity

  // Cálculo del progreso
  const completedScenesInCurrentChapter = currentChapter.scenes.filter(
    (scene, index) => {
      const activityId = `${chapterIndex}-${index}`
      // Si el capítulo es el 0 (introducción), todas las escenas se consideran completadas.
      if (chapterIndex === 0) return true

      // Si la escena actual es la que se está viendo, solo se cuenta si ya está completada.
      // Esto evita que las escenas futuras se cuenten como completadas antes de tiempo.
      if (index === sceneIndex) {
        return !hasActivity || activityIsCompletedForCurrentScene
      }

      // Para escenas anteriores, si tienen actividad, se consideran completadas si isActivityCompleted es true.
      // Si no tienen actividad, se consideran completadas automáticamente.
      if (scene.activity) {
        return isActivityCompleted[activityId]
      } else {
        return true // Escenas sin actividad se consideran completadas por defecto al avanzar
      }
    }
  ).length

  const chapterProgress =
    (completedScenesInCurrentChapter / currentChapter.scenes.length) * 100

  useEffect(() => {
    setShowActivity(false)
    setIsTextBlurred(false)

    const storedGlanceData = localStorage.getItem('glanceData')
    let initialGlanceCount = MAX_GLANCES_ALLOWED
    let initialLockTimestamp = null

    if (storedGlanceData) {
      const data = JSON.parse(storedGlanceData)
      if (
        data.currentChapterIndex === chapterIndex &&
        data.currentSceneIndex === sceneIndex
      ) {
        initialGlanceCount = data.count
        initialLockTimestamp = data.lockUntil
      }
    }
    setGlanceCount(initialGlanceCount)
    setLockTimestamp(initialLockTimestamp)

    const scrollableTextElement = document.querySelector('.scrollable-text')
    if (scrollableTextElement) {
      scrollableTextElement.scrollTop = 0
    }
  }, [chapterIndex, sceneIndex])

  useEffect(() => {
    if (
      hasActivity &&
      showActivity &&
      !activityIsCompletedForCurrentScene &&
      !isActivityLocked
    ) {
      setIsTextBlurred(true)
    } else {
      setIsTextBlurred(false)
    }

    if (lockTimerRef.current) {
      clearInterval(lockTimerRef.current)
    }

    if (isActivityLocked) {
      const updateTimer = () => {
        const now = Date.now()
        const remaining = lockTimestamp - now
        if (remaining > 0) {
          setRemainingLockTime(Math.ceil(remaining / 1000))
        } else {
          setLockTimestamp(null)
          setRemainingLockTime(0)
          clearInterval(lockTimerRef.current)
          lockTimerRef.current = null
          setGlanceCount(MAX_GLANCES_ALLOWED)
          setShowActivity(true)
          setIsTextBlurred(true)
        }
      }

      updateTimer()
      lockTimerRef.current = setInterval(updateTimer, 1000)
    } else {
      setRemainingLockTime(0)
    }

    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current)
        lockTimerRef.current = null
      }
    }
  }, [
    showActivity,
    hasActivity,
    activityIsCompletedForCurrentScene,
    lockTimestamp,
    isActivityLocked,
    chapterIndex,
    sceneIndex,
  ])

  useEffect(() => {
    localStorage.setItem(
      'glanceData',
      JSON.stringify({
        currentChapterIndex: chapterIndex,
        currentSceneIndex: sceneIndex,
        count: glanceCount,
        lockUntil: lockTimestamp,
      })
    )
  }, [chapterIndex, sceneIndex, glanceCount, lockTimestamp])

  useEffect(() => {
    localStorage.setItem(
      'completedActivities',
      JSON.stringify(isActivityCompleted)
    )
  }, [isActivityCompleted])

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1e1e1e' : '#fffbe6'
    document.body.style.margin = '0'
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('fontSizeIndex', fontSizeIndex.toString())
  }, [fontSizeIndex])

  const fontSizes = ['1rem', '1.25rem', '1.5rem', '1.75rem', '2rem']
  const fontSize = fontSizes[fontSizeIndex] || '1.2rem'

  const [activeWord, setActiveWord] = useState(null)

  const getPreferredVoice = () => {
    const voices = speechSynthesis.getVoices()
    return (
      voices.find(
        (v) =>
          v.lang === 'en-US' &&
          (v.name.includes('Google US English') ||
            v.name.includes('Microsoft Zira') ||
            v.name.includes('Microsoft Jenny') ||
            v.name.includes('Microsoft Aria') ||
            v.name.includes('Samantha') ||
            v.name.includes('Google UK English Female'))
      ) || null
    )
  }

  const speakWord = (word) => {
    const utter = new SpeechSynthesisUtterance(word)
    utter.lang = 'en-US'
    utter.rate = 1
    const preferred = getPreferredVoice()
    if (preferred) utter.voice = preferred
    speechSynthesis.cancel()
    speechSynthesis.speak(utter)
    setActiveWord(word)
  }

  const handleChapterChange = (newIndex) => {
    setChapterIndex(newIndex)
    setSceneIndex(0)
  }

  const getGlobalSceneNumber = () => {
    if (chapterIndex === 0) return null
    let page = 0
    for (let i = 1; i < chapters.length; i++) {
      if (i < chapterIndex) {
        page += chapters[i].scenes.length
      }
    }
    return page + sceneIndex + 1
  }

  const backgroundColor = darkMode ? '#1e1e1e' : '#fffbe6'
  const textColor = darkMode ? '#f0f0f0' : '#333'

  const handleActivityComplete = (success) => {
    if (success) {
      setIsActivityCompleted((prev) => ({
        ...prev,
        [currentActivityId]: true,
      }))
      setIsTextBlurred(false)
    }
  }

  const handleResetActivity = () => {
    setIsActivityCompleted((prev) => {
      const newState = { ...prev }
      delete newState[currentActivityId]
      return newState
    })
    setGlanceCount(MAX_GLANCES_ALLOWED)
    setLockTimestamp(null)
    setShowActivity(true)
    setIsTextBlurred(true)
  }

  const handleToggleBlur = () => {
    if (isTextBlurred) {
      setGlanceCount((prevCount) => {
        const updatedCount = prevCount - 1
        if (updatedCount <= 0) {
          setLockTimestamp(Date.now() + LOCK_DURATION_MS)
        }
        return updatedCount
      })
    }
    setIsTextBlurred((prev) => !prev)
  }

  const nextButtonDisabled =
    (hasActivity && !activityIsCompletedForCurrentScene) || isActivityLocked

  const nextChapterAvailable =
    sceneIndex === currentChapter.scenes.length - 1 &&
    chapterIndex < chapters.length - 1 &&
    (!hasActivity || activityIsCompletedForCurrentScene)

  return (
    <div
      className={`app-container ${darkMode ? 'dark-mode' : ''}`}
      style={{ fontSize, backgroundColor, color: textColor }}
      onClick={() => setActiveWord(null)}
    >
      <div className="top-button-bar">
        {/* Lado izquierdo: Botones de Modo Oscuro y Tamaño de Fuente */}
        <div className="left-controls">
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ fontSize: '0.9rem', marginRight: '0.5rem' }}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
            style={{ marginRight: '0.25rem' }}
          >
            A-
          </button>
          <button
            onClick={() =>
              setFontSizeIndex((prev) =>
                Math.min(fontSizes.length - 1, prev + 1)
              )
            }
          >
            A+
          </button>
        </div>

        {/* Lado derecho: Indicador de progreso del capítulo y Número de Página */}
        <div className="right-indicators">
          {' '}
          {/* Nuevo div para agrupar y posicionar a la derecha */}
          {chapterIndex > 0 && ( // No mostrar progreso en la introducción
            <div className="chapter-progress-container">
              <span className="chapter-progress-text">
                Chapter {chapterIndex}: {completedScenesInCurrentChapter}/
                {currentChapter.scenes.length} completed
              </span>
              <div className="progress-bar-outer">
                <div
                  className="progress-bar-inner"
                  style={{ width: `${chapterProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          {getGlobalSceneNumber() && (
            <div className="page-number-top-right">
              Page {getGlobalSceneNumber()}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${chapterIndex}-${sceneIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="scene-layout">
            <img
              src={currentScene.image}
              alt={`Scene ${sceneIndex + 1}`}
              className="scene-image"
            />
            <div className="text-container">
              <div style={{ marginBottom: '1rem' }}>
                <h1 className="chapter-title">Luna's journey</h1>
                <div style={{ marginTop: '0.5rem' }}>
                  <ChapterSelector
                    chapters={chapters}
                    chapterIndex={chapterIndex}
                    setChapterIndex={handleChapterChange}
                    isDisabled={isChapterSelectorDisabled}
                  />
                </div>
              </div>

              {/* Contenido de la escena (texto y página) */}
              <div
                className={`scrollable-text ${
                  isTextBlurred ? 'blur-active' : ''
                }`}
              >
                {(() => {
                  const sentences = []
                  let currentSentence = []
                  currentScene.text.forEach((item, index) => {
                    currentSentence.push({ ...item, index })
                    if (['.', '!', '?'].includes(item.word)) {
                      sentences.push(currentSentence)
                      currentSentence = []
                    }
                  })
                  if (currentSentence.length) {
                    sentences.push(currentSentence)
                  }

                  return sentences.map((sentence, sIndex) => {
                    const sentenceText = sentence
                      .map((item) => item.word)
                      .join(' ')
                      .replace(/\s+([.,!?])/g, '$1')

                    const playSentence = () => {
                      const utter = new SpeechSynthesisUtterance(sentenceText)
                      utter.lang = 'en-US'
                      utter.rate = 1
                      const preferred = getPreferredVoice()
                      if (preferred) utter.voice = preferred
                      speechSynthesis.cancel()
                      speechSynthesis.speak(utter)
                    }

                    return (
                      <span key={sIndex} className="sentence-wrapper">
                        <button onClick={playSentence} className="play-button">
                          🔊
                        </button>
                        {sentence.map(
                          (
                            { word, translation, index: globalIndex },
                            localIndex
                          ) => {
                            const isPunctuation = [
                              '.',
                              ',',
                              '!',
                              '?',
                              '...',
                            ].includes(word)
                            const prevWord =
                              localIndex > 0
                                ? sentence[localIndex - 1].word
                                : ''
                            const prevIsPunctuation = [
                              '.',
                              ',',
                              '!',
                              '?',
                              '...',
                            ].includes(prevWord)

                            return (
                              <span
                                key={`${word}-${globalIndex}`}
                                style={{
                                  marginLeft: isPunctuation
                                    ? 0
                                    : prevIsPunctuation
                                    ? '0.5rem'
                                    : '0.25rem',
                                }}
                              >
                                {isPunctuation ? (
                                  word
                                ) : (
                                  <Word
                                    text={word}
                                    translation={translation}
                                    activeWord={activeWord}
                                    setActiveWord={setActiveWord}
                                    onSpeak={speakWord}
                                    fontSize={fontSize}
                                  />
                                )}
                              </span>
                            )
                          }
                        )}
                      </span>
                    )
                  })
                })()}
              </div>

              {/* Botón inicial para mostrar la actividad */}
              {hasActivity &&
                !activityIsCompletedForCurrentScene &&
                !showActivity &&
                !isActivityLocked && (
                  <button
                    onClick={() => setShowActivity(true)}
                    className="show-activity-button"
                    style={{
                      marginTop: '1.5rem',
                      marginBottom: '1.5rem',
                      width: '100%',
                    }}
                  >
                    Show Exercise
                  </button>
                )}

              {/* Contenedor del estado del ejercicio */}
              {hasActivity && (
                <div
                  className="activity-status-section"
                  style={{
                    marginTop: '1.5rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  {isActivityLocked && (
                    <p
                      className="lock-message"
                      style={{ color: 'red', fontWeight: 'bold' }}
                    >
                      Actividad bloqueada. Espera{' '}
                      {Math.floor(remainingLockTime / 60)
                        .toString()
                        .padStart(2, '0')}
                      :{(remainingLockTime % 60).toString().padStart(2, '0')}{' '}
                      para reintentar.
                      <br />
                      <small>
                        Mientras tanto, puedes revisar el texto y el
                        vocabulario.
                      </small>
                    </p>
                  )}

                  {!activityIsCompletedForCurrentScene &&
                    showActivity &&
                    !isActivityLocked && (
                      <>
                        <p
                          className="glance-count-message"
                          style={{ color: textColor }}
                        >
                          Vistazos restantes: {glanceCount}
                        </p>
                        <button
                          onClick={handleToggleBlur}
                          className="toggle-blur-button"
                          style={{ width: '100%' }}
                          disabled={glanceCount <= 0 && isTextBlurred}
                        >
                          {isTextBlurred
                            ? 'Ver Texto (Gastar vistazo)'
                            : 'Ver Ejercicio'}
                        </button>
                      </>
                    )}

                  {activityIsCompletedForCurrentScene && (
                    <div>
                      <p
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          marginRight: '1rem',
                        }}
                      >
                        ¡Ejercicio completado!
                      </p>
                      <button
                        onClick={handleResetActivity}
                        className="reset-activity-button"
                      >
                        Reiniciar Ejercicio
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Renderizado condicional de la actividad (DragDropSentence) */}
              {hasActivity &&
                showActivity &&
                !activityIsCompletedForCurrentScene &&
                !isActivityLocked && (
                  <div
                    className={`activity-container ${
                      !isTextBlurred ? 'blur-active' : ''
                    }`}
                  >
                    <DragDropSentence
                      key={currentActivityId + '-active'}
                      activityData={currentScene.activity}
                      onActivityComplete={handleActivityComplete}
                    />
                  </div>
                )}

              <div className="nav-buttons">
                <button
                  onClick={() => {
                    setSceneIndex((prev) => Math.max(prev - 1, 0))
                    setShowActivity(false)
                    setIsTextBlurred(false)
                  }}
                  disabled={sceneIndex === 0}
                >
                  ⬅️ Previous
                </button>
                <button
                  onClick={() =>
                    setSceneIndex((prev) =>
                      Math.min(
                        prev + 1,
                        chapters[chapterIndex].scenes.length - 1
                      )
                    )
                  }
                  disabled={nextButtonDisabled}
                >
                  Next ➡️
                </button>
                {nextChapterAvailable && (
                  <button
                    onClick={() => {
                      setChapterIndex(chapterIndex + 1)
                      setSceneIndex(0)
                    }}
                  >
                    👉 Next Chapter
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
