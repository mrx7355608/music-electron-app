import React from 'react'

const Playlists: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Playlists</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
              <div>
                <h3 className="text-lg font-semibold">Playlist {i}</h3>
                <p className="text-gray-600 text-sm">X songs • Y minutes</p>
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">#{j}</span>
                  <span>Song Title - Artist Name</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Playlists
