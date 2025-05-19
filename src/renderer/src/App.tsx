import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Artists from './pages/ArtistsPage'
import Playlists from './pages/Playlists'
import Bundles from './pages/Bundles'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Releases from './pages/Releases'

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex bg-slate-50">
    <Sidebar />
    <main className="flex-1 ml-64">{children}</main>
  </div>
)

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/artists"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Artists />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlists"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Playlists />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bundles"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Bundles />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/releases"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Releases />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Users />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
