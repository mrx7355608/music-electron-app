import { ArtistFormData } from '@renderer/lib/types'
import { useState } from 'react'
import { supabase } from '@renderer/lib/supabase'
import { Instagram, Twitter, Facebook, Youtube, Music } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface ArtistFormProps {
  setShowAddModal: (show: boolean) => void
  fetchArtists: () => Promise<void>
}

const ArtistForm = ({ setShowAddModal, fetchArtists }: ArtistFormProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<ArtistFormData>({
    real_name: '',
    country_of_origin: '',
    label: '',
    distributor: '',
    social_media_links: {
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: '',
      spotify: ''
    },
    biography: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const platform = name.split('_')[1]
      setFormData((prev) => ({
        ...prev,
        social_media_links: {
          ...prev.social_media_links,
          [platform]: value
        }
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Get the authenticated user's ID
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) throw new Error('No authenticated user found')

      const { error } = await supabase.from('artists').insert({
        ...formData,
        created_by: authData.user.id
      })

      if (error) throw error

      await fetchArtists()
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creating artist:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Real Name</label>
          <input
            type="text"
            name="real_name"
            value={formData.real_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Country of Origin</label>
          <input
            type="text"
            name="country_of_origin"
            value={formData.country_of_origin}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Label</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Distributor</label>
          <input
            type="text"
            name="distributor"
            value={formData.distributor}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Social Media Links</label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#1DB954]" />
            <input
              type="url"
              name="social_instagram"
              value={formData.social_media_links.instagram || ''}
              onChange={handleInputChange}
              placeholder="Instagram URL"
              className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Twitter className="w-5 h-5 text-[#1DB954]" />
            <input
              type="url"
              name="social_twitter"
              value={formData.social_media_links.twitter || ''}
              onChange={handleInputChange}
              placeholder="Twitter URL"
              className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Facebook className="w-5 h-5 text-[#1DB954]" />
            <input
              type="url"
              name="social_facebook"
              value={formData.social_media_links.facebook || ''}
              onChange={handleInputChange}
              placeholder="Facebook URL"
              className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-[#1DB954]" />
            <input
              type="url"
              name="social_youtube"
              value={formData.social_media_links.youtube || ''}
              onChange={handleInputChange}
              placeholder="YouTube URL"
              className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#1DB954]" />
            <input
              type="url"
              name="social_spotify"
              value={formData.social_media_links.spotify || ''}
              onChange={handleInputChange}
              placeholder="Spotify URL"
              className="flex-1 px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Biography</label>
        <textarea
          name="biography"
          value={formData.biography}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setShowAddModal(false)}
          className="px-6 py-2 rounded-lg bg-[#282828] text-[#B3B3B3] hover:bg-[#404040] hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Adding Artist...</span>
            </>
          ) : (
            'Add Artist'
          )}
        </button>
      </div>
    </form>
  )
}

export default ArtistForm
