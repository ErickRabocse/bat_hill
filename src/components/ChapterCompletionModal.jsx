// src/components/ChapterCompletionModal.jsx
import React from 'react'

// Versión final y flexible del modal
export function ChapterCompletionModal({ details, onProceed, buttonText }) {
  if (!details) return null

  // La función que se ejecuta al hacer clic en el botón
  const handleProceed = () => {
    if (onProceed) {
      onProceed()
    }
  }

  // Damos formato a la fecha y hora solo si existen los datos para ello
  const formattedDate = details.completionTimestamp
    ? new Date(details.completionTimestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const formattedTime = details.completionTimestamp
    ? new Date(details.completionTimestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  return (
    <div className="modal-overlay">
      <div className="modal-box chapter-completion-modal">
        {/* Si pasamos un título personalizado, lo usamos. Si no, el de por defecto. */}
        <h2>
          {details.customTitle || `Congratulations, ${details.studentName}!`}
        </h2>

        {details.studentGroup && !details.customMessage && (
          <p
            style={{
              fontSize: '0.9em',
              marginTop: '-10px',
              marginBottom: '15px',
            }}
          >
            <em>(Group: {details.studentGroup})</em>
          </p>
        )}

        {/* Si pasamos un mensaje personalizado, lo usamos. Si no, el de por defecto. */}
        {details.customMessage ? (
          <p>{details.customMessage}</p>
        ) : (
          <p>
            You have successfully completed{' '}
            <strong>
              Chapter {details.chapterNumber}: {details.chapterTitle}
            </strong>
            <br />
            on <strong>{formattedDate}</strong> at{' '}
            <strong>{formattedTime}</strong>.
          </p>
        )}

        {details.durationMinutes !== undefined && (
          <p>
            Time taken for this chapter:{' '}
            <strong>{details.durationMinutes} minutes</strong>.
          </p>
        )}

        <p>Excellent work, {details.studentName}! Keep it up!</p>
        <button onClick={handleProceed} className="modal-submit-button">
          {buttonText || 'Practice Section'}
        </button>
      </div>
    </div>
  )
}
