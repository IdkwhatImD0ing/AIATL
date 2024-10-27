// components/DepartureTimeFilter.js
'use client'

import React, {forwardRef} from 'react'

const DepartureTimeFilter = forwardRef(
  ({departureTime, setDepartureTime}, ref) => {
    return (
      <div className="mb-4" ref={ref}>
        <span className="block text-white font-medium mb-2">
          Departure Time
        </span>
        <div className="flex flex-col space-y-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={departureTime.morning}
              onChange={() =>
                setDepartureTime({
                  ...departureTime,
                  morning: !departureTime.morning,
                })
              }
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Morning (12 AM - 11:59 AM)</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={departureTime.afternoon}
              onChange={() =>
                setDepartureTime({
                  ...departureTime,
                  afternoon: !departureTime.afternoon,
                })
              }
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Afternoon (12 PM - 5:59 PM)</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={departureTime.evening}
              onChange={() =>
                setDepartureTime({
                  ...departureTime,
                  evening: !departureTime.evening,
                })
              }
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Evening (6 PM - 11:59 PM)</span>
          </label>
        </div>
      </div>
    )
  },
)

export default DepartureTimeFilter
