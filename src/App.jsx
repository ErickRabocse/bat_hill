import { useEffect, useState } from 'react'
import { db, auth } from './firebase'
import { collection, addDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import Word from './Word'

function App() {
  const [user, setUser] = useState(null)

  // 1. Wait for Firebase to give us the authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ User signed in:', firebaseUser.uid)
        setUser(firebaseUser)
      } else {
        console.log('❌ No user')
      }
    })

    return () => unsubscribe()
  }, [])

  // 2. Save the word after user is available
  useEffect(() => {
    const saveWord = async () => {
      if (!user) return

      try {
        const userGlossaryRef = collection(db, 'glossaries', user.uid, 'words')

        await addDoc(userGlossaryRef, {
          word: 'corn',
          meaning: 'maíz',
          date: new Date().toISOString(),
        })

        console.log('✅ Word saved to user’s glossary!')
      } catch (error) {
        console.error('❌ Error saving word:', error)
      }
    }

    saveWord()
  }, [user])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
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
    </div>
  )
}

export default App
