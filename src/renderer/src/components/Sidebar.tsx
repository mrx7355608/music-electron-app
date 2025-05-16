import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Mic2, PlaySquare, Package, Users, Settings, Music } from 'lucide-react'

const Sidebar = (): JSX.Element => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/artists', label: 'Artists', icon: Mic2 },
    { path: '/playlists', label: 'Playlists', icon: PlaySquare },
    { path: '/bundles', label: 'Bundles', icon: Package },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-blue-500" />
          <span className="text-lg font-semibold text-white">Harmony Hub</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 transition-transform duration-150 
                  ${isActive ? 'text-white' : 'group-hover:scale-110'}`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 text-slate-400">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <div className="text-sm font-medium text-white">Admin User</div>
            <div className="text-xs">admin@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
