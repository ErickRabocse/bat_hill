import { useEffect, useState } from 'react'
import { db } from './firebase'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'

function Word({ text, translation, userId, activeWord, setActiveWord }) {
  const [saved, setSaved] = useState(false)
  const isActive = activeWord === text

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!userId) return

      const userWordsRef = collection(db, 'glossaries', userId, 'words')
      const q = query(userWordsRef, where('word', '==', text))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        setSaved(true)
      }
    }

    checkIfSaved()
  }, [text, userId])

  const handleClick = () => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    speechSynthesis.speak(utter)

    if (!saved) {
      setActiveWord(text)
    }
  }

  const handleSave = async () => {
    if (!userId) {
      console.warn('No user ID')
      return
    }

    const userWordsRef = collection(db, 'glossaries', userId, 'words')
    const q = query(userWordsRef, where('word', '==', text))
    const snapshot = await getDocs(q)

    if (!snapshot.empty) {
      setSaved(true)
      setActiveWord(null)
      return
    }

    try {
      await addDoc(userWordsRef, {
        word: text,
        meaning: translation,
        date: new Date().toISOString(),
      })
      setSaved(true)
      console.log(`✅ Word "${text}" saved`)
    } catch (err) {
      console.error('❌ Error saving word:', err)
    }

    setActiveWord(null)
  }

  return (
    <span
      className="word-span"
      onClick={(e) => {
        e.stopPropagation()
        handleClick()
      }}
      style={{
        cursor: 'pointer',
        backgroundColor: saved ? '#d1fae5' : 'transparent',
        padding: '3px 6px',
        borderRadius: '6px',
        transition: 'background 0.3s',
        marginRight: '5px',
        display: 'inline-block',
        position: 'relative',
      }}
      title={`"${text}" → ${translation}`}
    >
      {text}

      {isActive && !saved && (
        <div
          style={{
            position: 'absolute',
            top: '120%',
            left: 0,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          <p style={{ margin: '0 0 6px' }}>
            Save "<strong>{text}</strong>" to glossary?
          </p>
          <p
            style={{
              margin: '0 0 6px',
              fontStyle: 'italic',
              fontSize: '0.9rem',
            }}
          >
            {text} → {translation}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleSave()
            }}
            style={{ marginRight: '0.5rem' }}
          >
            Yes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveWord(null)
            }}
          >
            No
          </button>
        </div>
      )}
    </span>
  )
}

export default Word
