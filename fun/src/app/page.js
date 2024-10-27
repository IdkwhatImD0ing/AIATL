// app/page.js
'use client'

import {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/navigation'
import * as multimodal from '@nlxai/multimodal'
import HighlightOverlay from '../components/HighlightOverlay'
import SideWindow from '../components/SideWindow'
import {motion} from 'framer-motion' // Import Framer Motion

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: '',
    departure: '',
    return: '',
  })
  const [client, setClient] = useState(null)

  // Refs for interactive elements
  const locationRef = useRef(null)
  const departureRef = useRef(null)
  const returnRef = useRef(null)
  const searchButtonRef = useRef(null)

  // Steps configuration
  const steps = [
    {
      stepId: 'f1d44c87-64db-4483-b54c-e11579d1d1e7', // Location Selection
      ref: locationRef,
      instruction:
        'Please enter your desired travel location in the field highlighted.',
    },
    {
      stepId: '877da91d-b9cb-4367-a7ed-439ff0d233e3', // Departure Date Selection
      ref: departureRef,
      instruction:
        'Now, select your preferred departure date from the calendar.',
    },
    {
      stepId: '35b82e56-2470-4041-a90b-1504ca835a1a', // Return Date Selection
      ref: returnRef,
      instruction:
        "Finally, choose your return date. If it's a one-way trip, you can skip this step.",
    },
    {
      stepId: 'e481d892-64f5-4813-8034-90d02d10a514', // Search Flights Button
      ref: searchButtonRef,
      instruction:
        'Great! Click the "Search Flights" button to find the best options for your trip.',
    },
  ]

  const sentSteps = useRef(
    steps.reduce((acc, step) => {
      acc[step.stepId] = false
      return acc
    }, {}),
  )

  const [currentStep, setCurrentStep] = useState(null)
  const [targetPosition, setTargetPosition] = useState(null)

  // Initialize AI Client and set first step
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cidParam = params.get('cid')
    if (cidParam) {
      localStorage.setItem('cid', cidParam)
      setCurrentStep(0)
      const clientInstance = multimodal.create({
        apiKey: 'qS6KFGgY9Rt/uCcjLw',
        workspaceId: '1648b2f6-14fd-4023-81cd-8a7b2efec4cd',
        journeyId: '4a1e5904-7b18-401f-8e60-80a3df751063',
        conversationId: cidParam,
        languageCode: navigator.language,
      })
      setClient(clientInstance)
      // Start the tour by setting currentStep to 0
    }
  }, [])

  // Effect to send step when currentStep is set and ref is available
  useEffect(() => {
    if (currentStep !== null && client) {
      const step = steps[currentStep]
      if (step && step.ref.current && !sentSteps.current[step.stepId]) {
        console.log(`Sending Step ID: ${step.stepId}`)
        client.sendStep(step.stepId)
        sentSteps.current[step.stepId] = true
        // Scroll the highlighted element into view
        step.ref.current.scrollIntoView({behavior: 'smooth', block: 'center'})
      }
    }
  }, [currentStep, client, steps])

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNext = () => {
    const nextStep = currentStep + 1
    if (nextStep < steps.length) {
      setCurrentStep(nextStep)
    } else {
      // All steps completed
      setCurrentStep(null)
    }
  }

  const handleSkip = () => {
    setCurrentStep(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Navigate to the results page with query parameters as a single string URL
    router.push(
      `/results?location=${encodeURIComponent(
        formData.location,
      )}&departure=${encodeURIComponent(
        formData.departure,
      )}&return=${encodeURIComponent(formData.return)}`,
    )
    // Trigger sendStep for search button
    if (client && currentStep === 3) {
      client.sendStep(steps[3].stepId) // Search Flights Button Step ID
      // Optionally, hide the highlight and side window
      setCurrentStep(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
      {/* Highlight Overlay and Side Window */}
      {currentStep !== null &&
        currentStep < steps.length &&
        steps[currentStep].ref.current && (
          <>
            <HighlightOverlay
              targetRef={steps[currentStep].ref}
              setTargetPosition={setTargetPosition}
              step={currentStep}
            />
            {targetPosition && (
              <SideWindow
                onNext={handleNext}
                onSkip={handleSkip}
                instruction={steps[currentStep].instruction}
                position={targetPosition}
                step={currentStep}
                totalSteps={steps.length}
              />
            )}
          </>
        )}

      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 opacity-80"></div>

      {/* Animated Heading */}
      <motion.div
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.7}}
        className="z-10 text-center mb-10"
      >
        <h1 className="text-5xl font-semibold mb-4">Easy Flights</h1>
        <p className="text-lg text-gray-300">
          Find cheap flights from your location to anywhere.
        </p>
      </motion.div>

      {/* Animated Form Container */}
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.5}}
        className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md z-10"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-gray-400 mb-2">
              From
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter departure location"
              value={formData.location}
              onChange={handleChange}
              ref={locationRef}
              className="w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Departure Date */}
          <div>
            <label htmlFor="departure" className="block text-gray-400 mb-2">
              Departure Date
            </label>
            <input
              type="date"
              id="departure"
              name="departure"
              value={formData.departure}
              onChange={handleChange}
              ref={departureRef}
              className="w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Return Date */}
          <div>
            <label htmlFor="return" className="block text-gray-400 mb-2">
              Return Date
            </label>
            <input
              type="date"
              id="return"
              name="return"
              value={formData.return}
              onChange={handleChange}
              ref={returnRef}
              className="w-full px-4 py-3 border border-gray-700 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Search Button */}
          <div>
            <motion.button
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              type="submit"
              ref={searchButtonRef}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Search Flights
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
