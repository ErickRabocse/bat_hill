// App.jsx
import { useEffect, useState, useRef, useMemo } from 'react'
import Word from './Word'
import { allChapters } from './data/chapters'
import ChapterSelector from './components/ChapterSelector'
import DragDropSentence from './components/DragDropSentence'
import StudentNameModal from './components/StudentNameModal'
import ChapterCompletionModal from './components/ChapterCompletionModal'
import { AnimatePresence, motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Confetti from 'react-confetti'
import './app.css'

const FONT_SIZES = ['1rem', '1.2rem', '1.4rem', '1.6rem', '1.8rem']
const CONFETTI_DURATION = 6000
const NEXT_BUTTON_ANIM_DURATION = 3000
const GLANCE_TIMER_SECONDS = 30

function DraggableWord({ word }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: { word },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }))
  return (
    <span
      ref={drag}
      className={`draggable-word-fixed ${isDragging ? 'is-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {' '}
      {word}{' '}
    </span>
  )
}

function App() {
  useEffect(() => {
    localStorage.removeItem('completedActivities')
    localStorage.removeItem('fontSizeIndex')
    localStorage.removeItem('studentName')
    localStorage.removeItem('studentGroup')
    setChapterIndex(0)
    setSceneIndex(0)
    setDarkMode(false)
    setFontSizeIndex(1)
    setIsActivityCompleted({})
    setShowActivity(false)
    setIsShowingTextDuringActivity(false)
    setAvailableWords([])
    setAnimateNextSceneButton(false)
    setStudentName('')
    setStudentGroup('')
    setShowStudentNameModal(true)
    setShowCongratulatoryModal(false)
    setCongratulatoryModalDetails(null)
    setShowConfetti(false)
    setBlurPage(false)
    setIsGlanceTimerActive(false)
    setGlanceTimeRemaining(0)
    if (glanceTimerRef.current) clearInterval(glanceTimerRef.current)
  }, [])

  const [chapterIndex, setChapterIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(1)
  const [isActivityCompleted, setIsActivityCompleted] = useState({})
  const [showActivity, setShowActivity] = useState(false)
  const [isShowingTextDuringActivity, setIsShowingTextDuringActivity] =
    useState(false)
  const [availableWords, setAvailableWords] = useState([])
  const [animateNextSceneButton, setAnimateNextSceneButton] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [studentGroup, setStudentGroup] = useState('')
  const [showStudentNameModal, setShowStudentNameModal] = useState(true)
  const [showCongratulatoryModal, setShowCongratulatoryModal] = useState(false)
  const [congratulatoryModalDetails, setCongratulatoryModalDetails] =
    useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [blurPage, setBlurPage] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [glanceTimeRemaining, setGlanceTimeRemaining] = useState(0)
  const [isGlanceTimerActive, setIsGlanceTimerActive] = useState(false)
  const glanceTimerRef = useRef(null)

  const currentChapter = allChapters[chapterIndex]
  const currentScene = currentChapter?.scenes[sceneIndex]
  const hasActivity = currentScene && currentScene.activity !== undefined
  const currentActivityId = `${chapterIndex}-${sceneIndex}`
  const activityIsCompletedForCurrentScene =
    !!isActivityCompleted[currentActivityId]

  const handleStudentNameSubmit = (name, group) => {
    setStudentName(name)
    setStudentGroup(group)
    localStorage.setItem('studentName', name)
    localStorage.setItem('studentGroup', group)
    setShowStudentNameModal(false)
  }
  const completedScenesInCurrentChapter = useMemo(() => {
    if (!currentChapter) return 0
    return currentChapter.scenes.filter((scene, index) => {
      const activityId = `${chapterIndex}-${index}`
      if (
        chapterIndex === 0 &&
        currentChapter.scenes.length === 1 &&
        !currentChapter.scenes.some((s) => s.activity)
      )
        return true
      const sceneHasActivity = scene.activity !== undefined
      return !sceneHasActivity || !!isActivityCompleted[activityId]
    }).length
  }, [currentChapter, chapterIndex, isActivityCompleted])
  const chapterProgress = useMemo(() => {
    if (!currentChapter || currentChapter.scenes.length === 0) return 0
    if (
      chapterIndex === 0 &&
      currentChapter.scenes.length === 1 &&
      !currentChapter.scenes.some((s) => s.activity)
    ) {
      return 100
    }
    const progress =
      (completedScenesInCurrentChapter / currentChapter.scenes.length) * 100
    return Math.min(100, progress)
  }, [currentChapter, chapterIndex, completedScenesInCurrentChapter])
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const shouldShowInteractiveExercise =
    hasActivity &&
    showActivity &&
    !activityIsCompletedForCurrentScene &&
    !isShowingTextDuringActivity &&
    !isGlanceTimerActive

  useEffect(() => {
    setShowActivity(false)
    setIsShowingTextDuringActivity(false)
    setIsGlanceTimerActive(false)
    setGlanceTimeRemaining(0)
    if (glanceTimerRef.current) clearInterval(glanceTimerRef.current)
    if (
      currentScene &&
      currentScene.activity &&
      currentScene.activity.sentences
    ) {
      const correctWordsForBank = currentScene.activity.sentences.reduce(
        (acc, sentence) => {
          sentence.parts.forEach((part) => {
            if (
              part.type === 'blank' &&
              part.correctWord &&
              !acc.includes(part.correctWord)
            )
              acc.push(part.correctWord)
          })
          return acc
        },
        []
      )
      if (!activityIsCompletedForCurrentScene) {
        setAvailableWords(shuffleArray(correctWordsForBank))
      } else {
        setAvailableWords([])
      }
    } else {
      setAvailableWords([])
    }
    const scrollableTextElement = document.querySelector('.scrollable-text')
    if (scrollableTextElement) scrollableTextElement.scrollTop = 0
  }, [
    chapterIndex,
    sceneIndex,
    currentScene,
    activityIsCompletedForCurrentScene,
  ])

  useEffect(() => {
    localStorage.setItem(
      'completedActivities',
      JSON.stringify(isActivityCompleted)
    )
  }, [isActivityCompleted])
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode)
  }, [darkMode])
  useEffect(() => {
    localStorage.setItem('fontSizeIndex', fontSizeIndex.toString())
  }, [fontSizeIndex])

  const currentFontSize = FONT_SIZES[fontSizeIndex]
  const [activeWord, setActiveWord] = useState(null)
  const utteranceRef = useRef(null)
  const voicesLoaded = useRef(false)
  const [preferredVoice, setPreferredVoice] = useState(null)
  const getPreferredVoiceInternal = (voicesToSearch) =>
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
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices()
      if (allVoices.length > 0 || voicesLoaded.current) {
        setPreferredVoice(getPreferredVoiceInternal(allVoices))
        voicesLoaded.current = true
        if (speechSynthesis.onvoiceschanged === loadVoices)
          speechSynthesis.onvoiceschanged = null
      }
    }
    loadVoices()
    if (speechSynthesis.onvoiceschanged !== undefined && !voicesLoaded.current)
      speechSynthesis.onvoiceschanged = loadVoices
    return () => {
      if (speechSynthesis.onvoiceschanged === loadVoices)
        speechSynthesis.onvoiceschanged = null
    }
  }, [])
  const speakWord = (word) => {
    if (speechSynthesis.speaking) speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(word)
    utter.lang = 'en-US'
    if (preferredVoice) utter.voice = preferredVoice
    utter.onend = () => setActiveWord(null)
    utteranceRef.current = utter
    speechSynthesis.speak(utter)
    setActiveWord(word)
  }
  const resetViewAndTimer = () => {
    setShowActivity(false)
    setIsShowingTextDuringActivity(false)
    setIsGlanceTimerActive(false)
    setGlanceTimeRemaining(0)
    if (glanceTimerRef.current) clearInterval(glanceTimerRef.current)
    setBlurPage(false)
    setShowCongratulatoryModal(false)
  }
  const handleChapterChange = (newIndex) => {
    setChapterIndex(newIndex)
    setSceneIndex(0)
    resetViewAndTimer()
  }
  const handleSceneAdvance = (offset) => {
    setSceneIndex((prev) => prev + offset)
    resetViewAndTimer()
  }
  const handleGoToLastSceneOfPrevChapter = () => {
    const prevCh = chapterIndex - 1
    setChapterIndex(prevCh)
    setSceneIndex(allChapters[prevCh].scenes.length - 1)
    resetViewAndTimer()
  }
  const getGlobalSceneNumber = () => {
    if (chapterIndex === 0) return null
    let page = 0
    for (let i = 1; i < allChapters.length; i++) {
      if (i < chapterIndex) page += allChapters[i].scenes.length
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
  const handleWordsInBankChange = (newWordsArrayFromDragDrop) => {
    setAvailableWords(newWordsArrayFromDragDrop)
  }

  const handleActivityComplete = (success) => {
    if (success) {
      setIsActivityCompleted((prev) => ({ ...prev, [currentActivityId]: true }))
      setIsShowingTextDuringActivity(true)
      const isLastSceneOfChapter =
        currentChapter && sceneIndex === currentChapter.scenes.length - 1
      if (hasActivity && isLastSceneOfChapter && chapterIndex > 0) {
        setBlurPage(true)
        setShowConfetti(true)
        setCongratulatoryModalDetails({
          chapterNumber: chapterIndex,
          chapterTitle: currentChapter.title,
          studentName: studentName,
          studentGroup: studentGroup,
          completionTimestamp: new Date().toISOString(),
        })
        setTimeout(() => {
          setShowConfetti(false)
          setShowCongratulatoryModal(true)
        }, CONFETTI_DURATION)
      } else if (
        currentChapter &&
        sceneIndex < currentChapter.scenes.length - 1
      ) {
        setAnimateNextSceneButton(true)
        setTimeout(
          () => setAnimateNextSceneButton(false),
          NEXT_BUTTON_ANIM_DURATION
        )
      }
    }
  }
  const handleCloseCongratulatoryModal = () => {
    setShowCongratulatoryModal(false)
    setBlurPage(false)
  }
  const handleProceedToNextChapter = () => {
    setShowCongratulatoryModal(false)
    setBlurPage(false)
    if (chapterIndex < allChapters.length - 1) {
      setChapterIndex((prev) => prev + 1)
      setSceneIndex(0)
      resetViewAndTimer()
    }
  }

  useEffect(() => {
    if (isGlanceTimerActive && glanceTimeRemaining > 0) {
      glanceTimerRef.current = setInterval(() => {
        setGlanceTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    } else if (glanceTimeRemaining === 0 && isGlanceTimerActive) {
      setIsShowingTextDuringActivity(false)
      setIsGlanceTimerActive(false)
      if (glanceTimerRef.current) clearInterval(glanceTimerRef.current)
    }
    return () => {
      if (glanceTimerRef.current) clearInterval(glanceTimerRef.current)
    }
  }, [isGlanceTimerActive, glanceTimeRemaining])
  const handleToggleActivityView = () => {
    if (activityIsCompletedForCurrentScene) return
    if (!isShowingTextDuringActivity) {
      setIsShowingTextDuringActivity(true)
      setGlanceTimeRemaining(GLANCE_TIMER_SECONDS)
      setIsGlanceTimerActive(true)
    } else {
      setIsShowingTextDuringActivity(false)
      setIsGlanceTimerActive(false)
      setGlanceTimeRemaining(0)
      if (glanceTimerRef.current) clearInterval(glanceTimerRef.current)
    }
  }

  const isLastSceneInChapter =
    currentChapter && sceneIndex === currentChapter.scenes.length - 1
  const nextChapterAvailable =
    isLastSceneInChapter &&
    chapterIndex < allChapters.length - 1 &&
    (chapterIndex === 0 || chapterProgress === 100)

  // --- Variables para estados de deshabilitación ---
  const pageEffectsActive = blurPage || showCongratulatoryModal
  const currentSceneRequiresCompletion =
    hasActivity && !activityIsCompletedForCurrentScene

  // True si la UI de la actividad (ejercicio O texto de vistazo con timer) está activa y no resuelta.
  const activityInterfaceIsActive =
    showActivity && hasActivity && !activityIsCompletedForCurrentScene

  const chapterSelectorDisabled =
    pageEffectsActive ||
    currentSceneRequiresCompletion ||
    (activityInterfaceIsActive && isGlanceTimerActive)
  const nextSceneButtonDisabled =
    pageEffectsActive || currentSceneRequiresCompletion
  const prevSceneButtonDisabled =
    pageEffectsActive ||
    (sceneIndex === 0 && chapterIndex === 0) ||
    currentSceneRequiresCompletion
  const mainControlsDisabled =
    pageEffectsActive ||
    currentSceneRequiresCompletion ||
    shouldShowInteractiveExercise ||
    isGlanceTimerActive
  const glanceButtonDisabled =
    pageEffectsActive ||
    activityIsCompletedForCurrentScene ||
    (isShowingTextDuringActivity &&
      isGlanceTimerActive &&
      glanceTimeRemaining === 0)
  const showExerciseButtonDisabled = pageEffectsActive

  if (!currentChapter || !currentScene) return <div>Loading...</div>

  return (
    <DndProvider backend={HTML5Backend}>
      {showStudentNameModal && (
        <StudentNameModal
          onSubmit={handleStudentNameSubmit}
          currentName={studentName}
          currentGroup={studentGroup}
        />
      )}
      {showCongratulatoryModal && congratulatoryModalDetails && (
        <ChapterCompletionModal
          details={congratulatoryModalDetails}
          onClose={handleCloseCongratulatoryModal}
          onProceed={handleProceedToNextChapter}
          isLastChapterInBook={chapterIndex === allChapters.length - 1}
        />
      )}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={600}
          gravity={0.15}
          initialVelocityY={20}
        />
      )}
      <div
        className={`app-container ${blurPage ? 'app-container-blur' : ''}`}
        onClick={() => {
          if (activeWord) setActiveWord(null)
        }}
      >
        <div className="top-button-bar">
          <div className="left-controls">
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ fontSize: '0.9rem', marginRight: '0.5rem' }}
              disabled={mainControlsDisabled}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button
              onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
              style={{ marginRight: '0.25rem' }}
              disabled={fontSizeIndex === 0 || mainControlsDisabled}
            >
              A-
            </button>
            <button
              onClick={() =>
                setFontSizeIndex((prev) =>
                  Math.min(FONT_SIZES.length - 1, prev + 1)
                )
              }
              disabled={
                fontSizeIndex === FONT_SIZES.length - 1 || mainControlsDisabled
              }
            >
              A+
            </button>
            <ChapterSelector
              chapters={allChapters}
              chapterIndex={chapterIndex}
              setChapterIndex={handleChapterChange}
              isDisabled={chapterSelectorDisabled}
            />
          </div>
          <div className="right-indicators">
            <div className="nav-buttons-top">
              <button
                onClick={() => {
                  if (sceneIndex > 0) handleSceneAdvance(-1)
                  else if (chapterIndex > 0) handleGoToLastSceneOfPrevChapter()
                }}
                disabled={prevSceneButtonDisabled}
              >
                ⬅️ Previous
              </button>
              {!isLastSceneInChapter && (
                <button
                  onClick={() => {
                    if (
                      currentChapter &&
                      sceneIndex < currentChapter.scenes.length - 1
                    )
                      handleSceneAdvance(1)
                  }}
                  className={
                    animateNextSceneButton ? 'next-scene-button-animate' : ''
                  }
                  disabled={nextSceneButtonDisabled}
                >
                  {' '}
                  Next Scene ➡️{' '}
                </button>
              )}
              {nextChapterAvailable && (
                <button
                  onClick={handleProceedToNextChapter}
                  disabled={pageEffectsActive}
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
            {shouldShowInteractiveExercise ? (
              <div className="scene-layout exercise-fullscreen-layout">
                {' '}
                <div className="text-container full-width-exercise">
                  {' '}
                  <div style={{ marginBottom: '1rem' }}>
                    {chapterIndex === 0 ? (
                      <h1 className="main-book-title hidden">Luna's journey</h1>
                    ) : (
                      <h2 className="chapter-title-main hidden">
                        {currentChapter.title}
                      </h2>
                    )}
                  </div>{' '}
                  <div className="content-area-wrapper">
                    <div className="activity-overlay-container">
                      <DragDropSentence
                        key={currentActivityId + '-active'}
                        activityData={currentScene.activity}
                        initialWords={availableWords}
                        onWordsChanged={handleWordsInBankChange}
                        onActivityComplete={handleActivityComplete}
                        isShowingTextDuringActivity={
                          isShowingTextDuringActivity
                        } // Prop para DragDropSentence
                        onToggleActivityView={handleToggleActivityView} // Prop para DragDropSentence
                        isGlanceButtonDisabled={glanceButtonDisabled} // Prop para DragDropSentence
                      />
                    </div>
                  </div>{' '}
                </div>{' '}
              </div>
            ) : (
              <div
                className={`scene-layout ${
                  showActivity && hasActivity
                    ? 'exercise-mode-text-visible'
                    : ''
                }`}
              >
                {' '}
                <img
                  src={currentScene.image}
                  alt={`Scene ${sceneIndex + 1} from Chapter ${
                    currentChapter.title || 'Introduction'
                  }`}
                  className={`scene-image ${
                    activityInterfaceIsActive && !isShowingTextDuringActivity
                      ? 'hidden-for-exercise'
                      : ''
                  }`}
                />{' '}
                <div
                  className={`text-container ${
                    activityInterfaceIsActive && !isShowingTextDuringActivity
                      ? 'full-width-exercise'
                      : ''
                  }`}
                >
                  {' '}
                  <div style={{ marginBottom: '1rem' }}>
                    {chapterIndex === 0 ? (
                      <h1 className="main-book-title">Luna's journey</h1>
                    ) : (
                      <h2 className="chapter-title-main">
                        {currentChapter.title}
                      </h2>
                    )}
                  </div>{' '}
                  <div className="content-area-wrapper">
                    {' '}
                    <div
                      className={`scrollable-text ${
                        activityInterfaceIsActive &&
                        !isShowingTextDuringActivity
                          ? 'hidden'
                          : ''
                      }`}
                    >
                      {' '}
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
                            if (speechSynthesis.speaking) {
                              speechSynthesis.cancel()
                            }
                            const utter = new SpeechSynthesisUtterance(
                              sentenceText
                            )
                            utter.lang = 'en-US'
                            const voiceToUse = preferredVoice
                            if (voiceToUse) utter.voice = voiceToUse
                            utter.onend = () => setActiveWord(null)
                            speechSynthesis.speak(utter)
                          }
                          return (
                            <span key={sIndex} className="sentence-wrapper">
                              <button
                                onClick={playSentence}
                                className="play-button"
                                disabled={
                                  pageEffectsActive || isGlanceTimerActive
                                }
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
                      })()}{' '}
                    </div>{' '}
                    {hasActivity &&
                      showActivity &&
                      currentScene.activity &&
                      activityIsCompletedForCurrentScene &&
                      !isShowingTextDuringActivity && (
                        <div className="activity-overlay-container">
                          {' '}
                          <DragDropSentence
                            key={currentActivityId + '-inline-completed'}
                            activityData={currentScene.activity}
                            initialWords={availableWords}
                            onWordsChanged={handleWordsInBankChange}
                            onActivityComplete={handleActivityComplete}
                            isShowingTextDuringActivity={
                              isShowingTextDuringActivity
                            }
                            onToggleActivityView={handleToggleActivityView}
                            isGlanceButtonDisabled={glanceButtonDisabled}
                            isInternallyCompletedProp={true}
                          />{' '}
                        </div>
                      )}{' '}
                  </div>{' '}
                </div>{' '}
              </div>
            )}{' '}
          </motion.div>
        </AnimatePresence>

        {hasActivity &&
          !showActivity &&
          !activityIsCompletedForCurrentScene && (
            <button
              onClick={() => {
                setShowActivity(true)
                setIsShowingTextDuringActivity(false)
              }}
              className="show-activity-button"
              disabled={showExerciseButtonDisabled}
            >
              Show Exercise
            </button>
          )}
        {hasActivity && !showActivity && activityIsCompletedForCurrentScene && (
          <div className="activity-completed-indicator">
            <span role="img" aria-label="Completed">
              ✅
            </span>{' '}
            Actividad Completada
          </div>
        )}

        {hasActivity && showActivity && (
          <div className="activity-status-section">
            {activityIsCompletedForCurrentScene ? (
              <div>
                <p
                  style={{
                    color: 'var(--blank-correct-color)',
                    fontWeight: 'bold',
                  }}
                >
                  ¡Ejercicio completado!
                </p>
              </div>
            ) : isGlanceTimerActive && isShowingTextDuringActivity ? (
              <p className="glance-timer-display">
                Volviendo al ejercicio en: {glanceTimeRemaining}s
              </p>
            ) : null}
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
