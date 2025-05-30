// App.jsx (Versión Completa y Corregida)
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

const MAX_GLANCES_ALLOWED = 2
const LOCK_DURATION_MS = 1 * 60 * 1000
const FONT_SIZES = ['1rem', '1.2rem', '1.4rem', '1.6rem', '1.8rem']
const CONFETTI_DURATION = 6000
const NEXT_BUTTON_ANIM_DURATION = 3000

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
    localStorage.removeItem('glanceData')
    localStorage.removeItem('fontSizeIndex')
    localStorage.removeItem('studentName')
    localStorage.removeItem('studentGroup')
    if (!localStorage.getItem('studentName')) {
      setShowStudentNameModal(true)
    } else {
      setShowStudentNameModal(false)
    }
  }, [])

  const [chapterIndex, setChapterIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(
    () => JSON.parse(localStorage.getItem('fontSizeIndex')) || 1
  )
  const [isActivityCompleted, setIsActivityCompleted] = useState(
    () => JSON.parse(localStorage.getItem('completedActivities')) || {}
  )
  const [showActivity, setShowActivity] = useState(false)
  const [isShowingTextDuringActivity, setIsShowingTextDuringActivity] =
    useState(false)
  const [glanceCount, setGlanceCount] = useState(MAX_GLANCES_ALLOWED)
  const [lockTimestamp, setLockTimestamp] = useState(null)
  const [remainingLockTime, setRemainingLockTime] = useState(0)
  const lockTimerRef = useRef(null)
  const [availableWords, setAvailableWords] = useState([])
  const [animateNextSceneButton, setAnimateNextSceneButton] = useState(false)
  const [studentName, setStudentName] = useState(
    () => localStorage.getItem('studentName') || ''
  )
  const [studentGroup, setStudentGroup] = useState(
    () => localStorage.getItem('studentGroup') || ''
  )
  const [showStudentNameModal, setShowStudentNameModal] = useState(
    () => !localStorage.getItem('studentName')
  )
  const [showCongratulatoryModal, setShowCongratulatoryModal] = useState(false)
  const [congratulatoryModalDetails, setCongratulatoryModalDetails] =
    useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [blurPage, setBlurPage] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    if (!localStorage.getItem('studentName')) {
      setShowStudentNameModal(true)
    }
  }, [])

  const currentChapter = allChapters[chapterIndex]
  const currentScene = currentChapter?.scenes[sceneIndex]
  const hasActivity = currentScene && currentScene.activity !== undefined
  const currentActivityId = `${chapterIndex}-${sceneIndex}`
  const activityIsCompletedForCurrentScene =
    !!isActivityCompleted[currentActivityId]
  const isActivityLockedByGlance = lockTimestamp && lockTimestamp > Date.now()

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
    !isActivityLockedByGlance &&
    !isShowingTextDuringActivity

  useEffect(() => {
    setShowActivity(false)
    setIsShowingTextDuringActivity(false)
    console.log(
      `[App.jsx] useEffect [scene change/completion status change] for: ${chapterIndex}-${sceneIndex}. Activity completed: ${activityIsCompletedForCurrentScene}`
    )
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
            ) {
              acc.push(part.correctWord)
            }
          })
          return acc
        },
        []
      )
      console.log(
        `[App.jsx] Scene ${chapterIndex}-${sceneIndex} - Derived correctWordsForBank:`,
        JSON.stringify(correctWordsForBank)
      )
      if (!activityIsCompletedForCurrentScene) {
        setAvailableWords(shuffleArray(correctWordsForBank))
        console.log(
          `[App.jsx] Scene ${chapterIndex}-${sceneIndex} - Initializing bank (activity not completed):`,
          JSON.stringify(shuffleArray(correctWordsForBank))
        )
      } else {
        setAvailableWords([])
        console.log(
          `[App.jsx] Scene ${chapterIndex}-${sceneIndex} - Initializing bank (activity completed): bank empty.`
        )
      }
    } else {
      setAvailableWords([])
      console.log(
        `[App.jsx] Scene ${chapterIndex}-${sceneIndex} - No activity or sentences, bank empty.`
      )
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
    if (scrollableTextElement) scrollableTextElement.scrollTop = 0
  }, [
    chapterIndex,
    sceneIndex,
    currentScene,
    activityIsCompletedForCurrentScene,
  ])

  useEffect(() => {
    if (lockTimerRef.current) clearInterval(lockTimerRef.current)
    if (isActivityLockedByGlance) {
      const updateTimer = () => {
        const now = Date.now()
        const remaining = lockTimestamp - now
        if (remaining > 0) setRemainingLockTime(Math.ceil(remaining / 1000))
        else {
          setLockTimestamp(null)
          setRemainingLockTime(0)
          clearInterval(lockTimerRef.current)
          lockTimerRef.current = null
          setGlanceCount(MAX_GLANCES_ALLOWED)
        }
      }
      updateTimer()
      lockTimerRef.current = setInterval(updateTimer, 1000)
    } else setRemainingLockTime(0)
    return () => {
      if (lockTimerRef.current) clearInterval(lockTimerRef.current)
    }
  }, [lockTimestamp, isActivityLockedByGlance, chapterIndex, sceneIndex])
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
  const handleChapterChange = (newIndex) => {
    setChapterIndex(newIndex)
    setSceneIndex(0)
    setBlurPage(false)
    setShowCongratulatoryModal(false)
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
    console.log(
      '[App.jsx] handleWordsInBankChange (onWordsChanged from DragDropSentence) called with:',
      JSON.stringify(newWordsArrayFromDragDrop)
    )
    setAvailableWords(newWordsArrayFromDragDrop) // No shuffle here, DragDropSentence controls the exact list
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
      setAvailableWords(shuffleArray(correctWordsForBank))
      console.log(
        '[App.jsx] Actividad Reseteada - Repoblando banco con:',
        JSON.stringify(correctWordsForBank)
      )
    }
    setBlurPage(false)
    setShowConfetti(false)
    setShowCongratulatoryModal(false)
  }
  const handleToggleActivityView = () => {
    if (!isShowingTextDuringActivity) {
      if (glanceCount > 0) {
        setGlanceCount((prevCount) => {
          const updatedCount = prevCount - 1
          if (updatedCount <= 0 && !activityIsCompletedForCurrentScene)
            setLockTimestamp(Date.now() + LOCK_DURATION_MS)
          return updatedCount
        })
      } else if (
        !isActivityLockedByGlance &&
        !activityIsCompletedForCurrentScene
      ) {
        setLockTimestamp(Date.now() + LOCK_DURATION_MS)
      }
    }
    setIsShowingTextDuringActivity((prev) => !prev)
  }

  const isLastSceneInChapter =
    currentChapter && sceneIndex === currentChapter.scenes.length - 1
  const nextChapterAvailable =
    isLastSceneInChapter &&
    chapterIndex < allChapters.length - 1 &&
    (chapterIndex === 0 || chapterProgress === 100)
  const pageEffectsActive = blurPage || showCongratulatoryModal
  const firstSceneLockActive =
    sceneIndex === 0 && hasActivity && !activityIsCompletedForCurrentScene
  const activityInterfaceIsActiveAndUnresolved =
    hasActivity &&
    showActivity &&
    !activityIsCompletedForCurrentScene &&
    !isActivityLockedByGlance
  const chapterSelectorDisabled =
    pageEffectsActive ||
    isActivityLockedByGlance ||
    firstSceneLockActive ||
    activityInterfaceIsActiveAndUnresolved
  const nextSceneButtonDisabled =
    pageEffectsActive ||
    isActivityLockedByGlance ||
    firstSceneLockActive ||
    (activityInterfaceIsActiveAndUnresolved && !isShowingTextDuringActivity)
  const prevSceneButtonDisabled =
    pageEffectsActive ||
    (sceneIndex === 0 && chapterIndex === 0) ||
    firstSceneLockActive
  const mainControlsDisabled =
    pageEffectsActive ||
    isActivityLockedByGlance ||
    firstSceneLockActive ||
    (activityInterfaceIsActiveAndUnresolved && !isShowingTextDuringActivity)
  const glanceButtonDisabled =
    (glanceCount <= 0 && !isShowingTextDuringActivity) ||
    pageEffectsActive ||
    isActivityLockedByGlance ||
    firstSceneLockActive
  const actionButtonsDisabled = pageEffectsActive || isActivityLockedByGlance

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
          {' '}
          <div className="left-controls">
            {' '}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{ fontSize: '0.9rem', marginRight: '0.5rem' }}
              disabled={mainControlsDisabled}
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>{' '}
            <button
              onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
              style={{ marginRight: '0.25rem' }}
              disabled={fontSizeIndex === 0 || mainControlsDisabled}
            >
              A-
            </button>{' '}
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
            </button>{' '}
            <ChapterSelector
              chapters={allChapters}
              chapterIndex={chapterIndex}
              setChapterIndex={handleChapterChange}
              isDisabled={chapterSelectorDisabled}
            />{' '}
          </div>{' '}
          <div className="right-indicators">
            {' '}
            <div className="nav-buttons-top">
              {' '}
              <button
                onClick={() => {
                  if (sceneIndex > 0) setSceneIndex((prev) => prev - 1)
                  else if (chapterIndex > 0) {
                    const prevCh = chapterIndex - 1
                    setChapterIndex(prevCh)
                    setSceneIndex(allChapters[prevCh].scenes.length - 1)
                  }
                  setShowActivity(false)
                  setIsShowingTextDuringActivity(false)
                  setBlurPage(false)
                  setShowCongratulatoryModal(false)
                }}
                disabled={prevSceneButtonDisabled}
              >
                ⬅️ Previous
              </button>{' '}
              {!isLastSceneInChapter && (
                <button
                  onClick={() => {
                    if (
                      currentChapter &&
                      sceneIndex < currentChapter.scenes.length - 1
                    ) {
                      setSceneIndex((prev) => prev + 1)
                      setShowActivity(false)
                      setIsShowingTextDuringActivity(false)
                      setBlurPage(false)
                      setShowCongratulatoryModal(false)
                    }
                  }}
                  className={
                    animateNextSceneButton ? 'next-scene-button-animate' : ''
                  }
                  disabled={nextSceneButtonDisabled}
                >
                  {' '}
                  Next Scene ➡️{' '}
                </button>
              )}{' '}
              {nextChapterAvailable && (
                <button
                  onClick={handleProceedToNextChapter}
                  disabled={pageEffectsActive}
                >
                  👉 Next Chapter
                </button>
              )}{' '}
            </div>{' '}
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
            )}{' '}
            {getGlobalSceneNumber() && (
              <div className="page-number-top-right">
                Page {getGlobalSceneNumber()}
              </div>
            )}{' '}
          </div>{' '}
        </div>
        <AnimatePresence mode="wait">
          {' '}
          <motion.div
            key={`${chapterIndex}-${sceneIndex}-${showActivity}-${isShowingTextDuringActivity}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="scene-and-activity-container"
          >
            {' '}
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
                      {' '}
                      <DragDropSentence
                        key={currentActivityId + '-active'}
                        activityData={currentScene.activity}
                        initialWords={availableWords}
                        onWordsChanged={handleWordsInBankChange}
                        onActivityComplete={handleActivityComplete}
                      />{' '}
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
                    showActivity &&
                    hasActivity &&
                    !isShowingTextDuringActivity &&
                    !activityIsCompletedForCurrentScene &&
                    !isActivityLockedByGlance
                      ? 'hidden-for-exercise'
                      : ''
                  }`}
                />{' '}
                <div
                  className={`text-container ${
                    showActivity &&
                    hasActivity &&
                    !isShowingTextDuringActivity &&
                    !activityIsCompletedForCurrentScene &&
                    !isActivityLockedByGlance
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
                        showActivity &&
                        hasActivity &&
                        !activityIsCompletedForCurrentScene &&
                        !isShowingTextDuringActivity &&
                        !isActivityLockedByGlance &&
                        !shouldShowInteractiveExercise
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
                                  pageEffectsActive || isActivityLockedByGlance
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
                      (activityIsCompletedForCurrentScene ||
                        isActivityLockedByGlance) &&
                      !isShowingTextDuringActivity && (
                        <div className="activity-overlay-container">
                          {' '}
                          <DragDropSentence
                            key={currentActivityId + '-inline-completed-locked'}
                            activityData={currentScene.activity}
                            initialWords={availableWords}
                            onWordsChanged={handleWordsInBankChange}
                            onActivityComplete={handleActivityComplete}
                          />{' '}
                        </div>
                      )}{' '}
                  </div>{' '}
                </div>{' '}
              </div>
            )}{' '}
          </motion.div>{' '}
        </AnimatePresence>
        {hasActivity &&
          !showActivity &&
          !isActivityLockedByGlance &&
          (activityIsCompletedForCurrentScene ? (
            <button
              onClick={handleResetActivity}
              className="show-activity-button"
              disabled={actionButtonsDisabled}
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
              disabled={actionButtonsDisabled}
            >
              Show Exercise
            </button>
          ))}
        {hasActivity && showActivity && (
          <div className="activity-status-section">
            {' '}
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
                  disabled={actionButtonsDisabled}
                >
                  Reiniciar Ejercicio
                </button>
              </div>
            ) : isActivityLockedByGlance ? (
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
                <button
                  onClick={handleToggleActivityView}
                  className="toggle-activity-view-button"
                  disabled={glanceButtonDisabled}
                >
                  {isShowingTextDuringActivity
                    ? 'Ver Ejercicio'
                    : `Ver Texto (Te quedan ${
                        glanceCount > 0 ? glanceCount : 0
                      } vistazos)`}
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
