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
  Disc,
  ListMusic,
  Menu,
  X
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onCollapse(newState)
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/artists', label: 'Artists', icon: Mic2 },
    { path: '/tracks', label: 'Tracks', icon: ListMusic },
    { path: '/playlists', label: 'Playlists', icon: PlaySquare },
    { path: '/releases', label: 'Releases', icon: Disc },
    { path: '/bundles', label: 'Bundles', icon: Package },
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
    <div
      className={`bg-[#121212] h-screen fixed left-0 top-0 flex flex-col shadow-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-6 border-b border-[#282828] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {!isCollapsed && (
            <>
              <Music className="w-8 h-8 text-[#1DB954]" />
              <span className="text-lg font-semibold text-white">Sancover WaveStation</span>
            </>
          )}
        </div>
        <button
          onClick={handleCollapse}
          className="p-1 rounded-lg hover:bg-[#282828] transition-colors"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5 text-[#B3B3B3]" />
          ) : (
            <X className="w-5 h-5 text-[#B3B3B3]" />
          )}
        </button>
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
                className={`flex items-center rounded-lg transition-all duration-150 group
                  ${
                    isActive
                      ? 'bg-[#282828] text-white'
                      : 'text-[#B3B3B3] hover:bg-[#282828] hover:text-white'
                  }
                  ${isCollapsed ? 'px-2.5 py-3' : 'px-4 py-3'}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon
                  className={`transition-transform duration-150 
                  ${isActive ? 'text-white' : 'group-hover:scale-110'} 
                  ${isCollapsed ? 'w-5 h-5 mx-auto' : 'w-5 h-5 mr-3'}`}
                />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="p-4 border-t border-[#282828] relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-full flex items-center gap-3 text-[#B3B3B3] hover:bg-[#282828] rounded-lg transition-colors group
            ${isCollapsed ? 'px-2.5 py-3' : 'px-4 py-3'}`}
        >
          <div
            className={`rounded-full bg-[#1DB954] flex items-center justify-center text-white font-semibold
            ${isCollapsed ? 'w-7 h-7' : 'w-8 h-8'}`}
          >
            {user?.email?.[0].toUpperCase() || 'A'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">
                {user?.email?.split('@')[0] || 'Admin User'}
              </div>
              <div className="text-xs truncate text-[#B3B3B3]">
                {user?.email || 'admin@example.com'}
              </div>
            </div>
          )}
          {!isCollapsed && (
            <ChevronUp
              className={`w-5 h-5 text-[#B3B3B3] transition-transform duration-200 ${
                isMenuOpen ? 'rotate-0' : 'rotate-180'
              }`}
            />
          )}
        </button>

        {/* User Menu */}
        {isMenuOpen && !isCollapsed && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#282828] rounded-lg shadow-lg border border-[#404040] overflow-hidden">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-[#B3B3B3] hover:bg-[#404040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
