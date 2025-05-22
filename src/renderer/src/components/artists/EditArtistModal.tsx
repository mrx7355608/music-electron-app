import { useState } from 'react'
import { supabase } from '@renderer/lib/supabase'
import { Loader2, X } from 'lucide-react'
import { Artist, ArtistFormData } from '@renderer/lib/types'

interface EditArtistModalProps {
  artist: Artist
  onClose: () => void
  onUpdate: () => Promise<void>
}

const EditArtistModal = ({ artist, onClose, onUpdate }: EditArtistModalProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<ArtistFormData>({
    real_name: artist.real_name,
    country_of_origin: artist.country_of_origin,
    label: artist.label,
    distributor: artist.distributor,
    social_media_links: artist.social_media_links,
    biography: artist.biography
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const platform = name.split('_')[2]
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
      const { error } = await supabase.from('artists').update(formData).eq('id', artist.id)

      if (error) throw error

      await onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating artist:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#181818] rounded-lg border border-[#282828] w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#282828]">
          <h2 className="text-xl font-semibold text-white">Edit Artist</h2>
          <button onClick={onClose} className="text-[#B3B3B3] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="real_name"
                    className="block text-sm font-medium text-[#B3B3B3] mb-1"
                  >
                    Real Name
                  </label>
                  <input
                    type="text"
                    id="real_name"
                    name="real_name"
                    value={formData.real_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country_of_origin"
                    className="block text-sm font-medium text-[#B3B3B3] mb-1"
                  >
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    id="country_of_origin"
                    name="country_of_origin"
                    value={formData.country_of_origin}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="label" className="block text-sm font-medium text-[#B3B3B3] mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="distributor"
                    className="block text-sm font-medium text-[#B3B3B3] mb-1"
                  >
                    Distributor
                  </label>
                  <input
                    type="text"
                    id="distributor"
                    name="distributor"
                    value={formData.distributor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                    Social Media Links
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      name="social_instagram"
                      value={formData.social_media_links.instagram}
                      onChange={handleInputChange}
                      placeholder="Instagram URL"
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                    />
                    <input
                      type="url"
                      name="social_twitter"
                      value={formData.social_media_links.twitter}
                      onChange={handleInputChange}
                      placeholder="Twitter URL"
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                    />
                    <input
                      type="url"
                      name="social_facebook"
                      value={formData.social_media_links.facebook}
                      onChange={handleInputChange}
                      placeholder="Facebook URL"
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                    />
                    <input
                      type="url"
                      name="social_youtube"
                      value={formData.social_media_links.youtube}
                      onChange={handleInputChange}
                      placeholder="YouTube URL"
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                    />
                    <input
                      type="url"
                      name="social_spotify"
                      value={formData.social_media_links.spotify}
                      onChange={handleInputChange}
                      placeholder="Spotify URL"
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="biography"
                    className="block text-sm font-medium text-[#B3B3B3] mb-1"
                  >
                    Biography
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="p-6 border-t border-[#282828] bg-[#181818]">
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-[#282828] text-[#B3B3B3] hover:bg-[#404040] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Artist'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditArtistModal
