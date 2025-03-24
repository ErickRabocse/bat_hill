import { useState } from 'react'
import { db, auth } from './firebase'
import { collection, addDoc } from 'firebase/firestore'

function Word({ text, translation }) {
  const [saved, setSaved] = useState(false)

  const handleClick = async () => {
    // 🔊 Speak the word
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    speechSynthesis.speak(utter)

    // 🔐 Get current user
    const user = auth.currentUser
    if (!user) {
      console.warn('No authenticated user')
      return
    }

    try {
      const userGlossaryRef = collection(db, 'glossaries', user.uid, 'words')

      await addDoc(userGlossaryRef, {
        word: text,
        meaning: translation,
        date: new Date().toISOString(),
      })

      console.log(`✅ Word "${text}" saved for user ${user.uid}`)
      setSaved(true)
    } catch (error) {
      console.error('❌ Error saving word:', error)
    }
  }

  return (
    <span
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        backgroundColor: saved ? '#d1fae5' : 'transparent',
        padding: '3px 6px',
        borderRadius: '6px',
        transition: 'background 0.3s',
        marginRight: '5px',
        display: 'inline-block',
      }}
      title={`"${text}" → ${translation}`}
    >
      {text}
    </span>
  )
}

export default Word
