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
            {chapter.title}
          </option>
        ))}
      </select>
      <div>
        <h2>{chapters[chapterIndex].title}</h2>
        <p>{chapters[chapterIndex].content}</p>
      </div>
    </div>
  )
}

export default ChapterSelector
