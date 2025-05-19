import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard,
  Mic2,
  PlaySquare,
  Package,
  Users,
  Settings,
  Music,
  LogOut,
  ChevronUp,
  Loader2,
  Disc
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/artists', label: 'Artists', icon: Mic2 },
    { path: '/playlists', label: 'Playlists', icon: PlaySquare },
    { path: '/bundles', label: 'Bundles', icon: Package },
    { path: '/releases', label: 'Releases', icon: Disc },
    { path: '/users', label: 'Users', icon: Users },
    { path: '/settings', label: 'Settings', icon: Settings }
  ]

  const handleLogout = async (): Promise<void> => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

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
      <div className="p-4 border-t border-slate-800 relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-white">
              {user?.email?.split('@')[0] || 'Admin User'}
            </div>
            <div className="text-xs truncate">{user?.email || 'admin@example.com'}</div>
          </div>
          <ChevronUp
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isMenuOpen ? 'rotate-0' : 'rotate-180'
            }`}
          />
        </button>

        {/* User Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 px-4 py-3 text-slate-400 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
