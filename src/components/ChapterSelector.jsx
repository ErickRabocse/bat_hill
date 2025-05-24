import React from 'react'; // Ya no necesitamos useState, useEffect, useRef para este componente

function ChapterSelector({ chapters, chapterIndex, setChapterIndex, isDisabled }) { 
  const handleChange = (event) => {
    if (!isDisabled) { 
      const selectedIndex = parseInt(event.target.value, 10);
      setChapterIndex(selectedIndex);
    }
  };

  return (
    // ELIMINAR CUALQUIER DIV O H2 QUE CONTENGA EL TÍTULO DEL CAPÍTULO.
    // ESTE COMPONENTE SOLO DEBE RENDERIZAR EL SELECTOR.
    <div className="chapter-selector-container"> {/* Mantener un div contenedor si es necesario para los estilos */}
      <select value={chapterIndex} onChange={handleChange} disabled={isDisabled}>
        {chapters.map((chapter, index) => (
          <option key={chapter.id} value={index}>
            {/* Aquí solo el texto de la opción del selector, NO el título del capítulo */}
            {index === 0 ? 'Introduction' : `Chapter ${index}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ChapterSelector;