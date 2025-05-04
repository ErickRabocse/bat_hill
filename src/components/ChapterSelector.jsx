// ChapterSelector.jsx
import React from 'react'

function ChapterSelector({ chapters, chapterIndex, setChapterIndex }) {
  const handleChange = (event) => {
    const selectedIndex = parseInt(event.target.value, 10)
    setChapterIndex(selectedIndex)
  }

  return (
    <div>
      <select value={chapterIndex} onChange={handleChange}>
        {chapters.map((chapter, index) => (
          <option key={chapter.id} value={index}>
            Chapter {index + 1}
          </option>
        ))}
      </select>
      <div>
        <h2>{chapters[chapterIndex].title}</h2>
      </div>
    </div>
  )
}

export default ChapterSelector
