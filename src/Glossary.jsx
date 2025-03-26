// 📘 glossary.jsx
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
import { jsPDF } from 'jspdf'

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

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(14)
    doc.text(`My Glossary – ${userId}`, 20, 20)

    words.forEach((item, index) => {
      const line = `${index + 1}. ${item.word} — ${item.meaning}`
      doc.text(line, 20, 30 + index * 10)
    })

    doc.save(`Glossary_${userId}.pdf`)
  }

  const sendToWhatsApp = () => {
    if (words.length === 0) return

    const messageLines = words.map(
      (w, i) => `${i + 1}. ${w.word} — ${w.meaning}`
    )
    const fullMessage = `Here is my English glossary:\n\n${messageLines.join(
      '\n'
    )}`

    const encodedMessage = encodeURIComponent(fullMessage)
    const whatsappURL = `https://wa.me/?text=${encodedMessage}`

    window.open(whatsappURL, '_blank')
  }

  return (
    <div>
      <h2>📘 My Glossary</h2>

      <button
        onClick={exportToPDF}
        style={{
          marginBottom: '0.5rem',
          padding: '6px 12px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginRight: '1rem',
        }}
      >
        📄 Download PDF
      </button>

      <button
        onClick={sendToWhatsApp}
        style={{
          marginBottom: '1rem',
          padding: '6px 12px',
          backgroundColor: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        📲 Send to WhatsApp
      </button>

      {words.length === 0 ? (
        <p>No words saved yet.</p>
      ) : (
        <ul style={{ paddingLeft: '1rem' }}>
          {words.map(({ id, word, meaning, date }) => (
            <li key={id} style={{ marginBottom: '0.5rem' }}>
              <strong>{word}</strong> — {meaning}
              <br />
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
