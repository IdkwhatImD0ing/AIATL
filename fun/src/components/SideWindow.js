// components/SideWindow.js
'use client'

import {motion, AnimatePresence} from 'framer-motion'

export default function SideWindow({
  onNext,
  instruction,
  onSkip,
  position,
  step,
  totalSteps,
}) {
  const sideWindowStyle = {
    top: position.top + position.height / 2 - 50, // Center vertically
    left: position.left + position.width + 20, // 20px to the right
    zIndex: 1001,
    width: '220px',
  }

  // Adjust if SideWindow goes off-screen to the right
  if (typeof window !== 'undefined') {
    const windowWidth = 220
    const screenWidth = window.innerWidth
    if (position.left + position.width + 20 + windowWidth > screenWidth) {
      // Position to the left
      sideWindowStyle.left = position.left - windowWidth - 20
    }

    // Prevent from going off the top or bottom
    const windowHeight = 100 // Approximate height of SideWindow
    const screenHeight = window.innerHeight
    if (position.top + position.height / 2 - 50 < 0) {
      sideWindowStyle.top = 10 // 10px from top
    } else if (position.top + position.height / 2 + 50 > screenHeight) {
      sideWindowStyle.top = screenHeight - 60 // 10px from bottom
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key={step} // Unique key per step for AnimatePresence
        className="absolute bg-white p-4 rounded-md shadow-lg flex flex-col items-start"
        style={sideWindowStyle}
        initial={{opacity: 0, x: 50}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: 50}}
        transition={{duration: 0.3, ease: 'easeInOut'}}
      >
        <p className="text-gray-800 mb-2">{instruction}</p>
        <p className="text-sm text-gray-500 mb-4">
          Step {step + 1} of {totalSteps}
        </p>
        <div className="flex space-x-2">
          <button
            onClick={onNext}
            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
          >
            Next
          </button>
          <button
            onClick={onSkip}
            className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600"
          >
            Skip
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
