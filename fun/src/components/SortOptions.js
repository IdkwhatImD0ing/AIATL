// components/SortOptions.js
import React, {forwardRef} from 'react'

const SortOptions = forwardRef(({sortOption, setSortOption}, ref) => {
  return (
    <div ref={ref}>
      <label htmlFor="sort" className="block text-white">
        Sort By
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select an option</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
        <option value="departure-asc">Departure Time (Earliest First)</option>
        <option value="departure-desc">Departure Time (Latest First)</option>
        <option value="arrival-asc">Arrival Time (Earliest First)</option>
        <option value="arrival-desc">Arrival Time (Latest First)</option>
      </select>
    </div>
  )
})

export default SortOptions
