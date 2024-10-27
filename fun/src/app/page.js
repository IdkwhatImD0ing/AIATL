// app/page.js
'use client'

import {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/navigation'
import * as multimodal from '@nlxai/multimodal'
import HighlightOverlay from '../components/HighlightOverlay'
import SideWindow from '../components/SideWindow'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
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

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative z-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Book Your Flight
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Location Input */}
          <div>
            <label htmlFor="location" className="block text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter destination"
              value={formData.location}
              onChange={handleChange}
              ref={locationRef}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Departure Date */}
          <div>
            <label htmlFor="departure" className="block text-gray-700">
              Departure Date
            </label>
            <input
              type="date"
              id="departure"
              name="departure"
              value={formData.departure}
              onChange={handleChange}
              ref={departureRef}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Return Date */}
          <div>
            <label htmlFor="return" className="block text-gray-700">
              Return Date
            </label>
            <input
              type="date"
              id="return"
              name="return"
              value={formData.return}
              onChange={handleChange}
              ref={returnRef}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
              ref={searchButtonRef}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Search Flights
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
