import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Loader2, Music, Plus } from 'lucide-react'
import { ReleaseFormData, Track } from '../lib/types'

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

const Releases = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [artists, setArtists] = useState<{ id: string; real_name: string }[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [formData, setFormData] = useState<ReleaseFormData>({
    artist_id: '',
    label: '',
    distributor: '',
    genre: '',
    original_producer: '',
    status: 'planned',
    created_at: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      const [artistsResponse, tracksResponse] = await Promise.all([
        supabase.from('artists').select('id, real_name').order('real_name'),
        supabase
          .from('tracks')
          .select('*, artist:artist_id(real_name)')
          .is('release_id', null)
          .order('created_at', { ascending: false })
      ])

      if (artistsResponse.error) {
        console.error('Error fetching artists:', artistsResponse.error)
        return
      }

      if (tracksResponse.error) {
        console.error('Error fetching tracks:', tracksResponse.error)
        return
      }

      setArtists(artistsResponse.data || [])
      setTracks(tracksResponse.data || [])
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTrack = (trackId: string) => {
    if (!selectedTracks.includes(trackId)) {
      setSelectedTracks([...selectedTracks, trackId])
    }
  }

  const handleRemoveTrack = (trackId: string) => {
    setSelectedTracks(selectedTracks.filter((id) => id !== trackId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: user } = await supabase.auth.getUser()
      const release_date = new Date(formData.created_at).getDate()
      const release_month = new Date(formData.created_at).getMonth() + 1
      const release_year = new Date(formData.created_at).getFullYear()

      // First create the release
      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert({
          ...formData,
          release_date: release_date.toString().padStart(2, '0'),
          release_month: release_month.toString().padStart(2, '0'),
          release_year: release_year.toString(),
          created_at: new Date(formData.created_at),
          created_by: user.user?.id
        })
        .select()
        .single()

      if (releaseError) throw releaseError

      // Then update tracks entries
      const promises = selectedTracks.map((trackId) => {
        return supabase
          .from('tracks')
          .update({
            release_id: release.id
          })
          .eq('id', trackId)
      })
      const [tracksResult] = await Promise.all(promises)
      if (tracksResult.error) throw tracksResult.error

      // Reset form after successful submission
      setFormData({
        artist_id: '',
        label: '',
        distributor: '',
        created_at: '',
        genre: '',
        original_producer: '',
        status: 'planned'
      })
      setSelectedTracks([])

      alert('Release added successfully!')
    } catch (error) {
      console.error('Error adding release:', error)
      alert('Error adding release. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-8">
          <Music className="w-8 h-8 text-[#1DB954]" />
          <h1 className="text-3xl font-bold text-white">Add New Release</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Artist
              </label>
              <select
                name="artist_id"
                value={formData.artist_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828] appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#121212]">
                  Select an artist
                </option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id} className="bg-[#121212]">
                    {artist.real_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828]"
                placeholder="Enter label name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Distributor
              </label>
              <input
                type="text"
                name="distributor"
                value={formData.distributor}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828]"
                placeholder="Enter distributor name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828] appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#121212]">
                  Select a genre
                </option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-[#121212]">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Original Producer
              </label>
              <input
                type="text"
                name="original_producer"
                value={formData.original_producer}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828]"
                placeholder="Enter original producer"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Release Date
              </label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828]"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2 group-hover:text-white transition-colors">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828] appearance-none cursor-pointer"
              >
                <option value="planned" className="bg-[#121212]">
                  Planned
                </option>
                <option value="online" className="bg-[#121212]">
                  Online
                </option>
              </select>
            </div>
          </div>

          {/* Release Tracks Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Release Tracks</h2>
            <div className="bg-[#181818] rounded-lg border border-[#282828] divide-y divide-[#282828]">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-4 hover:bg-[#282828] transition-colors"
                >
                  <div className="flex-1">
                    <div className="text-white font-medium">{track.title}</div>
                    <div className="text-[#B3B3B3] text-sm mt-1">
                      {track.artist.real_name} • {Math.floor(track.duration / 60)}:
                      {(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div>
                    {selectedTracks.includes(track.id) ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveTrack(track.id)}
                        className="text-red-500 hover:text-red-400 transition-colors px-3 py-1 rounded-full border border-red-500 hover:border-red-400"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddTrack(track.id)}
                        className="text-[#1DB954] hover:text-[#1ed760] transition-colors p-2 rounded-full hover:bg-[#282828]"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || selectedTracks.length === 0}
              className="px-6 py-3 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Adding Release...</span>
                </>
              ) : (
                <span>Add Release</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Releases
