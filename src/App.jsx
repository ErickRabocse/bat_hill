// App.jsx
import { useEffect, useState, useRef } from 'react'
import Word from './Word'
import chapters from './chapters'
import ChapterSelector from './components/ChapterSelector'
import DragDropSentence from './components/DragDropSentence'
import { AnimatePresence, motion } from 'framer-motion'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './app.css'

// Constantes para la lógica de los vistazos y el temporizador
const MAX_GLANCES_ALLOWED = 2
const LOCK_DURATION_MS = 1 * 60 * 1000

function DraggableWord({ word, onDropWord }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: { word },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (!dropResult) {
        onDropWord(item.word)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <span
      ref={drag}
      className={`draggable-word-fixed ${isDragging ? 'is-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {word}
    </span>
  )
}

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
  const [isShowingTextDuringActivity, setIsShowingTextDuringActivity] =
    useState(false)

  const [glanceCount, setGlanceCount] = useState(MAX_GLANCES_ALLOWED)
  const [lockTimestamp, setLockTimestamp] = useState(null)
  const [remainingLockTime, setRemainingLockTime] = useState(0)
  const lockTimerRef = useRef(null)

  const [availableWords, setAvailableWords] = useState([])

  const currentChapter = chapters[chapterIndex]
  const currentScene = currentChapter.scenes[sceneIndex]
  const hasActivity = currentScene.activity !== undefined
  const currentActivityId = `${chapterIndex}-${sceneIndex}`
  const activityIsCompletedForCurrentScene =
    isActivityCompleted[currentActivityId]
  const isActivityLocked = lockTimestamp && lockTimestamp > Date.now()
  const isChapterSelectorDisabled =
    hasActivity && !activityIsCompletedForCurrentScene && showActivity

  const completedScenesInCurrentChapter = currentChapter.scenes.filter(
    (scene, index) => {
      const activityId = `${chapterIndex}-${index}`
      if (chapterIndex === 0) return true
      if (index === sceneIndex) {
        return !hasActivity || activityIsCompletedForCurrentScene
      }
      if (scene.activity) {
        return isActivityCompleted[activityId]
      } else {
        return true
      }
    }
  ).length

  const chapterProgress =
    currentChapter.scenes.length > 0
      ? (completedScenesInCurrentChapter / currentChapter.scenes.length) * 100
      : 0

  const shouldShowExerciseFullscreen =
    hasActivity &&
    showActivity &&
    !activityIsCompletedForCurrentScene &&
    !isActivityLocked &&
    !isShowingTextDuringActivity

  useEffect(() => {
    setShowActivity(false)
    setIsShowingTextDuringActivity(false)

    if (currentScene.activity && currentScene.activity.allWords) {
      setAvailableWords(shuffleArray(currentScene.activity.allWords))
    } else {
      setAvailableWords([])
    }

    const storedGlanceDataString = localStorage.getItem('glanceData')
    let initialGlanceCount = MAX_GLANCES_ALLOWED
    let initialLockTimestamp = null

    if (storedGlanceDataString) {
      const data = JSON.parse(storedGlanceDataString)
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
  }, [chapterIndex, sceneIndex, currentScene])

  useEffect(() => {
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
          setIsShowingTextDuringActivity(false)
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
      }
    }
  }, [lockTimestamp, isActivityLocked, chapterIndex, sceneIndex])

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

  const fontSizes = ['1.5rem', '1.75rem', '2rem']
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

  const shuffleArray = (array) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const handleWordsInBankChange = (newWordsArray) => {
    setAvailableWords(newWordsArray)
  }

  const handleActivityComplete = (success) => {
    if (success) {
      setIsActivityCompleted((prev) => ({
        ...prev,
        [currentActivityId]: true,
      }))
      setShowActivity(true)
      setIsShowingTextDuringActivity(false)
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
    setIsShowingTextDuringActivity(false)
    if (currentScene.activity && currentScene.activity.allWords) {
      setAvailableWords(shuffleArray(currentScene.activity.allWords))
    }
  }

  const handleToggleActivityView = () => {
    if (!isShowingTextDuringActivity) {
      setGlanceCount((prevCount) => {
        const updatedCount = prevCount - 1
        if (updatedCount <= 0) {
          setLockTimestamp(Date.now() + LOCK_DURATION_MS)
        }
        return updatedCount
      })
    }
    setIsShowingTextDuringActivity((prev) => !prev)
  }

  const nextButtonDisabled =
    (hasActivity && !activityIsCompletedForCurrentScene) ||
    isActivityLocked ||
    (chapterIndex === 0 && sceneIndex === currentChapter.scenes.length - 1)

  const nextChapterAvailable =
    sceneIndex === currentChapter.scenes.length - 1 &&
    chapterIndex < chapters.length - 1 &&
    (!hasActivity || activityIsCompletedForCurrentScene)

  const prevButtonDisabled = sceneIndex === 0 && chapterIndex === 0

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`app-container ${darkMode ? 'dark-mode' : ''}`}
        style={{ fontSize, backgroundColor, color: textColor }}
        onClick={() => setActiveWord(null)}
      >
        <div className="top-button-bar">
          {/* ... (Controles izquierdos: darkMode, fontSize, ChapterSelector) ... */}
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
            <ChapterSelector
              chapters={chapters}
              chapterIndex={chapterIndex}
              setChapterIndex={handleChapterChange}
              isDisabled={isChapterSelectorDisabled}
            />
          </div>
          {/* ... (Indicadores derechos: botones de navegación, progreso, número de página) ... */}
          <div className="right-indicators">
            <div className="nav-buttons-top">
              <button
                onClick={() => {
                  if (sceneIndex > 0) {
                    setSceneIndex((prev) => prev - 1)
                  } else if (chapterIndex > 0) {
                    const prevChapterIndex = chapterIndex - 1
                    setChapterIndex(prevChapterIndex)
                    setSceneIndex(chapters[prevChapterIndex].scenes.length - 1)
                  }
                  setShowActivity(false)
                  setIsShowingTextDuringActivity(false)
                }}
                disabled={prevButtonDisabled}
              >
                ⬅️ Previous
              </button>
              <button
                onClick={() => {
                  if (sceneIndex < currentChapter.scenes.length - 1) {
                    setSceneIndex((prev) => prev + 1)
                  }
                  setShowActivity(false)
                  setIsShowingTextDuringActivity(false)
                }}
                className={
                  chapterIndex === 0 &&
                  sceneIndex === currentChapter.scenes.length - 1
                    ? 'hidden' // Oculta "Next" en la última escena de la intro
                    : ''
                }
                // Deshabilita "Next" si es la última escena del capítulo (y no hay "Next Chapter") O si la actividad no está completada/bloqueada
                disabled={
                  (sceneIndex === currentChapter.scenes.length - 1 &&
                    !nextChapterAvailable) ||
                  nextButtonDisabled
                }
              >
                Next ➡️
              </button>
              {nextChapterAvailable && (
                <button
                  onClick={() => {
                    setChapterIndex(chapterIndex + 1)
                    setSceneIndex(0)
                    setShowActivity(false)
                    setIsShowingTextDuringActivity(false)
                  }}
                >
                  👉 Next Chapter
                </button>
              )}
            </div>
            {chapterIndex > 0 && (
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
            key={`${chapterIndex}-${sceneIndex}`} // Key para la animación de cambio de escena/capítulo
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="scene-and-activity-container"
          >
            {shouldShowExerciseFullscreen ? (
              <div className="scene-layout exercise-fullscreen-layout">
                <div className="text-container full-width-exercise">
                  <div style={{ marginBottom: '1rem' }}>
                    {chapterIndex === 0 ? (
                      <h1
                        className={`main-book-title ${
                          shouldShowExerciseFullscreen ? 'hidden' : '' // Ocultar título si el ejercicio está activo
                        }`}
                      >
                        Luna's journey
                      </h1>
                    ) : (
                      <h2
                        className={`chapter-title-main ${
                          shouldShowExerciseFullscreen ? 'hidden' : '' // Ocultar título si el ejercicio está activo
                        }`}
                      >
                        {currentChapter.title}
                      </h2>
                    )}
                  </div>
                  <div className="content-area-wrapper">
                    <div className="activity-overlay-container">
                      <DragDropSentence
                        key={currentActivityId + '-active'} // Key para reiniciar el componente si la actividad cambia
                        activityData={currentScene.activity}
                        initialWords={availableWords}
                        onWordsChanged={handleWordsInBankChange}
                        onActivityComplete={handleActivityComplete}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Vista de Texto e Imagen (o si el ejercicio está completado/bloqueado y no se muestra a pantalla completa)
              <div className="scene-layout">
                <img
                  src={currentScene.image}
                  alt={`Scene ${sceneIndex + 1}`}
                  className="scene-image"
                />
                <div className="text-container">
                  <div style={{ marginBottom: '1rem' }}>
                    {chapterIndex === 0 ? (
                      <h1 className="main-book-title">Luna's journey</h1>
                    ) : (
                      <h2 className="chapter-title-main">
                        {currentChapter.title}
                      </h2>
                    )}
                  </div>
                  <div className="content-area-wrapper">
                    <div className="scrollable-text">
                      {(() => {
                        const sentences = []
                        let currentSentenceWords = []
                        currentScene.text.forEach((item, idx) => {
                          currentSentenceWords.push({
                            ...item,
                            globalArrIndex: idx,
                          })
                          if (
                            ['.', '!', '?'].includes(item.word) ||
                            idx === currentScene.text.length - 1
                          ) {
                            if (currentSentenceWords.length > 0) {
                              sentences.push(currentSentenceWords)
                            }
                            currentSentenceWords = []
                          }
                        })
                        if (currentSentenceWords.length > 0) {
                          // Por si el texto no termina en puntuación
                          sentences.push(currentSentenceWords)
                        }
                        return sentences.map((sentenceData, sIndex) => {
                          const sentenceText = sentenceData
                            .map((item) => item.word)
                            .join(' ')
                            .replace(/\s+([.,!?])/g, '$1')
                          const playSentence = () => {
                            const utter = new SpeechSynthesisUtterance(
                              sentenceText
                            )
                            utter.lang = 'en-US'
                            const preferred = getPreferredVoice()
                            if (preferred) utter.voice = preferred
                            speechSynthesis.cancel()
                            speechSynthesis.speak(utter)
                          }
                          return (
                            <span key={sIndex} className="sentence-wrapper">
                              <button
                                onClick={playSentence}
                                className="play-button"
                              >
                                🔊
                              </button>
                              {sentenceData.map(
                                (
                                  { word, translation, globalArrIndex },
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
                                      ? sentenceData[localIndex - 1].word
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
                                      key={`${globalArrIndex}-${word}`}
                                      style={{
                                        marginLeft: isPunctuation
                                          ? 0
                                          : localIndex === 0 ||
                                            prevIsPunctuation
                                          ? '0.35em'
                                          : '0.25em',
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
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 1. Botón "Show Exercise" */}
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

        {/* 2. Sección de Estado de la Actividad */}
        {hasActivity &&
          (activityIsCompletedForCurrentScene || showActivity) && (
            <div
              className="activity-status-section"
              style={{
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              {activityIsCompletedForCurrentScene ? (
                // Caso A: La actividad está completada
                <div>
                  <p
                    style={{
                      color: 'var(--blank-correct-color)', // Usar variable CSS
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
              ) : (
                // Caso B: La actividad NO está completada, PERO showActivity es true
                // (lo que significa que se presionó "Show Exercise" o se está en una actividad activa)
                <>
                  {isActivityLocked ? (
                    // Subcaso B1: Actividad bloqueada
                    <p className="lock-message">
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
                  ) : (
                    // Subcaso B2: Actividad activa, no bloqueada (mostrar controles de vistazo)
                    // Esta sección solo tiene sentido si showActivity es true Y no está completada Y no está bloqueada
                    // La condición externa (activityIsCompletedForCurrentScene || showActivity) ya cubre parte de esto.
                    // Si no está completada y showActivity es true, entonces !activityIsCompletedForCurrentScene es true.
                    <>
                      <p className="glance-count-message">
                        Vistazos restantes: {glanceCount}
                      </p>
                      <button
                        onClick={handleToggleActivityView}
                        className="toggle-activity-view-button"
                        style={{ width: '100%' }}
                        disabled={
                          isShowingTextDuringActivity && glanceCount <= 0
                        }
                      >
                        {isShowingTextDuringActivity
                          ? 'Ver Ejercicio'
                          : 'Ver Texto (Gastar vistazo)'}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}

        {/* Banco de Palabras Fijo */}
        {shouldShowExerciseFullscreen && (
          <div className="fixed-word-bank-container">
            {availableWords.map((word, index) => (
              <DraggableWord
                key={`${word}-${index}`} // Asegurar key única si las palabras pueden repetirse
                word={word}
                onDropWord={(returnedWord) => {
                  setAvailableWords((prev) => {
                    if (!prev.includes(returnedWord)) {
                      return [...prev, returnedWord]
                    }
                    return prev
                  })
                }}
              />
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  )
}

export default App
