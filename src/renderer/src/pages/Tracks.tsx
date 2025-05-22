import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Artist, Track } from '@renderer/lib/types'

const Tracks = () => {
  const [tracks, setTracks] = useState<Track[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    duration: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [tracksResponse, artistsResponse] = await Promise.all([
        supabase
          .from('tracks')
          .select('*, artist:artist_id(real_name)')
          .order('created_at', { ascending: false }),
        supabase.from('artists').select('*').order('real_name')
      ])

      if (tracksResponse.error) throw tracksResponse.error
      if (artistsResponse.error) throw artistsResponse.error

      setTracks(tracksResponse.data)
      setArtists(artistsResponse.data)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Error loading tracks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const { error } = await supabase.from('tracks').insert({
        title: formData.title,
        artist_id: formData.artist_id,
        duration: parseInt(formData.duration)
      })

      if (error) throw error

      await loadData()
      setIsModalOpen(false)
      setFormData({ title: '', artist_id: '', duration: '' })
    } catch (error) {
      console.error('Error adding track:', error)
      alert('Error adding track')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Tracks</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Track
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-[#1DB954] animate-spin" />
          </div>
        ) : (
          <div className="bg-[#181818] rounded-lg border border-[#282828] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#282828]">
                  <th className="px-6 py-4 text-left text-[#B3B3B3] font-medium">Title</th>
                  <th className="px-6 py-4 text-left text-[#B3B3B3] font-medium">Artist</th>
                  <th className="px-6 py-4 text-left text-[#B3B3B3] font-medium">Duration</th>
                  <th className="px-6 py-4 text-left text-[#B3B3B3] font-medium">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track) => (
                  <tr key={track.id} className="border-b border-[#282828] hover:bg-[#282828]">
                    <td className="px-6 py-4 text-white">{track.title}</td>
                    <td className="px-6 py-4 text-white">{track.artist.real_name || 'N/A'}</td>
                    <td className="px-6 py-4 text-white">{formatDuration(track.duration)}</td>
                    <td className="px-6 py-4 text-white">{formatDate(track.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Track Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-[#181818] rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Track</h2>
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
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Artist</label>
                  <select
                    value={formData.artist_id}
                    onChange={(e) => setFormData({ ...formData, artist_id: e.target.value })}
                    className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    required
                  >
                    <option value="">Select an artist</option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.real_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                    required
                    min="1"
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
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Track'
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

export default Tracks
