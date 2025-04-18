// ✅ App.jsx
import { useEffect, useState, useRef } from 'react'
import Word from './Word'
import Glossary from './Glossary'
import scenes from './scenes'

function App() {
  const [userId, setUserId] = useState('')
  const [view, setView] = useState('login') // login | story | glossary
  const [sceneIndex, setSceneIndex] = useState(0)
  const [activeWord, setActiveWord] = useState(null)
  const [voiceRate, setVoiceRate] = useState(1)
  const [isPaused, setIsPaused] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const utteranceRef = useRef(null)

  useEffect(() => {
    const savedId = localStorage.getItem('studentId')
    if (savedId) {
      setUserId(savedId)
      setView('story')
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.word-span')) {
        setActiveWord(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const speakScene = () => {
    const scene = scenes[sceneIndex]
    const fullText = scene.text.reduce((acc, { word }, i) => {
      if (['.', ',', '!', '?', '...'].includes(word)) {
        return acc + word
      } else {
        return acc + (i === 0 ? word : ' ' + word)
      }
    }, '')

    const utterance = new SpeechSynthesisUtterance(fullText)
    utterance.lang = 'en-US'
    utterance.rate = voiceRate

    const voices = speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) =>
        v.lang === 'en-US' &&
        (v.name.includes('Google US English') ||
          v.name.includes('Microsoft David'))
    )
    if (preferred) utterance.voice = preferred

    utterance.onboundary = (event) => {
      const charIndex = event.charIndex
      const upToChar = fullText.slice(0, charIndex)
      const words = upToChar.trim().split(/\s+/)
      setHighlightedIndex(words.length - 1)
    }

    utterance.onend = () => setHighlightedIndex(-1)

    utteranceRef.current = utterance
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
    setIsPaused(false)
  }

  const togglePause = () => {
    if (speechSynthesis.speaking) {
      if (isPaused) {
        speechSynthesis.resume()
        setIsPaused(false)
      } else {
        speechSynthesis.pause()
        setIsPaused(true)
      }
    }
  }

  const speakWord = (word) => {
    const utter = new SpeechSynthesisUtterance(word)
    utter.lang = 'en-US'
    utter.rate = voiceRate
    const voices = speechSynthesis.getVoices()
    const preferred = voices.find(
      (v) => v.lang === 'en-US' && v.name.toLowerCase().includes('female')
    )
    if (preferred) utter.voice = preferred
    speechSynthesis.cancel()
    speechSynthesis.speak(utter)
  }

  if (view === 'login') {
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <h2>Welcome!</h2>
        <p>Enter your student ID to begin:</p>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. 20231234"
        />
        <button
          onClick={() => {
            if (userId.trim()) {
              localStorage.setItem('studentId', userId.trim())
              setUserId(userId.trim())
              setView('story')
            }
          }}
          style={{ marginLeft: '1rem' }}
        >
          Start
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={() => setActiveWord(null)}
      style={{ padding: '2rem', fontFamily: 'Arial' }}
    >
      <nav style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setView('story')}
          style={{ marginRight: '1rem' }}
        >
          📖 Story
        </button>
        <button onClick={() => setView('glossary')}>📘 My Glossary</button>
      </nav>

      <p style={{ fontSize: '0.9rem', color: '#555' }}>
        🔑 Student ID: <strong>{userId}</strong>{' '}
        <button
          onClick={() => {
            localStorage.removeItem('studentId')
            setUserId('')
            setView('login')
          }}
          style={{
            marginLeft: '1rem',
            fontSize: '0.8rem',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '2px 6px',
            cursor: 'pointer',
          }}
        >
          🔒 Log out
        </button>
      </p>

      {view === 'story' && (
        <>
          <h1>The Guardian of the Bat Hill</h1>
          <p>
            {scenes[sceneIndex].text.map(({ word, translation }, index) => (
              <Word
                key={`${word}-${index}`}
                text={word}
                translation={translation}
                userId={userId}
                activeWord={activeWord}
                setActiveWord={setActiveWord}
                onSpeak={speakWord}
                isHighlighted={index === highlightedIndex}
              />
            ))}
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <button onClick={speakScene}>🗣️ Play Scene</button>
            <button onClick={togglePause} style={{ marginLeft: '1rem' }}>
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>

            <button
              onClick={() =>
                setVoiceRate((prev) => {
                  const next = parseFloat((prev + 0.2).toFixed(1))
                  return next > 1.5 ? 0.5 : next
                })
              }
              style={{ marginLeft: '1rem' }}
            >
              🎚️ Speed: {voiceRate.toFixed(1)}x
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setSceneIndex((prev) => Math.max(prev - 1, 0))}
              disabled={sceneIndex === 0}
              style={{ marginRight: '1rem' }}
            >
              ⬅️ Previous
            </button>
            <button
              onClick={() =>
                setSceneIndex((prev) => Math.min(prev + 1, scenes.length - 1))
              }
              disabled={sceneIndex === scenes.length - 1}
            >
              Next ➡️
            </button>
          </div>
        </>
      )}

      {view === 'glossary' && <Glossary userId={userId} />}
    </div>
  )
}

export default App
