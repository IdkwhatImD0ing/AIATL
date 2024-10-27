// components/HighlightOverlay.js
'use client'

import {useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'

export default function HighlightOverlay({targetRef, setTargetPosition, step}) {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updatePosition = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        const newPosition = {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        }
        setPosition(newPosition)
        setTargetPosition(newPosition)
      }
    }

    // Initial position
    updatePosition()

    // Update position on window resize and scroll
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [targetRef, setTargetPosition, step])

  return (
    <AnimatePresence>
      <motion.div
        key={step} // Unique key per step
        className="absolute pointer-events-none"
        style={{
          top: position.top - 10,
          left: position.left - 10,
          width: position.width + 20,
          height: position.height + 20,
          borderRadius: '8px',
          boxShadow: '0 0 0 3px rgba(255, 165, 0, 0.7)', // Orange outline
          zIndex: 1000,
        }}
        initial={{opacity: 0, scale: 0.8}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.8}}
        transition={{duration: 0.3, ease: 'easeInOut'}}
      ></motion.div>
    </AnimatePresence>
  )
}
