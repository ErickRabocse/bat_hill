// En App.js

import { useEffect, useState } from 'react'
import Word from './Word'
import chapters from './chapters'
import ChapterSelector from './components/ChapterSelector'
import DragDropSentence from './components/DragDropSentence'
import { motion, AnimatePresence } from 'framer-motion'
import './app.css' // Asegúrate de que este archivo CSS contiene los estilos para .blur-active, etc.

function App() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex')
    return saved !== null ? parseInt(saved, 10) : 2
  })

  // Estado para controlar si la actividad de la escena actual está completada
  const [isActivityCompleted, setIsActivityCompleted] = useState(() => {
    const savedActivities = localStorage.getItem('completedActivities')
    return savedActivities ? JSON.parse(savedActivities) : {}
  })

  // Estado para controlar si la actividad está visible en la escena actual
  const [showActivity, setShowActivity] = useState(false)

  // Estado: true si el texto está borroso, false si el ejercicio está borroso
  // Inicialmente, cuando la actividad no se ha mostrado, no hay desenfoque.
  // Una vez que se muestra, por defecto el texto se desenfoca.
  const [isTextBlurred, setIsTextBlurred] = useState(false)

  // Variables calculadas que dependen de los estados. Deben declararse después de los estados.
  const currentChapter = chapters[chapterIndex]
  const currentScene = currentChapter.scenes[sceneIndex]
  const hasActivity = currentScene.activity !== undefined
  const currentActivityId = `${chapterIndex}-${sceneIndex}`
  const activityIsCompletedForCurrentScene =
    isActivityCompleted[currentActivityId]
  // isActivityBlurred se calculará directamente para el CSS

  // Efecto para restablecer showActivity, isTextBlurred y hacer scroll al inicio al cambiar de escena o capítulo
  useEffect(() => {
    setShowActivity(false)
    setIsTextBlurred(false) // Resetear el desenfoque al cambiar de escena
    const scrollableTextElement = document.querySelector('.scrollable-text')
    if (scrollableTextElement) {
      scrollableTextElement.scrollTop = 0
    }
  }, [chapterIndex, sceneIndex])

  // Efecto para establecer el desenfoque inicial cuando la actividad se muestra
  useEffect(() => {
    if (hasActivity && showActivity && !activityIsCompletedForCurrentScene) {
      // Cuando la actividad se muestra por primera vez, el texto se desenfoca por defecto
      setIsTextBlurred(true)
    }
  }, [showActivity, hasActivity, activityIsCompletedForCurrentScene])

  // Sincronizar el estado de las actividades completadas con localStorage
  useEffect(() => {
    localStorage.setItem(
      'completedActivities',
      JSON.stringify(isActivityCompleted)
    )
  }, [isActivityCompleted])

  // Manejo del modo oscuro y estilos del body
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

  // Persistencia del tamaño de fuente en localStorage
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
      setIsTextBlurred(false) // Texto claro al completar
      // showActivity ya estará en true, no necesitamos cambiarlo
    }
  }

  const handleResetActivity = () => {
    setIsActivityCompleted((prev) => {
      const newState = { ...prev }
      delete newState[currentActivityId]
      return newState
    })
    setShowActivity(true)
    setIsTextBlurred(true) // Texto borroso al reiniciar
  }

  // NUEVA FUNCIÓN para alternar el desenfoque
  const handleToggleBlur = () => {
    setIsTextBlurred((prev) => !prev) // Invierte el estado del desenfoque del texto
  }

  // Bloquear el botón 'Next' si hay actividad y no está completada
  const nextButtonDisabled = hasActivity && !activityIsCompletedForCurrentScene

  // Comprobar si se puede avanzar al siguiente capítulo
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
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{ fontSize: '0.9rem', marginRight: '1rem' }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button
          onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
          style={{ marginRight: '0.5rem' }}
        >
          A-
        </button>
        <button
          onClick={() =>
            setFontSizeIndex((prev) => Math.min(fontSizes.length - 1, prev + 1))
          }
        >
          A+
        </button>
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
                  />
                </div>
              </div>

              {/* Contenido de la escena (texto y página) */}
              {/* Aplicar la clase 'blur-active' si isTextBlurred es true */}
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

                {getGlobalSceneNumber() && (
                  <div className="page-number">
                    Page {getGlobalSceneNumber()}
                  </div>
                )}
              </div>

              {/* Botón inicial para mostrar la actividad */}
              {hasActivity &&
                !activityIsCompletedForCurrentScene &&
                !showActivity && (
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

              {/* Botón Único de Alternancia de Desenfoque (aparece cuando la actividad ya está visible) */}
              {hasActivity &&
                showActivity &&
                !activityIsCompletedForCurrentScene && (
                  <button
                    onClick={handleToggleBlur}
                    className="toggle-blur-button" // Usaremos esta clase para estilizarlo
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      width: '100%',
                    }}
                  >
                    {isTextBlurred ? 'View Text' : 'View Exercise'}{' '}
                    {/* Cambia el texto del botón */}
                  </button>
                )}

              {/* Renderizado condicional de la actividad */}
              {hasActivity &&
                showActivity &&
                !activityIsCompletedForCurrentScene && (
                  // La actividad se desenfoca si isTextBlurred es false (es decir, el texto está claro)
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

              {hasActivity && activityIsCompletedForCurrentScene && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
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
                    Reset Exercise
                  </button>
                </div>
              )}

              <div className="nav-buttons">
                <button
                  onClick={() => {
                    setSceneIndex((prev) => Math.max(prev - 1, 0))
                    setShowActivity(false)
                    setIsTextBlurred(false) // Asegurarse de quitar cualquier desenfoque al retroceder
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
