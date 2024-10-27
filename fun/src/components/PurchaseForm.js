import React from 'react'

const PurchaseForm = ({
  onSubmit,
  fullNameRef,
  emailRef,
  cardNumberRef,
  expiryDateRef,
  cvvRef,
  confirmButtonRef,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-gray-300 font-medium">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          ref={fullNameRef}
          required
          className="mt-1 w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Email Address */}
      <div>
        <label htmlFor="email" className="block text-gray-300 font-medium">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          ref={emailRef}
          required
          className="mt-1 w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Credit Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-gray-300 font-medium">
          Credit Card Number
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          placeholder="Enter your card number"
          ref={cardNumberRef}
          required
          pattern="\d{16}"
          title="Please enter a 16-digit card number"
          className="mt-1 w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expiryDate" className="block text-gray-300 font-medium">
          Expiry Date
        </label>
        <input
          type="month"
          id="expiryDate"
          name="expiryDate"
          ref={expiryDateRef}
          required
          className="mt-1 w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* CVV */}
      <div>
        <label htmlFor="cvv" className="block text-gray-300 font-medium">
          CVV
        </label>
        <input
          type="text"
          id="cvv"
          name="cvv"
          placeholder="Enter your CVV"
          ref={cvvRef}
          required
          pattern="\d{3}"
          title="Please enter a 3-digit CVV"
          className="mt-1 w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Confirm Purchase Button */}
      <div>
        <button
          type="submit"
          ref={confirmButtonRef}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors"
        >
          Confirm Purchase
        </button>
      </div>
    </form>
  )
}

export default PurchaseForm
