// app/page.js
'use client'

import {useState, useEffect} from 'react'
import {useRouter} from 'next/navigation'
import local from 'next/font/local'
import * as multimodal from '@nlxai/multimodal'

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: '',
    departure: '',
    return: '',
  })
  const [client, setClient] = useState(null)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const cidParam = params.get('cid')
    if (cidParam) {
      localStorage.setItem('cid', cidParam)
      const client = multimodal.create({
        // hard-coded params
        apiKey: 'qS6KFGgY9Rt/uCcjLw',
        workspaceId: '1648b2f6-14fd-4023-81cd-8a7b2efec4cd',
        journeyId: '4a1e5904-7b18-401f-8e60-80a3df751063',
        // dynamic params
        conversationId: cidParam,
        languageCode: navigator.language,
      })
      setClient(client)
      client.sendStep('ee3cd7b8-05e0-41d7-a8e6-b2639aa17d72')
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
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
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Search Button */}
          <div>
            <button
              type="submit"
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
