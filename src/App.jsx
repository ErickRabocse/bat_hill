import { useEffect, useState } from 'react'
import Word from './Word'
import chapters from './chapters'
import ChapterSelector from './components/ChapterSelector'

function App() {
  const [chapterIndex, setChapterIndex] = useState(0)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [fontSizeIndex, setFontSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex')
    return saved !== null ? parseInt(saved, 10) : 2
  })

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
            v.name.includes('Microsoft David'))
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

  const backgroundColor = darkMode ? '#1e1e1e' : '#fffbe6'
  const textColor = darkMode ? '#f0f0f0' : '#333'

  return (
    <div
      onClick={() => setActiveWord(null)}
      style={{
        padding: '2rem',
        fontFamily: 'Georgia, serif',
        fontSize,
        backgroundColor,
        color: textColor,
        minHeight: '100vh',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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

      <div
        style={{ display: 'flex', alignItems: 'flex-start', marginTop: '2rem' }}
      >
        <img
          src={currentScene.image}
          alt={`Scene ${sceneIndex + 1}`}
          style={{
            width: '33%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
            marginRight: '2rem',
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h1 style={{ margin: 0, textAlign: "center" }}>Luna's journey</h1>
            {/* <h2 style={{ marginTop: '0.5rem' }}>
              {chapters[chapterIndex].title}
            </h2> */}
            <div style={{ marginTop: '0.5rem' }}>
              <ChapterSelector
                chapters={chapters}
                chapterIndex={chapterIndex}
                setChapterIndex={setChapterIndex}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.3rem',
            }}
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
                  utter.rate = voiceRate
                  const preferred = getPreferredVoice()
                  if (preferred) utter.voice = preferred

                  const textArray = sentence.map(({ word }) => word)
                  const delayBeforeStart = 1000
                  const timings = getWordTimings(textArray, delayBeforeStart)
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
                  <span
                    key={sIndex}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      marginRight: '0.5rem',
                    }}
                  >
                    <button
                      onClick={playSentence}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.35rem',
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        backgroundColor: '#f8f8f8',
                        transition: 'background-color 0.2s, box-shadow 0.2s',
                        marginRight: '0.3rem',
                        lineHeight: '1',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#e6f0ff'
                        e.currentTarget.style.boxShadow =
                          '0 0 3px rgba(0,0,0,0.2)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f8f8'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      🔊
                    </button>
                    {sentence.map(
                      (
                        { word, translation, index: globalIndex },
                        localIndex
                      ) => (
                        <Word
                          key={`${word}-${globalIndex}`}
                          text={word}
                          translation={translation}
                          activeWord={activeWord}
                          setActiveWord={setActiveWord}
                          onSpeak={speakWord}
                          isHighlighted={
                            sIndex === highlightedSentenceIndex &&
                            localIndex === highlightedIndex
                          }
                          fontSize={fontSize}
                          highlightColor={darkMode ? '#00ffff' : '#007acc'}
                        />
                      )
                    )}
                  </span>
                )
              })
            })()}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={() => setSceneIndex((prev) => Math.max(prev - 1, 0))}
              disabled={sceneIndex === 0}
              style={{ marginRight: '1rem' }}
            >
              ⬅️ Previous
            </button>
            <button
              onClick={() =>
                setSceneIndex((prev) =>
                  Math.min(prev + 1, chapters[chapterIndex].scenes.length - 1)
                )
              }
              disabled={sceneIndex === chapters[chapterIndex].scenes.length - 1}
            >
              Next ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
