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
    bundle: '',
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
      const release_date = new Date(formData.created_at).getDay()
      const release_month = new Date(formData.created_at).getMonth()
      const release_year = new Date(formData.created_at).getFullYear()
      const { error } = await supabase.from('releases').insert({
        ...formData,
        release_date,
        release_month,
        release_year,
        created_at: new Date(formData.created_at)
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
        bundle: '',
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
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Music className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            Add New Release
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Artist
              </label>
              <select
                name="artist_id"
                value={formData.artist_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70 appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-800">
                  Select an artist
                </option>
                {artists.map((artist) => (
                  <option key={artist.id} value={artist.id} className="bg-slate-800">
                    {artist.real_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Label
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70"
                placeholder="Enter label name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Distributor
              </label>
              <input
                type="text"
                name="distributor"
                value={formData.distributor}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70"
                placeholder="Enter distributor"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70"
                placeholder="Enter release title"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Created At
              </label>
              <input
                type="date"
                name="created_at"
                value={formData.created_at}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70 appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-800">
                  Select a genre
                </option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-slate-800">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Bundle
              </label>
              <input
                type="text"
                name="bundle"
                value={formData.bundle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70"
                placeholder="Enter bundle name (optional)"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Original Producer
              </label>
              <input
                type="text"
                name="original_producer"
                value={formData.original_producer}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70"
                placeholder="Enter producer name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-purple-200 mb-2 group-hover:text-purple-400 transition-colors">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-slate-800/70 appearance-none cursor-pointer"
              >
                <option value="planned" className="bg-slate-800">
                  Planned
                </option>
                <option value="online" className="bg-slate-800">
                  Online
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Adding Release...</span>
                </>
              ) : (
                'Add Release'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Releases
