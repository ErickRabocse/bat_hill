import React from 'react'

function Word({
  text,
  translation,
  activeWord,
  setActiveWord,
  onSpeak,
  fontSize,
}) {
  const isActive = activeWord === text
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
    color: isDarkMode ? '#ffffff' : '#000000',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '5px 8px',
    fontSize: '0.85rem',
    bottom: '100%',
    marginBottom: '-60px',
    zIndex: 10,
    whiteSpace: 'nowrap',
    lineHeight: '1.2',
  }

  const handleClick = (e) => {
    e.stopPropagation()
    const newActive = isActive ? null : text
    setActiveWord(newActive)
    onSpeak(text)
  }

  return (
    <span
      className="word-span"
      style={{
        marginRight: '4px',
        position: 'relative',
        cursor: 'pointer',
        fontSize: fontSize || '1.2rem',
        lineHeight: '2.5',
        ...(isActive ? { color: 'darkred', fontWeight: 'bold' } : {}),
      }}
      onClick={handleClick}
    >
      {text}
      {isActive && <div style={tooltipStyle}>{translation}</div>}
    </span>
  )
}

export default Word
