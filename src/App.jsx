import { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Word from './Word'
import Glossary from './Glossary'
import scenes from './scenes'

function App() {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('') // nombre guardado en Firestore
  const [nameInput, setNameInput] = useState('') // nombre que el usuario escribe
  const [nameLoaded, setNameLoaded] = useState(false)
  const [view, setView] = useState('story')
  const [sceneIndex, setSceneIndex] = useState(0)

  const [voiceReady, setVoiceReady] = useState(false)

  useEffect(() => {
    if (!window.responsiveVoice) {
      const script = document.createElement('script')
      script.src =
        'https://code.responsivevoice.org/responsivevoice.js?key=free'
      script.async = true
      script.onload = () => {
        console.log('✅ ResponsiveVoice is ready')
        setVoiceReady(true)
      }
      document.body.appendChild(script)
    } else {
      setVoiceReady(true)
    }
  }, [])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=free'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ User signed in:', firebaseUser.uid)
        setUser(firebaseUser)

        const fetchName = async () => {
          const userDoc = doc(db, 'glossaries', firebaseUser.uid)
          const userSnap = await getDoc(userDoc)

          if (userSnap.exists()) {
            const name = userSnap.data().name || ''
            setUserName(name)
            setNameInput(name)
          }

          setNameLoaded(true)
        }

        fetchName()
      }
    })

    return () => unsubscribe()
  }, [])

  const saveUserName = async () => {
    if (!user) return

    const userDoc = doc(db, 'glossaries', user.uid)
    await setDoc(userDoc, { name: nameInput }, { merge: true })
    setUserName(nameInput)
    alert('✅ Name saved!')
  }

  const speakScene = () => {
    if (!voiceReady || !window.responsiveVoice) {
      console.warn('⏳ ResponsiveVoice not ready yet')
      return
    }

    const scene = scenes[sceneIndex]
    const fullText = scene.text.map(({ word }) => word).join(' ')

    window.responsiveVoice.speak(fullText, 'Spanish Latin American Female')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <nav style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setView('story')}
          style={{ marginRight: '1rem' }}
        >
          📖 Story
        </button>
        <button onClick={() => setView('glossary')}>📘 My Glossary</button>
      </nav>

      {user &&
        nameLoaded &&
        (userName ? (
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            🔑 Logged in as: <strong>{userName}</strong>
          </p>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <label>
              Enter your name:{' '}
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </label>
            <button onClick={saveUserName} style={{ marginLeft: '1rem' }}>
              Save
            </button>
          </div>
        ))}

      {view === 'story' && (
        <>
          <h1>The Guardian of the Bat Hill</h1>

          <p>
            {scenes[sceneIndex].text.map(({ word, translation }, index) => (
              <Word key={index} text={word} translation={translation} />
            ))}
          </p>
          <button
            onClick={speakScene}
            disabled={!voiceReady}
            style={{ marginBottom: '1rem' }}
          >
            🔊 Play Scene
          </button>

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

      {view === 'glossary' && <Glossary />}
    </div>
  )
}

export default App
