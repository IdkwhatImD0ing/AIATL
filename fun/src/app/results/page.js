// app/results/page.js
'use client'

import {useRouter, useSearchParams} from 'next/navigation'
import {useEffect, useState, useMemo, useRef} from 'react'
import SortOptions from '../../components/SortOptions'
import PriceFilter from '../../components/PriceFilter'
import DepartureTimeFilter from '../../components/DepartureTimeFilter'
import ArrivalTimeFilter from '../../components/ArrivalTimeFilter'
import Link from 'next/link'
import HighlightOverlay from '../../components/HighlightOverlay'
import SideWindow from '../../components/SideWindow'
import * as multimodal from '@nlxai/multimodal'

const myFlights = [
  // Airlines A
  {
    id: 1,
    airline: 'Airways A',
    flightNumber: 'AA101',
    departureTime: '06:00 AM',
    arrivalTime: '10:00 AM',
    price: 250,
  },
  {
    id: 2,
    airline: 'Airways A',
    flightNumber: 'AA102',
    departureTime: '09:00 AM',
    arrivalTime: '01:00 PM',
    price: 300,
  },
  {
    id: 3,
    airline: 'Airways A',
    flightNumber: 'AA103',
    departureTime: '12:00 PM',
    arrivalTime: '04:00 PM',
    price: 350,
  },
  {
    id: 4,
    airline: 'Airways A',
    flightNumber: 'AA104',
    departureTime: '03:00 PM',
    arrivalTime: '07:00 PM',
    price: 400,
  },
  {
    id: 5,
    airline: 'Airways A',
    flightNumber: 'AA105',
    departureTime: '06:00 PM',
    arrivalTime: '10:00 PM',
    price: 450,
  },

  // Airlines B
  {
    id: 6,
    airline: 'Airways B',
    flightNumber: 'BB201',
    departureTime: '07:30 AM',
    arrivalTime: '11:30 AM',
    price: 280,
  },
  {
    id: 7,
    airline: 'Airways B',
    flightNumber: 'BB202',
    departureTime: '10:30 AM',
    arrivalTime: '02:30 PM',
    price: 320,
  },
  {
    id: 8,
    airline: 'Airways B',
    flightNumber: 'BB203',
    departureTime: '01:30 PM',
    arrivalTime: '05:30 PM',
    price: 370,
  },
  {
    id: 9,
    airline: 'Airways B',
    flightNumber: 'BB204',
    departureTime: '04:30 PM',
    arrivalTime: '08:30 PM',
    price: 420,
  },
  {
    id: 10,
    airline: 'Airways B',
    flightNumber: 'BB205',
    departureTime: '07:30 PM',
    arrivalTime: '11:30 PM',
    price: 470,
  },

  // Airlines C
  {
    id: 11,
    airline: 'Airways C',
    flightNumber: 'CC301',
    departureTime: '05:45 AM',
    arrivalTime: '09:45 AM',
    price: 260,
  },
  {
    id: 12,
    airline: 'Airways C',
    flightNumber: 'CC302',
    departureTime: '08:45 AM',
    arrivalTime: '12:45 PM',
    price: 310,
  },
  {
    id: 13,
    airline: 'Airways C',
    flightNumber: 'CC303',
    departureTime: '11:45 AM',
    arrivalTime: '03:45 PM',
    price: 360,
  },
  {
    id: 14,
    airline: 'Airways C',
    flightNumber: 'CC304',
    departureTime: '02:45 PM',
    arrivalTime: '06:45 PM',
    price: 410,
  },
  {
    id: 15,
    airline: 'Airways C',
    flightNumber: 'CC305',
    departureTime: '05:45 PM',
    arrivalTime: '09:45 PM',
    price: 460,
  },

  // Airlines D
  {
    id: 16,
    airline: 'Airways D',
    flightNumber: 'DD401',
    departureTime: '06:15 AM',
    arrivalTime: '10:15 AM',
    price: 270,
  },
  {
    id: 17,
    airline: 'Airways D',
    flightNumber: 'DD402',
    departureTime: '09:15 AM',
    arrivalTime: '01:15 PM',
    price: 320,
  },
  {
    id: 18,
    airline: 'Airways D',
    flightNumber: 'DD403',
    departureTime: '12:15 PM',
    arrivalTime: '04:15 PM',
    price: 370,
  },
  {
    id: 19,
    airline: 'Airways D',
    flightNumber: 'DD404',
    departureTime: '03:15 PM',
    arrivalTime: '07:15 PM',
    price: 420,
  },
  {
    id: 20,
    airline: 'Airways D',
    flightNumber: 'DD405',
    departureTime: '06:15 PM',
    arrivalTime: '10:15 PM',
    price: 470,
  },

  // Additional Flights for Diversity
  {
    id: 21,
    airline: 'Airways E',
    flightNumber: 'EE501',
    departureTime: '07:00 AM',
    arrivalTime: '11:00 AM',
    price: 230,
  },
  {
    id: 22,
    airline: 'Airways E',
    flightNumber: 'EE502',
    departureTime: '10:00 AM',
    arrivalTime: '02:00 PM',
    price: 290,
  },
  {
    id: 23,
    airline: 'Airways E',
    flightNumber: 'EE503',
    departureTime: '01:00 PM',
    arrivalTime: '05:00 PM',
    price: 340,
  },
  {
    id: 24,
    airline: 'Airways E',
    flightNumber: 'EE504',
    departureTime: '04:00 PM',
    arrivalTime: '08:00 PM',
    price: 390,
  },
  {
    id: 25,
    airline: 'Airways E',
    flightNumber: 'EE505',
    departureTime: '07:00 PM',
    arrivalTime: '11:00 PM',
    price: 440,
  },
]

