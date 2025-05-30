// src/components/ChapterCompletionModal.jsx
import React from 'react'

function ChapterCompletionModal({
  details,
  onClose,
  onProceed,
  isLastChapterInBook,
}) {
  if (!details) return null

  const { chapterTitle, studentName, studentGroup, completionTimestamp } =
    details

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

  const handleProceed = () => {
    if (onProceed) {
      onProceed()
    } else {
      onClose() // Fallback si no hay acción de "proceed"
    }
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 1050 }}>
      {' '}
      {/* Asegurar que esté sobre el blur */}
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
            Chapter {details.chapterNumber}: {chapterTitle}
          </strong>
          <br />
          on <strong>{formattedDate}</strong> at{' '}
          <strong>{formattedTime}</strong>.
        </p>
        <p>Excellent work, keep it up!</p>
        <button onClick={handleProceed} className="modal-submit-button">
          {isLastChapterInBook ? 'Finish Book' : 'Continue to Next Chapter'}
        </button>
      </div>
    </div>
  )
}

export default ChapterCompletionModal
