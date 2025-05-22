import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Loader2, Music } from 'lucide-react'
import { ReleaseFormData } from '../lib/types'

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
  const [formData, setFormData] = useState<ReleaseFormData>({
    artist_id: '',
    label: '',
    distributor: '',
    title: '',
    genre: '',
    original_producer: '',
    status: 'planned',
    created_at: ''
  })

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('id, real_name')
        .order('real_name')

      if (error) {
        console.error('Error fetching artists:', error)
        return
      }

      setArtists(data || [])
    }

    fetchArtists()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: user } = await supabase.auth.getUser()
      const release_date = new Date(formData.created_at).getDay()
      const release_month = new Date(formData.created_at).getMonth()
      const release_year = new Date(formData.created_at).getFullYear()
      const { error } = await supabase.from('releases').insert({
        ...formData,
        release_date,
        release_month,
        release_year,
        created_at: new Date(formData.created_at),
        created_by: user.user?.id
      })

      if (error) throw error

      // Reset form after successful submission
      setFormData({
        artist_id: '',
        label: '',
        distributor: '',
        title: '',
        created_at: '',
        genre: '',
        original_producer: '',
        status: 'planned'
      })

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
                Release Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors hover:bg-[#282828]"
                placeholder="Enter release title"
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
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
