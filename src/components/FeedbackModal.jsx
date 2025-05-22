import React from 'react';
import './FeedbackModal.css'; // Crearemos este archivo CSS a continuación

function FeedbackModal({ message, hint, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box feedback-modal-box">
        <h3>¡Ups! Algo salió mal...</h3>
        <p className="feedback-message">{message}</p>
        {hint && <p className="feedback-hint">**Pista:** {hint}</p>}
        <button onClick={onClose} className="feedback-button">
          Entendido
        </button>
      </div>
    </div>
  );
}

export default FeedbackModal;