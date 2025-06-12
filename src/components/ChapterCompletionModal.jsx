// src/components/ChapterCompletionModal.jsx
import React from 'react'

// Eliminada la prop 'onClose' de los parámetros
function ChapterCompletionModal({ details, onProceed }) {
  if (!details) return null

  const {
    chapterNumber,
    chapterTitle,
    studentName,
    studentGroup,
    completionTimestamp,
    durationMinutes,
  } = details

  const formattedDate = completionTimestamp
    ? new Date(completionTimestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  const formattedTime = completionTimestamp
    ? new Date(completionTimestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : ''

  // La función onProceed (que es handleProceedToNextChapter o handleCloseCongratulatoryModal en App.jsx)
  // ya se encarga de cerrar el modal.
  const handleProceed = () => {
    if (onProceed) {
      onProceed()
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      <div className="modal-box chapter-completion-modal">
        <h2>Congratulations, {studentName}!</h2>
        {studentGroup && (
          <p
            style={{
              fontSize: '0.9em',
              marginTop: '-10px',
              marginBottom: '15px',
            }}
          >
            <em>(Group: {studentGroup})</em>
          </p>
        )}
        <p>
          You have successfully completed{' '}
          <strong>
            Chapter {chapterNumber}: {chapterTitle}
          </strong>
          <br />
          on <strong>{formattedDate}</strong> at{' '}
          <strong>{formattedTime}</strong>.
        </p>
        {durationMinutes !== undefined && (
          <p>
            Time taken for this chapter:{' '}
            <strong>{durationMinutes} minutes</strong>.
          </p>
        )}
        <p>Excellent work, keep it up!</p>
        <button onClick={handleProceed} className="modal-submit-button">
          Start Practice Exercise
        </button>
      </div>
    </div>
  )
}

export default ChapterCompletionModal
