// src/components/StarEffect.jsx
import React, { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadStarsPreset } from 'tsparticles-preset-stars'

const StarEffect = () => {
  const particlesInit = useCallback(async (engine) => {
    console.log('[StarEffect] Inicializando partículas...')
    await loadStarsPreset(engine)
  }, [])

  const particlesLoaded = useCallback(async (container) => {
    console.log('[StarEffect] Partículas cargadas:', container)
  }, [])

  // Dentro de StarEffect.jsx, reemplaza el objeto 'options'

  // Dentro de StarEffect.jsx, reemplaza el objeto 'options'

  const options = {
    background: {
      color: 'transparent',
    },
    fullScreen: {
      enable: true,
      zIndex: 1040, // Mantiene el efecto sobre el contenido pero debajo de modales
    },
    particles: {
      number: {
        value: 100, // Una buena cantidad de estrellas
      },
      color: {
        value: '#ffffff', // Estrellas de color blanco clásico
      },
      opacity: {
        value: { min: 0.3, max: 1 }, // Opacidad aleatoria para que parpadeen
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
        },
      },
      size: {
        value: { min: 1, max: 3 }, // <-- TAMAÑOS DIFERENTES
        animation: {
          // Animación para que el tamaño también pulse sutilmente
          enable: true,
          speed: 1.5,
          minimumValue: 0.5,
          sync: false,
        },
      },
      shadow: {
        // <-- AQUÍ ESTÁ EL GLOW INTERESANTE
        enable: true,
        color: '#6495ED', // Un tono azulado (CornflowerBlue) para el brillo
        blur: 10,
      },
      move: {
        // <-- MOVIMIENTO TIPO PLASMA
        enable: true,
        speed: 0.5, // Movimiento lento y suave
        direction: 'none', // Sin una dirección fija
        random: true, // Cada una se mueve a su aire
        straight: false, // El movimiento no es en línea recta
        outModes: 'out',
      },
    },
  }

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
    />
  )
}

export default StarEffect
