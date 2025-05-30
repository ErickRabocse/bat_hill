// src/components/StudentNameModal.jsx
import React, { useState } from 'react'
// Podrías importar un CSS específico si lo deseas, ej: import './StudentNameModal.css';
// O usar las clases globales de app.css para .modal-overlay y .modal-box

function StudentNameModal({ onSubmit, currentName = '', currentGroup = '' }) {
  const [name, setName] = useState(currentName)
  const [group, setGroup] = useState(currentGroup)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && group.trim()) {
      onSubmit(name.trim(), group.trim())
    } else {
      alert('Please enter both your full name and group.') // Alerta simple, puedes mejorar esto
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box student-name-modal">
        {' '}
        {/* Añadida clase específica */}
        <h2>Welcome!</h2>
        <p>Please enter your details to begin:</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Luna Lovegood"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="group">Group:</label>
            <input
              type="text"
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="E.g., 1A"
              required
            />
          </div>
          <button type="submit" className="modal-submit-button">
            Start Learning
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentNameModal
