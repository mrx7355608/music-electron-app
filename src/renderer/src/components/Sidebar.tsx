import { Link, useLocation } from 'react-router-dom'

const Sidebar = (): JSX.Element => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/artists', label: 'Artists', icon: '🎤' },
    { path: '/playlists', label: 'Playlists', icon: '🎵' },
    { path: '/bundles', label: 'Bundles', icon: '📦' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-4">
      <div className="text-xl font-bold mb-8 px-4">Music App</div>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
              location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
