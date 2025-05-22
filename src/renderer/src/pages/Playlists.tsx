import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, ChevronDown, Music, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'

const genres = [
  'Pop',
  'K-Pop',
  'Rap',
  'Rock',
  'Hip Hop',
  'Electronic',
  'Classical',
  'Indie'
] as const

const playlistTypes = ['Spotify Editorial', 'Spotify User', 'Internal Promo', 'Youtube'] as const

interface Playlist {
  id: string
  title: string
  color_code: string
  type: string
  genre: string
  promo_tag: string
  last_updated: string
  user_name: string
  total_hours: number
  total_songs: number
  our_songs: number
  likes: number
}

// Mock data for missing fields
const mockPlaylistData = {
  total_hours: 2.5,
  likes: 1234
}

const Playlists = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    color_code: '#1DB954',
    type: '',
    genre: '',
    promo_tag: ''
  })

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('last_updated', { ascending: false })

      if (error) throw error
      // Add mock data to each playlist
      const playlistsWithMockData = (data || []).map((playlist) => ({
        ...playlist,
        ...mockPlaylistData
      }))
      setPlaylists(playlistsWithMockData)
    } catch (error) {
      console.error('Error fetching playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from('playlists').insert({
        ...formData,
        last_updated: new Date().toISOString(),
        user_name: 'User - 1'
      })

      if (error) throw error

      setIsModalOpen(false)
      setFormData({
        title: '',
        color_code: '#1DB954',
        type: '',
        genre: '',
        promo_tag: ''
      })
      fetchPlaylists()
      alert('Playlist created successfully!')
    } catch (error) {
      console.error('Error creating playlist:', error)
      alert('Error creating playlist. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlists/${playlistId}`)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Playlists</h1>
        </div>

        {/* Playlist Accordion */}
        <div className="bg-[#181818] rounded-lg overflow-hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#282828] transition-colors"
          >
            <div className="flex items-center gap-4">
              <Music className="w-6 h-6 text-[#1DB954]" />
              <div className="text-left">
                <h3 className="text-white font-medium">User - 1</h3>
                <a
                  href="https://open.spotify.com/user/spotify"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B3B3B3] text-sm hover:text-white flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  spotify
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-[#B3B3B3] transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isExpanded && (
            <div className="px-6 py-4 border-t border-[#282828]">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#282828] p-4 rounded-lg">
                  <h4 className="text-[#B3B3B3] text-sm mb-1">Email</h4>
                  <p className="text-white">user1@example.com</p>
                </div>
                <div className="bg-[#282828] p-4 rounded-lg">
                  <h4 className="text-[#B3B3B3] text-sm mb-1">Password</h4>
                  <p className="text-white">••••••••</p>
                </div>
                <div className="bg-[#282828] p-4 rounded-lg">
                  <h4 className="text-[#B3B3B3] text-sm mb-1">Creator</h4>
                  <p className="text-white">John Doe</p>
                </div>
                <div className="bg-[#282828] p-4 rounded-lg">
                  <h4 className="text-[#B3B3B3] text-sm mb-1">Location</h4>
                  <p className="text-white">New York, USA</p>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create New Playlist
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 text-[#1DB954] animate-spin" />
                </div>
              ) : playlists.length === 0 ? (
                <div className="text-center text-[#B3B3B3] py-8">No playlists found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[#B3B3B3] text-sm border-b border-[#282828]">
                        <th className="pb-4 font-medium">Title</th>
                        <th className="pb-4 font-medium">Last Updated</th>
                        <th className="pb-4 font-medium">Total Hours</th>
                        <th className="pb-4 font-medium">Total Songs</th>
                        <th className="pb-4 font-medium">Our Songs</th>
                        <th className="pb-4 font-medium">Likes</th>
                        <th className="pb-4 font-medium">Genre</th>
                        <th className="pb-4 font-medium">Promo Tag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playlists.map((playlist) => (
                        <tr
                          key={playlist.id}
                          onClick={() => handlePlaylistClick(playlist.id)}
                          className="text-white border-b border-[#282828] hover:bg-[#282828] transition-colors cursor-pointer"
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded"
                                style={{ backgroundColor: playlist.color_code }}
                              />
                              {playlist.title}
                            </div>
                          </td>
                          <td className="py-4 text-[#B3B3B3]">
                            {new Date(playlist.last_updated).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-[#B3B3B3]">{playlist.total_hours}</td>
                          <td className="py-4 text-[#B3B3B3]">{playlist.total_songs}</td>
                          <td className="py-4 text-[#B3B3B3]">{playlist.our_songs}</td>
                          <td className="py-4 text-[#B3B3B3]">{playlist.likes}</td>
                          <td className="py-4 text-[#B3B3B3]">{playlist.genre}</td>
                          <td className="py-4 text-[#B3B3B3]">{playlist.promo_tag}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Playlist Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#181818] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Playlist</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                    Color Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color_code}
                      onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color_code}
                      onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
                      className="flex-1 px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                      placeholder="#1DB954"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    required
                  >
                    <option value="">Select a type</option>
                    {playlistTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Genre</label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    required
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Promo Tag</label>
                  <input
                    type="text"
                    value={formData.promo_tag}
                    onChange={(e) => setFormData({ ...formData, promo_tag: e.target.value })}
                    className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    placeholder="Enter promo tag"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Playlist'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Playlists
