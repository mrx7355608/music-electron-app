import React from 'react'

const Bundles: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bundles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">Bundle {i}</h3>
                <p className="text-gray-600">Collection of curated music</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {i === 1 ? 'Featured' : 'New'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div className="aspect-square bg-gray-200 rounded"></div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bundles
