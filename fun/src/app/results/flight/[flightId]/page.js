// app/results/flight/[flightId]/page.js
'use client'

import {useRouter, useParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import PurchaseForm from '../../../../components/PurchaseForm'

export default function FlightDetails() {
  const router = useRouter()
  const params = useParams()
  const flightId = params.flightId

  const [flight, setFlight] = useState(null)

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

  if (!flight) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Loading flight details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
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

        {/* Purchase Button */}
        <div className="mt-6">
          <PurchaseForm />
        </div>
      </div>
    </div>
  )
}
