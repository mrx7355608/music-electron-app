import React from 'react'

const Settings: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="max-w-2xl bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Audio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Output Device
                </label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>High (320 kbps)</option>
                  <option>Medium (160 kbps)</option>
                  <option>Low (96 kbps)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Storage</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" id="offline-mode" />
                <label htmlFor="offline-mode">Enable offline mode</label>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cache: 0 MB used</p>
                <button className="mt-2 text-blue-600 hover:text-blue-700">Clear cache</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
