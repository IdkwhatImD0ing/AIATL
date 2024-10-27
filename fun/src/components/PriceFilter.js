// components/PriceFilter.js
'use client'

import React from 'react'

export default function PriceFilter({priceRange, setPriceRange}) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">
        Price Range ($)
      </label>
      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="Min"
          value={priceRange.min}
          onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
          className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Max"
          value={priceRange.max}
          onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
          className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  )
}
