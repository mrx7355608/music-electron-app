import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-green">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Plays</h2>
          <p className="text-gray-600">No recent plays</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Artists</h2>
          <p className="text-gray-600">No top artists yet</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Favorite Playlists</h2>
          <p className="text-gray-600">No favorite playlists</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
