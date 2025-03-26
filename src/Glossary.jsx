import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from './firebase'

function Glossary({ userId }) {
  const [words, setWords] = useState([])

  useEffect(() => {
    const fetchWords = async () => {
      if (!userId) return

      const userWordsRef = collection(db, 'glossaries', userId, 'words')
      const q = query(userWordsRef, orderBy('date', 'asc'))
      const snapshot = await getDocs(q)

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setWords(data)
    }

    fetchWords()
  }, [userId])

  const handleDelete = async (wordId) => {
    if (!userId) return

    const wordRef = doc(db, 'glossaries', userId, 'words', wordId)
    await deleteDoc(wordRef)
    setWords((prev) => prev.filter((w) => w.id !== wordId))
  }

  return (
    <div>
      <h2>📘 My Glossary</h2>
      {words.length === 0 ? (
        <p>No words saved yet.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {words.map(({ id, word, meaning, date }) => (
            <li key={id} style={{ marginBottom: '0.5rem' }}>
              <strong>{word}</strong> — {meaning} <br />
              <small style={{ color: '#666' }}>
                🗓️ {new Date(date).toLocaleDateString()}
              </small>
              <button
                onClick={() => handleDelete(id)}
                style={{
                  marginLeft: '1rem',
                  fontSize: '0.8rem',
                  color: '#a00',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Glossary
