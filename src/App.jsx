import { useEffect, useState } from 'react'
import Word from './Word'
import chapters from './chapters'
import ChapterSelector from './components/ChapterSelector'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import './app.css'

function App() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex')
    return saved !== null ? parseInt(saved, 10) : 2
  })

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#1e1e1e' : '#fffbe6'
    document.body.style.margin = '0'
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('fontSizeIndex', fontSizeIndex.toString())
  }, [fontSizeIndex])

  const fontSizes = ['1rem', '1.25rem', '1.5rem', '1.75rem', '2rem']
  const fontSize = fontSizes[fontSizeIndex] || '1.2rem'
  const currentScene = chapters[chapterIndex].scenes[sceneIndex]
  const [activeWord, setActiveWord] = useState(null)
  const voiceRate = 0.6
  const [highlightedSentenceIndex, setHighlightedSentenceIndex] = useState(null)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.word-span')) {
        setActiveWord(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

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
    utter.rate = voiceRate
    const preferred = getPreferredVoice()
    if (preferred) utter.voice = preferred
    speechSynthesis.cancel()
    speechSynthesis.speak(utter)
    setActiveWord(word)
  }

  const getWordTimings = (textArray, delayBeforeStart = 1000) => {
    const baseWPM = 390
    const wps = (baseWPM / 60) * voiceRate
    const baseWordDuration = 950 / wps
    const punctuationMarks = ['.', ',', '...', '!', '?']
    const isPunctuation = (token) => punctuationMarks.includes(token)

    let timings = []
    let time = delayBeforeStart

    for (let i = 0; i < textArray.length; i++) {
      const word = textArray[i]
      timings.push(time)
      const charDelay = isPunctuation(word) ? 0 : word.length * 10
      const punctuationPause = isPunctuation(word) ? 600 : 0
      time += baseWordDuration + charDelay + punctuationPause
    }

    return timings
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

  return (
    <div
      className="app-container"
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

              <div className="scrollable-text">
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
                      utter.rate = voiceRate
                      const preferred = getPreferredVoice()
                      if (preferred) utter.voice = preferred

                      const textArray = sentence.map(({ word }) => word)
                      const delayBeforeStart = 1000
                      const timings = getWordTimings(
                        textArray,
                        delayBeforeStart
                      )
                      let timerIds = []

                      setHighlightedSentenceIndex(sIndex)
                      setHighlightedIndex(-1)

                      timings.forEach((time, index) => {
                        const id = setTimeout(() => {
                          setHighlightedIndex(index)
                        }, time)
                        timerIds.push(id)
                      })

                      utter.onend = () => {
                        setTimeout(() => {
                          setHighlightedIndex(-1)
                          setHighlightedSentenceIndex(null)
                          timerIds.forEach(clearTimeout)
                        }, 400)
                      }

                      speechSynthesis.cancel()
                      setTimeout(() => {
                        speechSynthesis.speak(utter)
                      }, delayBeforeStart)
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
                            return isPunctuation ? (
                              <span key={`${word}-${globalIndex}`}>{word}</span>
                            ) : (
                              <span
                                key={`${word}-${globalIndex}`}
                                style={{ marginRight: '0.5rem' }}
                              >
                                <Word
                                  text={word}
                                  translation={translation}
                                  activeWord={activeWord}
                                  setActiveWord={setActiveWord}
                                  onSpeak={speakWord}
                                  isHighlighted={
                                    sIndex === highlightedSentenceIndex &&
                                    localIndex === highlightedIndex
                                  }
                                  isSameAsActive={activeWord === word}
                                  fontSize={fontSize}
                                  highlightColor={
                                    darkMode ? '#00ffff' : '#007acc'
                                  }
                                />
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

              <div className="nav-buttons">
                <button
                  onClick={() => setSceneIndex((prev) => Math.max(prev - 1, 0))}
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
                  disabled={
                    sceneIndex === chapters[chapterIndex].scenes.length - 1
                  }
                >
                  Next ➡️
                </button>
                {sceneIndex === chapters[chapterIndex].scenes.length - 1 &&
                  chapterIndex < chapters.length - 1 && (
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
