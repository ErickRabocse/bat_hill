import { useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Word from './Word'
import Glossary from './Glossary'

function App() {
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('') // nombre guardado en Firestore
  const [nameInput, setNameInput] = useState('') // nombre que el usuario escribe
  const [nameLoaded, setNameLoaded] = useState(false)
  const [view, setView] = useState('story')

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
            <Word text="Adi" translation="(nombre propio)" />
            <Word text="walks" translation="camina" />
            <Word text="to" translation="a" />
            <Word text="the" translation="el/la" />
            <Word text="hill" translation="cerro" />
            <Word text="every" translation="cada" />
            <Word text="morning" translation="mañana" />.
          </p>
        </>
      )}

      {view === 'glossary' && <Glossary />}
    </div>
  )
}

export default App
