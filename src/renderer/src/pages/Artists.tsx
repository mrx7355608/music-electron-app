import React from 'react'

const Artists: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Artists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Artist {i}</h3>
              <p className="text-gray-600 text-sm">Genre • X Albums</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Artists
