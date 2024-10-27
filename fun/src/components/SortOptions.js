// components/SortOptions.js
'use client'

import React from 'react'

export default function SortOptions({sortOption, setSortOption}) {
  return (
    <div className="mb-4">
      <label htmlFor="sort" className="block text-gray-700 font-medium mb-2">
        Sort By
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="departure-asc">
          Departure Time: Earliest to Latest
        </option>
        <option value="departure-desc">
          Departure Time: Latest to Earliest
        </option>
        <option value="arrival-asc">Arrival Time: Earliest to Latest</option>
        <option value="arrival-desc">Arrival Time: Latest to Earliest</option>
      </select>
    </div>
  )
}
