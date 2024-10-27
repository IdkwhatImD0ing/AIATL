// components/PurchaseForm.js
'use client'

import {useState} from 'react'

export default function PurchaseForm() {
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePurchaseClick = () => {
    setIsPurchasing(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here (e.g., API call)
    console.log('Purchase Details:', formData)
    alert('Purchase Successful!')
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    })
    setIsPurchasing(false)
  }

  return (
    <div>
      {!isPurchasing ? (
        <button
          onClick={handlePurchaseClick}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Purchase
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div>
            <label htmlFor="fullName" className="block text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Credit Card Information */}
          <div>
            <label htmlFor="cardNumber" className="block text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              pattern="\d{16}"
              title="Please enter a 16-digit card number"
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your card number"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiryDate" className="block text-gray-700">
                Expiry Date
              </label>
              <input
                type="month"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="block text-gray-700">
                CVV
              </label>
              <input
                type="password"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                required
                pattern="\d{3}"
                title="Please enter a 3-digit CVV"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter CVV"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Confirm Purchase
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
