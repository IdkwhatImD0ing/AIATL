// app/results/flight/[flightId]/page.js
'use client'

import {useRouter, useParams} from 'next/navigation'
import {useEffect, useState, useRef} from 'react'
import PurchaseForm from '../../../components/PurchaseForm'
import HighlightOverlay from '../../../components/HighlightOverlay'
import SideWindow from '../../../components/SideWindow'
import * as multimodal from '@nlxai/multimodal'

export default function FlightDetails() {
  const router = useRouter()
  const params = useParams()
  const flightId = params.flightId

  const [flight, setFlight] = useState(null)

  // Refs for interactive elements in PurchaseForm
  const fullNameRef = useRef(null)
  const emailRef = useRef(null)
  const cardNumberRef = useRef(null)
  const expiryDateRef = useRef(null)
  const cvvRef = useRef(null)
  const confirmButtonRef = useRef(null)

  // Steps configuration
  const steps = [
    {
      stepId: '0b59842d-d87a-42e1-a3e6-320f605a55a1',
      ref: fullNameRef,
      instruction:
        'Please enter your personal information, including your full name and email address.',
    },
    {
      stepId: 'f797660e-4ce2-4c93-af74-693df835b878',
      ref: cardNumberRef,
      instruction:
        'Now, please enter your credit card information, including card number, expiry date, and CVV.',
    },
    {
      stepId: '932d91ec-2b08-451c-8a3f-2928e32817ac',
      ref: confirmButtonRef,
      instruction:
        'Helps you finalize your booking by confirming the purchase after entering all necessary information.',
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
  const [client, setClient] = useState(null)

  useEffect(() => {
    const selectedFlight = sessionStorage.getItem('selectedFlight')
    if (selectedFlight) {
      setFlight(JSON.parse(selectedFlight))
    }
  }, [])

  // Initialize AI Client and set first step after flight is loaded
  useEffect(() => {
    if (!flight) return

    const params = new URLSearchParams(window.location.search)
    const cidParam = params.get('cid') || localStorage.getItem('cid')

    if (cidParam) {
      localStorage.setItem('cid', cidParam)
      const clientInstance = multimodal.create({
        apiKey: 'qS6KFGgY9Rt/uCcjLw',
        workspaceId: '1648b2f6-14fd-4023-81cd-8a7b2efec4cd',
        journeyId: '4a1e5904-7b18-401f-8e60-80a3df751063',
        conversationId: cidParam,
        languageCode: navigator.language,
      })
      setClient(clientInstance)
      console.log('AI Client initialized. Starting tour.')

      // Start the tour by setting currentStep to 0 after refs are attached
      // Use setTimeout to allow refs to be attached
      setTimeout(() => {
        if (fullNameRef.current) {
          setCurrentStep(0)
          console.log('Starting step 0')
        } else {
          console.warn('fullNameRef is not attached yet.')
        }
      }, 100) // Adjust the delay as necessary
    } else {
      console.log('No cid parameter found. Tour will not start.')
    }
  }, [flight])

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

  const handleNext = () => {
    const nextStep = currentStep + 1
    if (nextStep < steps.length) {
      setCurrentStep(nextStep)
    } else {
      // All steps completed
      setCurrentStep(null)
      localStorage.setItem('hasSeenFlightTour', 'true') // Persist tour completion
      console.log('Flight tour completed.')
    }
  }

  const handleSkip = () => {
    setCurrentStep(null)
    localStorage.setItem('hasSeenFlightTour', 'true') // Persist tour completion
    console.log('Flight tour skipped.')
  }

  const handlePurchaseSubmit = (e) => {
    e.preventDefault()
    // Implement purchase logic here
    alert('Purchase Confirmed!')
    router.push('/results')
  }

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Loading flight details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* Flight Details */}
        <h2 className="text-3xl font-semibold mb-6">Flight Details</h2>
        <div className="bg-gray-700 rounded-lg p-6 shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <img
                src={flight.airline_logo}
                alt={`${flight.airline} logo`}
                className="w-12 h-12 mr-4"
              />
              <div>
                <p className="text-xl font-semibold">{flight.airline}</p>
                <p className="text-sm text-gray-400">
                  Flight: {flight.flightNumber}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${flight.price}</p>
              <p className="text-sm text-gray-400">{flight.travelClass}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Departure</p>
              <p className="text-lg font-semibold">{flight.departureTime}</p>
              <p className="text-sm">{flight.departureAirport}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Arrival</p>
              <p className="text-lg font-semibold">{flight.arrivalTime}</p>
              <p className="text-sm">{flight.arrivalAirport}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-lg font-semibold">{flight.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Aircraft</p>
              <p className="text-lg font-semibold">{flight.airplane}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Legroom</p>
              <p className="text-lg font-semibold">{flight.legroom}</p>
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Purchase Flight</h3>
          <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
            <PurchaseForm
              onSubmit={handlePurchaseSubmit}
              fullNameRef={fullNameRef}
              emailRef={emailRef}
              cardNumberRef={cardNumberRef}
              expiryDateRef={expiryDateRef}
              cvvRef={cvvRef}
              confirmButtonRef={confirmButtonRef}
            />
          </div>
        </div>
      </div>

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
    </div>
  )
}