export default function Results() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const location = searchParams.get('location') || 'Any'
  const departure = searchParams.get('departure') || 'N/A'
  const returnDate = searchParams.get('return') || 'N/A'

  // State for flights
  const [flights, setFlights] = useState(myFlights)

  // Fetching (hardcoded) flight data
  const [client, setClient] = useState(null)
  const [currentStep, setCurrentStep] = useState(null)

  // Refs for interactive elements
  const sortOptionsRef = useRef(null)
  const priceFilterRef = useRef(null)
  const resetFiltersRef = useRef(null)
  const departureTimeRef = useRef(null)
  const arrivalTimeRef = useRef(null)
  const selectButtonRef = useRef(null) // Reference to the first Select button

  // Steps configuration
  const steps = [
    {
      stepId: '87fddf5f-634f-4c0d-bc98-423232089c88',
      ref: sortOptionsRef,
      instruction:
        'How would you like to sort the flight options? You can sort by Price, Departure Time, or Arrival Time.',
    },
    {
      stepId: '604ac901-fc45-4069-82cd-ba0b8299a34a',
      ref: priceFilterRef,
      instruction:
        'Would you like to set a budget for your flight? Please enter your minimum and maximum price range.',
    },
    {
      stepId: 'eafaf40b-3611-4998-b235-a6c88b66836d',
      ref: departureTimeRef,
      instruction:
        "Let's refine your search by departure time. Do you prefer Morning, Afternoon, or Evening flights?",
    },
    {
      stepId: 'f765ccdd-ac33-4bb0-baa2-e82ae132c004',
      ref: arrivalTimeRef,
      instruction:
        'Would you like to filter flights by arrival time? Please select your preferred arrival window: Morning, Afternoon, or Evening.',
    },
    {
      stepId: 'd044eac1-f5a8-4496-909b-de42be4c6199',
      ref: resetFiltersRef,
      instruction:
        'If you wish to clear all filters and view all available flights, click the "Reset Filters" button.',
    },

    {
      stepId: '5f353bcc-eccb-4153-84c8-3673783a0b60',
      ref: selectButtonRef,
      instruction:
        'Found a flight that suits your needs? Click the "Select" button to view more details about this flight.',
    },
  ]
  const sentSteps = useRef(
    steps.reduce((acc, step) => {
      acc[step.stepId] = false
      return acc
    }, {}),
  )

  const [targetPosition, setTargetPosition] = useState(null)

  // Initialize AI Client and set first step
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cidParam = params.get('cid') || localStorage.getItem('cid')
    console.log('cidParam', cidParam)

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
      // Start the tour by setting currentStep to 0
      setCurrentStep(0)
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

  const handleNext = () => {
    const nextStep = currentStep + 1
    if (nextStep < steps.length) {
      setCurrentStep(nextStep)
    } else {
      // All steps completed
      setCurrentStep(null)
      localStorage.setItem('hasSeenResultsTour', 'true') // Persist tour completion
    }
  }

  const handleSkip = () => {
    setCurrentStep(null)
    localStorage.setItem('hasSeenResultsTour', 'true') // Persist tour completion
  }

  // State for filters
  const [priceRange, setPriceRange] = useState({min: '', max: ''})
  const [departureTime, setDepartureTime] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  })
  const [arrivalTime, setArrivalTime] = useState({
    morning: false,
    afternoon: false,
    evening: false,
  })

  // State for sorting
  const [sortOption, setSortOption] = useState('')

  // Function to convert time string to minutes for comparison
  const timeToMinutes = (timeStr) => {
    const [time, modifier] = timeStr.split(' ')
    let [hours, minutes] = time.split(':').map(Number)
    if (modifier === 'PM' && hours !== 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0
    return hours * 60 + minutes
  }

  // Memoized filtered and sorted flights
  const filteredFlights = useMemo(() => {
    let tempFlights = [...flights]

    // Filter by price range
    if (priceRange.min !== '' || priceRange.max !== '') {
      tempFlights = tempFlights.filter((flight) => {
        const meetsMin =
          priceRange.min !== ''
            ? flight.price >= parseInt(priceRange.min)
            : true
        const meetsMax =
          priceRange.max !== ''
            ? flight.price <= parseInt(priceRange.max)
            : true
        return meetsMin && meetsMax
      })
    }

    // Filter by departure time
    if (
      departureTime.morning ||
      departureTime.afternoon ||
      departureTime.evening
    ) {
      tempFlights = tempFlights.filter((flight) => {
        const depMinutes = timeToMinutes(flight.departureTime)
        let inRange = false

        if (departureTime.morning) {
          // 12:00 AM - 11:59 AM => 0 - 719 minutes
          if (depMinutes >= 0 && depMinutes <= 719) inRange = true
        }
        if (departureTime.afternoon) {
          // 12:00 PM - 5:59 PM => 720 - 1079 minutes
          if (depMinutes >= 720 && depMinutes <= 1079) inRange = true
        }
        if (departureTime.evening) {
          // 6:00 PM - 11:59 PM => 1080 - 1439 minutes
          if (depMinutes >= 1080 && depMinutes <= 1439) inRange = true
        }

        return inRange
      })
    }

    // Filter by arrival time
    if (arrivalTime.morning || arrivalTime.afternoon || arrivalTime.evening) {
      tempFlights = tempFlights.filter((flight) => {
        const arrMinutes = timeToMinutes(flight.arrivalTime)
        let inRange = false

        if (arrivalTime.morning) {
          // 12:00 AM - 11:59 AM => 0 - 719 minutes
          if (arrMinutes >= 0 && arrMinutes <= 719) inRange = true
        }
        if (arrivalTime.afternoon) {
          // 12:00 PM - 5:59 PM => 720 - 1079 minutes
          if (arrMinutes >= 720 && arrMinutes <= 1079) inRange = true
        }
        if (arrivalTime.evening) {
          // 6:00 PM - 11:59 PM => 1080 - 1439 minutes
          if (arrMinutes >= 1080 && arrMinutes <= 1439) inRange = true
        }

        return inRange
      })
    }

    // Sorting
    if (sortOption !== '') {
      switch (sortOption) {
        case 'price-asc':
          tempFlights.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          tempFlights.sort((a, b) => b.price - a.price)
          break
        case 'departure-asc':
          tempFlights.sort(
            (a, b) =>
              timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime),
          )
          break
        case 'departure-desc':
          tempFlights.sort(
            (a, b) =>
              timeToMinutes(b.departureTime) - timeToMinutes(a.departureTime),
          )
          break
        case 'arrival-asc':
          tempFlights.sort(
            (a, b) =>
              timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime),
          )
          break
        case 'arrival-desc':
          tempFlights.sort(
            (a, b) =>
              timeToMinutes(b.arrivalTime) - timeToMinutes(a.arrivalTime),
          )
          break
        default:
          break
      }
    }

    return tempFlights
  }, [flights, priceRange, departureTime, arrivalTime, sortOption])

  // Format dates for display
  const formatDate = (dateStr) => {
    if (dateStr === 'N/A') return 'N/A'
    const options = {year: 'numeric', month: 'long', day: 'numeric'}
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Search Criteria */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-semibold mb-4">Flight Results</h2>
          <p className="text-gray-700">
            <span className="font-medium">Destination:</span> {location}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Departure Date:</span>{' '}
            {formatDate(departure)}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Return Date:</span>{' '}
            {formatDate(returnDate)}
          </p>
        </div>

        {/* Filters and Flight Listings */}
        <div className="flex flex-col md:flex-row">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow mr-4 mb-6 md:mb-0">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>

            {/* Sort Options */}
            <div ref={sortOptionsRef}>
              <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>

            {/* Price Range Filter */}
            <PriceFilter
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              ref={priceFilterRef}
            />

            {/* Departure Time Filter */}
            <DepartureTimeFilter
              departureTime={departureTime}
              setDepartureTime={setDepartureTime}
              ref={departureTimeRef}
            />

            {/* Arrival Time Filter */}
            <ArrivalTimeFilter
              arrivalTime={arrivalTime}
              setArrivalTime={setArrivalTime}
              ref={arrivalTimeRef}
            />

            {/* Reset Filters Button */}
            <button
              ref={resetFiltersRef}
              onClick={() => {
                setSortOption('')
                setPriceRange({min: '', max: ''})
                setDepartureTime({
                  morning: false,
                  afternoon: false,
                  evening: false,
                })
                setArrivalTime({
                  morning: false,
                  afternoon: false,
                  evening: false,
                })
              }}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors mt-4"
            >
              Reset Filters
            </button>
          </aside>

          {/* Flight Listings */}
          <main className="w-full md:w-3/4">
            {/* Sorting Options */}
            {/* Already integrated within Filters Sidebar */}

            {/* Display No Flights Found */}
            {filteredFlights.length === 0 ? (
              <p className="text-center text-gray-700 mt-8">
                No flights match your criteria.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight, index) => (
                  <div
                    key={flight.id}
                    className="bg-white p-6 rounded-lg shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {flight.airline}
                        </h3>
                        <p className="text-gray-600">
                          Flight: {flight.flightNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">
                          <span className="font-medium">Price:</span> $
                          {flight.price}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <p className="text-gray-700">
                          <span className="font-medium">Departure:</span>{' '}
                          {flight.departureTime}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Arrival:</span>{' '}
                          {flight.arrivalTime}
                        </p>
                      </div>
                      <button
                        ref={index === 0 ? selectButtonRef : null} // Assign ref only to the first Select button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        <Link href={`/results/flight/${flight.id}`}>
                          Select
                        </Link>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
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
