// App.jsx
import { useEffect, useState, useRef, useMemo } from 'react'
import Word from './Word'
import { allChapters } from './data/chapters'
import ChapterSelector from './components/ChapterSelector'
import DragDropSentence from './components/DragDropSentence'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { DndProvider, useDrag } from 'react-dnd' // <--- CORRECCIÓN: useDrag importado
import { HTML5Backend } from 'react-dnd-html5-backend'
import './app.css'

const MAX_GLANCES_ALLOWED = 2
const LOCK_DURATION_MS = 1 * 60 * 1000

const FONT_SIZES = ['1rem', '1.2rem', '1.4rem', '1.6rem', '1.8rem']

function DraggableWord({ word }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: { word },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <span
      ref={drag}
      className={`draggable-word-fixed ${isDragging ? 'is-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.4 : 1 }}
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
    return saved !== null ? parseInt(saved, 10) : 1
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

  const currentChapter = allChapters[chapterIndex]
  const currentScene = currentChapter?.scenes[sceneIndex]

  const hasActivity = currentScene && currentScene.activity !== undefined
  const currentActivityId = `${chapterIndex}-${sceneIndex}`
  const activityIsCompletedForCurrentScene =
    !!isActivityCompleted[currentActivityId]
  const isActivityLocked = lockTimestamp && lockTimestamp > Date.now()

  const isChapterSelectorDisabled =
    hasActivity && !activityIsCompletedForCurrentScene && showActivity

  const completedScenesInCurrentChapter = useMemo(() => {
    if (!currentChapter) return 0
    return currentChapter.scenes.filter((scene, index) => {
      const activityId = `${chapterIndex}-${index}`
      if (chapterIndex === 0) return true
      const sceneHasActivity = scene.activity !== undefined
      if (index === sceneIndex) {
        return !sceneHasActivity || !!isActivityCompleted[activityId]
      }
      if (sceneHasActivity) {
        return !!isActivityCompleted[activityId]
      }
      return true
    }).length
  }, [currentChapter, chapterIndex, sceneIndex, isActivityCompleted])

  const chapterProgress = useMemo(() => {
    if (!currentChapter || currentChapter.scenes.length === 0) return 0
    return (
      (completedScenesInCurrentChapter / currentChapter.scenes.length) * 100
    )
  }, [currentChapter, completedScenesInCurrentChapter])

  // Condición para mostrar el ejercicio de forma interactiva
  const shouldShowInteractiveExercise =
    hasActivity &&
    showActivity &&
    !activityIsCompletedForCurrentScene &&
    !isActivityLocked &&
    !isShowingTextDuringActivity

  useEffect(() => {
    setShowActivity(false)
    setIsShowingTextDuringActivity(false)

    if (
      currentScene &&
      currentScene.activity &&
      currentScene.activity.allWords
    ) {
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
        initialGlanceCount =
          data.count !== undefined ? data.count : MAX_GLANCES_ALLOWED
        initialLockTimestamp = data.lockUntil
      } else {
        localStorage.setItem(
          'glanceData',
          JSON.stringify({
            currentChapterIndex: chapterIndex,
            currentSceneIndex: sceneIndex,
            count: MAX_GLANCES_ALLOWED,
            lockUntil: null,
          })
        )
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
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('fontSizeIndex', fontSizeIndex.toString())
  }, [fontSizeIndex])

  const currentFontSize = FONT_SIZES[fontSizeIndex]

  const [activeWord, setActiveWord] = useState(null)
  const utteranceRef = useRef(null)
  const voicesLoaded = useRef(false)
  const [preferredVoice, setPreferredVoice] = useState(null)

  const getPreferredVoiceInternal = (voicesToSearch) => {
    // Renombrada para claridad
    return (
      voicesToSearch.find(
        (v) =>
          v.lang === 'en-US' &&
          (v.name.includes('Google US English') ||
            v.name.includes('Microsoft Zira') ||
            v.name.includes('Microsoft Jenny') ||
            v.name.includes('Microsoft Aria') ||
            v.name.includes('Samantha') ||
            v.name.includes('Google UK English Female'))
      ) ||
      voicesToSearch.find((v) => v.lang === 'en-US') ||
      null
    )
  }

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices()
      if (allVoices.length > 0 || voicesLoaded.current) {
        setPreferredVoice(getPreferredVoiceInternal(allVoices))
        voicesLoaded.current = true
        if (speechSynthesis.onvoiceschanged === loadVoices) {
          speechSynthesis.onvoiceschanged = null
        }
      }
    }

    loadVoices()
    if (
      speechSynthesis.onvoiceschanged !== undefined &&
      !voicesLoaded.current
    ) {
      speechSynthesis.onvoiceschanged = loadVoices
    }
    return () => {
      if (speechSynthesis.onvoiceschanged === loadVoices) {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, []) // Se ejecuta una vez para cargar voces

  const speakWord = (word) => {
    // speakWord ya no necesita ser async aquí
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    const utter = new SpeechSynthesisUtterance(word)
    utter.lang = 'en-US'
    if (preferredVoice) {
      // Usa la voz del estado
      utter.voice = preferredVoice
    }
    utter.onend = () => {
      setActiveWord(null)
    }
    utteranceRef.current = utter
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
    for (let i = 1; i < allChapters.length; i++) {
      if (i < chapterIndex) {
        page += allChapters[i].scenes.length
      }
    }
    return page + sceneIndex + 1
  }

  const shuffleArray = (array) => {
    if (!array) return []
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
      setIsShowingTextDuringActivity(true)
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
    if (
      currentScene &&
      currentScene.activity &&
      currentScene.activity.allWords
    ) {
      setAvailableWords(shuffleArray(currentScene.activity.allWords))
    }
  }

  const handleToggleActivityView = () => {
    if (!isShowingTextDuringActivity) {
      if (glanceCount > 0) {
        setGlanceCount((prevCount) => {
          const updatedCount = prevCount - 1
          if (updatedCount <= 0 && !activityIsCompletedForCurrentScene) {
            setLockTimestamp(Date.now() + LOCK_DURATION_MS)
          }
          return updatedCount
        })
      } else if (!isActivityLocked && !activityIsCompletedForCurrentScene) {
        setLockTimestamp(Date.now() + LOCK_DURATION_MS)
      }
    }
    setIsShowingTextDuringActivity((prev) => !prev)
  }

  const nextChapterAvailable =
    currentChapter &&
    sceneIndex === currentChapter.scenes.length - 1 &&
    chapterIndex < allChapters.length - 1 &&
    (!hasActivity || activityIsCompletedForCurrentScene || chapterIndex === 0)

  const nextButtonDisabled =
    (hasActivity &&
      !activityIsCompletedForCurrentScene &&
      chapterIndex !== 0 &&
      !isShowingTextDuringActivity) ||
    isActivityLocked ||
    (chapterIndex === 0 &&
      currentChapter &&
      sceneIndex === currentChapter.scenes.length - 1 &&
      !nextChapterAvailable)

  const prevButtonDisabled = sceneIndex === 0 && chapterIndex === 0

  if (!currentChapter || !currentScene) {
    return (
      <div>
        Loading chapter or scene data... Please verify your chapter data files.
      </div>
    )
  }

  // Lógica de renderizado de Word (para playSentence)
  // Definimos getPreferredVoiceAppScope aquí para que sea accesible por playSentence
  const getPreferredVoiceAppScope = () => preferredVoice

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`app-container`}
        onClick={() => {
          if (activeWord) setActiveWord(null)
        }}
      >
        <div className="top-button-bar">
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
              disabled={fontSizeIndex === 0}
            >
              A-
            </button>
            <button
              onClick={() =>
                setFontSizeIndex((prev) =>
                  Math.min(FONT_SIZES.length - 1, prev + 1)
                )
              }
              disabled={fontSizeIndex === FONT_SIZES.length - 1}
            >
              A+
            </button>
            <ChapterSelector
              chapters={allChapters}
              chapterIndex={chapterIndex}
              setChapterIndex={handleChapterChange}
              isDisabled={isChapterSelectorDisabled}
            />
          </div>
          <div className="right-indicators">
            <div className="nav-buttons-top">
              <button
                onClick={() => {
                  if (sceneIndex > 0) {
                    setSceneIndex((prev) => prev - 1)
                  } else if (chapterIndex > 0) {
                    const prevChapterIndex = chapterIndex - 1
                    setChapterIndex(prevChapterIndex)
                    setSceneIndex(
                      allChapters[prevChapterIndex].scenes.length - 1
                    )
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
                  if (
                    currentChapter &&
                    sceneIndex < currentChapter.scenes.length - 1
                  ) {
                    setSceneIndex((prev) => prev + 1)
                    setShowActivity(false)
                    setIsShowingTextDuringActivity(false)
                  }
                }}
                className={
                  (currentChapter &&
                    sceneIndex === currentChapter.scenes.length - 1 &&
                    !nextChapterAvailable) ||
                  (chapterIndex === 0 &&
                    currentChapter &&
                    sceneIndex === currentChapter.scenes.length - 1 &&
                    !nextChapterAvailable)
                    ? 'hidden'
                    : ''
                }
                disabled={nextButtonDisabled}
              >
                Next Scene ➡️
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
            {chapterIndex > 0 && currentChapter && (
              <div className="chapter-progress-container">
                <span className="chapter-progress-text">
                  Chapter {chapterIndex}: {completedScenesInCurrentChapter}/
                  {currentChapter.scenes.length}
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
            key={`${chapterIndex}-${sceneIndex}-${showActivity}-${isShowingTextDuringActivity}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="scene-and-activity-container"
          >
            {shouldShowInteractiveExercise ? ( // Usar la variable más descriptiva
              // MOSTRAR EJERCICIO INTERACTIVO (PANTALLA COMPLETA)
              <div className="scene-layout exercise-fullscreen-layout">
                <div className="text-container full-width-exercise">
                  <div style={{ marginBottom: '1rem' }}>
                    {chapterIndex === 0 ? (
                      <h1 className="main-book-title hidden">Luna's journey</h1>
                    ) : (
                      <h2 className="chapter-title-main hidden">
                        {currentChapter.title}
                      </h2>
                    )}
                  </div>
                  <div className="content-area-wrapper">
                    <div className="activity-overlay-container">
                      <DragDropSentence
                        key={currentActivityId + '-active'}
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
              // MOSTRAR TEXTO DE LA ESCENA (Normal, o durante vistazo, o si la actividad está completada/bloqueada)
              <div
                className={`scene-layout ${
                  showActivity && hasActivity
                    ? 'exercise-mode-text-visible'
                    : ''
                }`}
              >
                <img
                  src={currentScene.image}
                  alt={`Scene ${sceneIndex + 1} from Chapter ${
                    currentChapter.title || 'Introduction'
                  }`}
                  className={`scene-image ${
                    showActivity &&
                    hasActivity &&
                    !isShowingTextDuringActivity &&
                    !activityIsCompletedForCurrentScene &&
                    !isActivityLocked
                      ? 'hidden-for-exercise'
                      : ''
                  }`}
                />
                <div
                  className={`text-container ${
                    showActivity &&
                    hasActivity &&
                    !isShowingTextDuringActivity &&
                    !activityIsCompletedForCurrentScene &&
                    !isActivityLocked
                      ? 'full-width-exercise'
                      : ''
                  }`}
                >
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
                    <div
                      className={`scrollable-text ${
                        showActivity &&
                        hasActivity &&
                        !activityIsCompletedForCurrentScene &&
                        !isShowingTextDuringActivity &&
                        !isActivityLocked &&
                        !shouldShowInteractiveExercise
                          ? 'hidden'
                          : ''
                      }`}
                    >
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
                          sentences.push(currentSentenceWords)
                        }
                        return sentences.map((sentenceData, sIndex) => {
                          const sentenceText = sentenceData
                            .map((item) => item.word)
                            .join(' ')
                            .replace(/\s+([.,!?])/g, '$1')
                          const playSentence = () => {
                            // No necesita ser async si preferredVoice es de estado
                            if (speechSynthesis.speaking) {
                              speechSynthesis.cancel()
                            }
                            const utter = new SpeechSynthesisUtterance(
                              sentenceText
                            )
                            utter.lang = 'en-US'
                            const voiceToUse = getPreferredVoiceAppScope() // Usa la función definida en el scope de App
                            if (voiceToUse) utter.voice = voiceToUse
                            utter.onend = () => setActiveWord(null)
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
                                ({ word, translation, globalArrIndex }) => {
                                  const isPunctuation = [
                                    '.',
                                    ',',
                                    '!',
                                    '?',
                                    '...',
                                  ].includes(word)
                                  return (
                                    <span key={`${globalArrIndex}-${word}`}>
                                      {isPunctuation ? (
                                        word
                                      ) : (
                                        <Word
                                          text={word}
                                          translation={translation}
                                          activeWord={activeWord}
                                          setActiveWord={setActiveWord}
                                          onSpeak={speakWord}
                                          fontSize={currentFontSize}
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
                    {hasActivity &&
                      showActivity &&
                      currentScene.activity &&
                      (activityIsCompletedForCurrentScene ||
                        isActivityLocked) &&
                      !isShowingTextDuringActivity && (
                        <div className="activity-overlay-container">
                          <DragDropSentence
                            key={currentActivityId + '-inline-completed-locked'}
                            activityData={currentScene.activity}
                            initialWords={availableWords}
                            onWordsChanged={handleWordsInBankChange}
                            onActivityComplete={handleActivityComplete}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {hasActivity &&
          !showActivity &&
          !isActivityLocked &&
          (activityIsCompletedForCurrentScene ? (
            <button
              onClick={handleResetActivity}
              className="show-activity-button"
            >
              Reintentar Ejercicio
            </button>
          ) : (
            <button
              onClick={() => {
                setShowActivity(true)
                setIsShowingTextDuringActivity(false)
              }}
              className="show-activity-button"
            >
              Show Exercise
            </button>
          ))}

        {hasActivity && showActivity && (
          <div className="activity-status-section">
            {activityIsCompletedForCurrentScene ? (
              <div>
                <p
                  style={{
                    color: 'var(--blank-correct-color)',
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
            ) : isActivityLocked ? (
              <p className="lock-message">
                Actividad bloqueada. Espera{' '}
                {Math.floor(remainingLockTime / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(remainingLockTime % 60).toString().padStart(2, '0')} para
                reintentar.
              </p>
            ) : (
              <>
                <p className="glance-count-message">
                  Vistazos restantes: {glanceCount > 0 ? glanceCount : 0}
                </p>
                <button
                  onClick={handleToggleActivityView}
                  className="toggle-activity-view-button"
                  disabled={glanceCount <= 0 && !isShowingTextDuringActivity}
                >
                  {isShowingTextDuringActivity
                    ? 'Ver Ejercicio'
                    : 'Ver Texto (Gastar vistazo)'}
                </button>
              </>
            )}
          </div>
        )}

        {shouldShowInteractiveExercise && currentScene.activity && (
          <div
            className={`fixed-word-bank-container ${
              !availableWords.length ? 'hidden' : ''
            }`}
          >
            {availableWords.map((word, index) => (
              <DraggableWord key={`${word}-${index}-bank`} word={word} />
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  )
}

export default App
