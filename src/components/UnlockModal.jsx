import { useState } from 'react'

function UnlockModal({ onClose, onUnlock, correctCode }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    if (input.trim() === correctCode) {
      onUnlock()
      onClose()
    } else {
      setError(true)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Enter the code to unlock this chapter</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type code here"
        />
        {error && <p className="error-message">Incorrect code. Try again.</p>}
        <div className="modal-actions">
          <button onClick={handleSubmit}>Unlock</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default UnlockModal
