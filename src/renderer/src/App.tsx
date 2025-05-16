import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Artists from './pages/Artists'
import Playlists from './pages/Playlists'
import Bundles from './pages/Bundles'
import Settings from './pages/Settings'

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/bundles" element={<Bundles />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
