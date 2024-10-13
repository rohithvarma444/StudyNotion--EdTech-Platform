import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-white">
      <FaExclamationTriangle className="text-white text-9xl mb-8" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
      <Link 
        to="/" 
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
      >
        Go back to homepage
      </Link>
    </div>
  )
}

export default Error
