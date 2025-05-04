import React, { useState, useEffect, useRef } from 'react'
import './chapterSelector.css'

function ChapterSelector({ chapters, chapterIndex, setChapterIndex }) {
  const [showTranslation, setShowTranslation] = useState(false)
  const timeoutRef = useRef(null)

  const handleChange = (event) => {
    const selectedIndex = parseInt(event.target.value, 10)
    setChapterIndex(selectedIndex)
    setShowTranslation(false) // Reset translation view when chapter changes
    clearTimeout(timeoutRef.current) // Clear any existing timeout
  }

  const handleTitleClick = () => {
    setShowTranslation(true)
    clearTimeout(timeoutRef.current) // Clear any existing timeout
    timeoutRef.current = setTimeout(() => {
      setShowTranslation(false)
    }, 3000) // Revert after 5 seconds
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current) // Cleanup on unmount
  }, [])

  return (
    <div>
      <select value={chapterIndex} onChange={handleChange}>
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
