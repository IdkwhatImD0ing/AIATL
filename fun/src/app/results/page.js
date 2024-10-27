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

export default function Results() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const departureAirport = searchParams.get('departureAirport') || 'Any'
  const arrivalAirport = searchParams.get('arrivalAirport') || 'N/A'
  const date = searchParams.get('date') || 'N/A'

  // State for flights
  const [flights, setFlights] = useState([]) // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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
  // Helper function to convert time string to minutes since midnight
  // Helper function to convert "YYYY-MM-DD HH:MM" to minutes since midnight
  const timeToMinutes = (dateTimeStr) => {
    if (!dateTimeStr) return 0 // Handle missing time

    // Extract the time part
    const timePart = dateTimeStr.split(' ')[1] // "HH:MM"

    if (!timePart) return 0 // Handle unexpected format

    const [hours, minutes] = timePart.split(':').map(Number)

    return hours * 60 + minutes
  }

  // Fetch flight data from API
  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Extract departure and arrival airport codes from location if possible
        // For simplicity, let's assume 'location' refers to arrival airport

        const response = await fetch(
          `/api/flights?departure_id=${departureAirport}&arrival_id=${arrivalAirport}&outbound_date=${date}&currency=USD&hl=en`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch flight data.')
        }

        const data = await response.json()

        // Map the SerpAPI response to your flight structure
        const mappedFlights = []

        const processFlight = (flight) => {
          const departureTime = flight.flights[0].departure_airport.time
          const arrivalTime = flight.flights[0].arrival_airport.time
          const price = flight.price
          const airline = flight.flights[0].airline
          const flightNumber = flight.flights[0].flight_number
          const travelClass = flight.flights[0].travel_class
          const legroom = flight.flights[0].legroom
          const duration = flight.total_duration
          const airplane = flight.flights[0].airplane
          const airline_logo = flight.flights[0].airline_logo
          const departureAirport = flight.flights[0].departure_airport.name
          const arrivalAirport = flight.flights[0].arrival_airport.name
          console.log(flight)
          mappedFlights.push({
            airline: airline,
            flightNumber: flightNumber,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            price: price,
            travelClass: travelClass,
            legroom: legroom,
            duration: duration,
            airplane: airplane,
            airline_logo: airline_logo,
            departureAirport: departureAirport,
            arrivalAirport: arrivalAirport,
          })
        }

        console.log('data', mappedFlights)

        if (data.best_flights) {
          data.best_flights.forEach(processFlight)
        }

        if (data.other_flights) {
          data.other_flights.forEach(processFlight)
        }

        setFlights(mappedFlights)
      } catch (err) {
        console.error(err)
        setError(err.message || 'An unexpected error occurred.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFlights()
  }, [arrivalAirport, departureAirport, date])

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
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Search Criteria */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-3xl font-semibold mb-4">Flight Results</h2>
          <p className="text-gray-300">
            <span className="font-medium">Origin:</span> {departureAirport}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Destination:</span> {arrivalAirport}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Departure Date:</span>{' '}
            {formatDate(date)}
          </p>
        </div>

        {/* Filters and Flight Listings */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>

            {/* Sort Options */}
            <div ref={sortOptionsRef}>
              <SortOptions
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>

            {/* Price Range Filter */}
            <div ref={priceFilterRef}>
              <PriceFilter
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>

            {/* Departure Time Filter */}
            <div ref={departureTimeRef}>
              <DepartureTimeFilter
                departureTime={departureTime}
                setDepartureTime={setDepartureTime}
              />
            </div>

            {/* Arrival Time Filter */}
            <div ref={arrivalTimeRef}>
              <ArrivalTimeFilter
                arrivalTime={arrivalTime}
                setArrivalTime={setArrivalTime}
              />
            </div>

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
            {isLoading ? (
              <p className="text-center text-gray-300 mt-8">
                Loading flights...
              </p>
            ) : error ? (
              <p className="text-center text-red-500 mt-8">{error}</p>
            ) : filteredFlights.length === 0 ? (
              <p className="text-center text-gray-300 mt-8">
                No flights match your criteria.
              </p>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <img
                        src={flight.airline_logo}
                        alt={`${flight.airline} logo`}
                        className="w-12 h-12 mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {flight.airline}
                        </h3>
                        <p className="text-gray-400">
                          Flight: {flight.flightNumber}
                        </p>
                        <p className="text-gray-300 mt-2">
                          <span className="font-medium">Departure:</span>{' '}
                          {flight.departureTime}
                        </p>
                        <p className="text-gray-300">
                          <span className="font-medium">Arrival:</span>{' '}
                          {flight.arrivalTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-lg font-semibold">
                        ${flight.price}
                      </p>
                      <button
                        ref={index === 0 ? selectButtonRef : null}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        onClick={() => {
                          sessionStorage.setItem(
                            'selectedFlight',
                            JSON.stringify(flight),
                          )
                          console.log('selectedFlight', flight)
                          router.push('/results/flight')
                        }}
                      >
                        Select
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
