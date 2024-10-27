// app/results/flight/[flightId]/page.js
'use client'

import {useRouter, useParams} from 'next/navigation'
import {useEffect, useState, useRef} from 'react'
import PurchaseForm from '../../../../components/PurchaseForm'
import HighlightOverlay from '../../../../components/HighlightOverlay'
import SideWindow from '../../../../components/SideWindow'
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

  // Simulated fetch function to get flight details by ID
  useEffect(() => {
    const fetchedFlights = [
      // Airlines A
      {
        id: 1,
        airline: 'Airways A',
        flightNumber: 'AA101',
        departureTime: '06:00 AM',
        arrivalTime: '10:00 AM',
        price: 250,
        duration: '4h',
        seatsAvailable: 20,
      },
      {
        id: 2,
        airline: 'Airways A',
        flightNumber: 'AA102',
        departureTime: '09:00 AM',
        arrivalTime: '01:00 PM',
        price: 300,
        duration: '4h',
        seatsAvailable: 18,
      },
      {
        id: 3,
        airline: 'Airways A',
        flightNumber: 'AA103',
        departureTime: '12:00 PM',
        arrivalTime: '04:00 PM',
        price: 350,
        duration: '4h',
        seatsAvailable: 15,
      },
      {
        id: 4,
        airline: 'Airways A',
        flightNumber: 'AA104',
        departureTime: '03:00 PM',
        arrivalTime: '07:00 PM',
        price: 400,
        duration: '4h',
        seatsAvailable: 10,
      },
      {
        id: 5,
        airline: 'Airways A',
        flightNumber: 'AA105',
        departureTime: '06:00 PM',
        arrivalTime: '10:00 PM',
        price: 450,
        duration: '4h',
        seatsAvailable: 5,
      },

      // Airlines B
      {
        id: 6,
        airline: 'Airways B',
        flightNumber: 'BB201',
        departureTime: '07:30 AM',
        arrivalTime: '11:30 AM',
        price: 280,
        duration: '4h',
        seatsAvailable: 22,
      },
      {
        id: 7,
        airline: 'Airways B',
        flightNumber: 'BB202',
        departureTime: '10:30 AM',
        arrivalTime: '02:30 PM',
        price: 320,
        duration: '4h',
        seatsAvailable: 19,
      },
      {
        id: 8,
        airline: 'Airways B',
        flightNumber: 'BB203',
        departureTime: '01:30 PM',
        arrivalTime: '05:30 PM',
        price: 370,
        duration: '4h',
        seatsAvailable: 17,
      },
      {
        id: 9,
        airline: 'Airways B',
        flightNumber: 'BB204',
        departureTime: '04:30 PM',
        arrivalTime: '08:30 PM',
        price: 420,
        duration: '4h',
        seatsAvailable: 12,
      },
      {
        id: 10,
        airline: 'Airways B',
        flightNumber: 'BB205',
        departureTime: '07:30 PM',
        arrivalTime: '11:30 PM',
        price: 470,
        duration: '4h',
        seatsAvailable: 8,
      },

      // Airlines C
      {
        id: 11,
        airline: 'Airways C',
        flightNumber: 'CC301',
        departureTime: '05:45 AM',
        arrivalTime: '09:45 AM',
        price: 260,
        duration: '4h',
        seatsAvailable: 25,
      },
      {
        id: 12,
        airline: 'Airways C',
        flightNumber: 'CC302',
        departureTime: '08:45 AM',
        arrivalTime: '12:45 PM',
        price: 310,
        duration: '4h',
        seatsAvailable: 20,
      },
      {
        id: 13,
        airline: 'Airways C',
        flightNumber: 'CC303',
        departureTime: '11:45 AM',
        arrivalTime: '03:45 PM',
        price: 360,
        duration: '4h',
        seatsAvailable: 16,
      },
      {
        id: 14,
        airline: 'Airways C',
        flightNumber: 'CC304',
        departureTime: '02:45 PM',
        arrivalTime: '06:45 PM',
        price: 410,
        duration: '4h',
        seatsAvailable: 13,
      },
      {
        id: 15,
        airline: 'Airways C',
        flightNumber: 'CC305',
        departureTime: '05:45 PM',
        arrivalTime: '09:45 PM',
        price: 460,
        duration: '4h',
        seatsAvailable: 9,
      },

      // Airlines D
      {
        id: 16,
        airline: 'Airways D',
        flightNumber: 'DD401',
        departureTime: '06:15 AM',
        arrivalTime: '10:15 AM',
        price: 270,
        duration: '4h',
        seatsAvailable: 21,
      },
      {
        id: 17,
        airline: 'Airways D',
        flightNumber: 'DD402',
        departureTime: '09:15 AM',
        arrivalTime: '01:15 PM',
        price: 320,
        duration: '4h',
        seatsAvailable: 18,
      },
      {
        id: 18,
        airline: 'Airways D',
        flightNumber: 'DD403',
        departureTime: '12:15 PM',
        arrivalTime: '04:15 PM',
        price: 370,
        duration: '4h',
        seatsAvailable: 14,
      },
      {
        id: 19,
        airline: 'Airways D',
        flightNumber: 'DD404',
        departureTime: '03:15 PM',
        arrivalTime: '07:15 PM',
        price: 420,
        duration: '4h',
        seatsAvailable: 11,
      },
      {
        id: 20,
        airline: 'Airways D',
        flightNumber: 'DD405',
        departureTime: '06:15 PM',
        arrivalTime: '10:15 PM',
        price: 470,
        duration: '4h',
        seatsAvailable: 7,
      },

      // Airlines E
      {
        id: 21,
        airline: 'Airways E',
        flightNumber: 'EE501',
        departureTime: '07:00 AM',
        arrivalTime: '11:00 AM',
        price: 230,
        duration: '4h',
        seatsAvailable: 24,
      },
      {
        id: 22,
        airline: 'Airways E',
        flightNumber: 'EE502',
        departureTime: '10:00 AM',
        arrivalTime: '02:00 PM',
        price: 290,
        duration: '4h',
        seatsAvailable: 19,
      },
      {
        id: 23,
        airline: 'Airways E',
        flightNumber: 'EE503',
        departureTime: '01:00 PM',
        arrivalTime: '05:00 PM',
        price: 340,
        duration: '4h',
        seatsAvailable: 15,
      },
      {
        id: 24,
        airline: 'Airways E',
        flightNumber: 'EE504',
        departureTime: '04:00 PM',
        arrivalTime: '08:00 PM',
        price: 390,
        duration: '4h',
        seatsAvailable: 12,
      },
      {
        id: 25,
        airline: 'Airways E',
        flightNumber: 'EE505',
        departureTime: '07:00 PM',
        arrivalTime: '11:00 PM',
        price: 440,
        duration: '4h',
        seatsAvailable: 10,
      },
    ]

    const selectedFlight = fetchedFlights.find(
      (f) => f.id === parseInt(flightId),
    )

    setFlight(selectedFlight)
  }, [flightId])

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
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        {/* Flight Details */}
        <h2 className="text-2xl font-semibold mb-4">Flight Details</h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Airline:</span> {flight.airline}
          </p>
          <p>
            <span className="font-medium">Flight Number:</span>{' '}
            {flight.flightNumber}
          </p>
          <p>
            <span className="font-medium">Departure Time:</span>{' '}
            {flight.departureTime}
          </p>
          <p>
            <span className="font-medium">Arrival Time:</span>{' '}
            {flight.arrivalTime}
          </p>
          <p>
            <span className="font-medium">Duration:</span> {flight.duration}
          </p>
          <p>
            <span className="font-medium">Price:</span> ${flight.price}
          </p>
          <p>
            <span className="font-medium">Seats Available:</span>{' '}
            {flight.seatsAvailable}
          </p>
        </div>

        {/* Purchase Form */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Purchase Flight</h3>
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
