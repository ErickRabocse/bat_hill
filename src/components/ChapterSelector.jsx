// En components/ChapterSelector.jsx

import React, { useState, useEffect, useRef } from 'react'
import './chapterSelector.css'

// Añadir la prop isDisabled
function ChapterSelector({
  chapters,
  chapterIndex,
  setChapterIndex,
  isDisabled,
}) {
  const [showTranslation, setShowTranslation] = useState(false)
  const timeoutRef = useRef(null)

  const handleChange = (event) => {
    // Solo permitir el cambio si no está deshabilitado
    if (!isDisabled) {
      const selectedIndex = parseInt(event.target.value, 10)
      setChapterIndex(selectedIndex)
      setShowTranslation(false)
      clearTimeout(timeoutRef.current)
    }
  }

  const handleTitleClick = () => {
    setShowTranslation(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setShowTranslation(false)
    }, 3000)
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div>
      <select
        value={chapterIndex}
        onChange={handleChange}
        disabled={isDisabled}
      >
        {' '}
        {/* <-- CAMBIO CLAVE AQUÍ */}
        {chapters.map((chapter, index) => (
          <option key={chapter.id} value={index}>
            {index === 0 ? 'Introduction' : `Chapter ${index}`}
          </option>
        ))}
      </select>
      <div>
        <h2
          onClick={handleTitleClick}
          className="glow"
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {showTranslation
            ? chapters[chapterIndex].titleTranslation || 'Translation missing'
            : chapters[chapterIndex].title}
        </h2>
      </div>
    </div>
  )
}

export default ChapterSelector
