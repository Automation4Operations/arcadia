'use client'

import React, { useEffect, useState } from 'react'

const ANIME_EFFECTS = [
  { name: 'Super Saiyan Aura (DBZ)', type: 'dbz', color: '#ffcc00' },
  { name: 'Water Breathing Slash (Demon Slayer)', type: 'slash', color: '#00e5ff' },
  { name: 'Hinokami Kagura Flame (Demon Slayer)', type: 'slash', color: '#ff4646' },
  { name: 'Conqueror’s Haki Lightning (One Piece)', type: 'haki', color: '#9371f5' },
  { name: 'Gear 5 Bounce Wave (One Piece)', type: 'bounce', color: '#ffffff' },
  { name: 'Link-Start Hologram (SAO)', type: 'sao', color: '#00ffff' },
  { name: 'Rasengan Energy Swirl (Naruto)', type: 'swirl', color: '#35d797' },
  { name: 'Pokéball Evolution Burst (Pokémon)', type: 'burst', color: '#f04684' }
]

export default function AnimeFxEngine() {
  const [currentEffect, setCurrentEffect] = useState(ANIME_EFFECTS[0])
  const [fxActive, setFxActive] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Load non-repeating effect index from localStorage queue
    const getNextEffect = () => {
      let history = []
      try {
        history = JSON.parse(localStorage.getItem('arcadia_fx_history') || '[]')
      } catch {
        history = []
      }

      let availableIndex = Math.floor(Math.random() * ANIME_EFFECTS.length)
      if (history.length >= ANIME_EFFECTS.length) {
        history = []
      }
      while (history.includes(availableIndex)) {
        availableIndex = Math.floor(Math.random() * ANIME_EFFECTS.length)
      }

      history.push(availableIndex)
      localStorage.setItem('arcadia_fx_history', JSON.stringify(history))
      return ANIME_EFFECTS[availableIndex]
    }

    setCurrentEffect(getNextEffect())

    const handleClick = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY })
      setFxActive(true)
      setTimeout(() => setFxActive(false), 700)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <>
      {fxActive && (
        <div
          className="pointer-events-none fixed z-50 flex items-center justify-center"
          style={{ left: coords.x, top: coords.y, transform: 'translate(-50%, -50%)' }}
        >
          <div
            className="h-24 w-24 animate-ping rounded-full opacity-75"
            style={{ backgroundColor: currentEffect.color, filter: 'blur(8px)' }}
          />
          <span
            className="absolute text-[10px] font-extrabold tracking-widest uppercase text-white px-2 py-0.5 rounded shadow-lg"
            style={{ background: currentEffect.color, color: '#090b10' }}
          >
            {currentEffect.name.split(' ')[0]}!
          </span>
        </div>
      )}
    </>
  )
}
