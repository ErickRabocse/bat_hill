import { useEffect, useState } from 'react'
import { db, auth } from './firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'

import { onAuthStateChanged } from 'firebase/auth'

function Glossary() {
  const [user, setUser] = useState(null)
  const [words, setWords] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log('✅ User UID:', firebaseUser.uid)
        setUser(firebaseUser)

        const userWordsRef = collection(
          db,
          'glossaries',
          firebaseUser.uid,
          'words'
        )
        // 'asc' a 'desc' para que las más nuevas aparezcan arriba
        const q = query(userWordsRef, orderBy('date', 'asc'))
        const snapshot = await getDocs(q)

        const wordList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setWords(wordList)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id) => {
    if (!user) return

    await deleteDoc(doc(db, 'glossaries', user.uid, 'words', id))

    setWords((prev) => prev.filter((word) => word.id !== id))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>📘 My Glossary</h2>
      {words.length === 0 ? (
        <p>No words saved yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: 'collapse', marginTop: '1rem' }}
        >
          <thead>
            <tr>
              <th>Word</th>
              <th>Meaning</th>
              <th>Date</th>
              <th>❌</th>
            </tr>
          </thead>
          <tbody>
            {words.map(({ id, word, meaning, date }) => (
              <tr key={id}>
                <td>{word}</td>
                <td>{meaning}</td>
                <td>{new Date(date).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Glossary
