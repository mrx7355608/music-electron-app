import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@renderer/lib/supabase'
import { Artist } from '@renderer/lib/types'
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music,
  ArrowLeft,
  Loader2,
  Edit2,
  Globe,
  Building2,
  Truck
} from 'lucide-react'
import EditArtistModal from '@renderer/components/artists/EditArtistModal'

const ArtistDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)

  const fetchArtist = async () => {
    if (!id) return
    setLoading(true)
    try {
      const { data, error } = await supabase.from('artists').select('*').eq('id', id).single()

      if (error) throw error
      setArtist(data)
    } catch (error) {
      console.error('Error fetching artist:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtist()
  }, [id])

  if (loading) {
    return (
      <div className="p-8 bg-slate-900 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-2 text-purple-200">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading artist details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="p-8 bg-slate-900 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12 text-purple-200">Artist not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-slate-900 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/artists')}
              className="p-2 rounded-lg bg-slate-800 text-purple-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              {artist.real_name}
            </h1>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Artist
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="col-span-1 space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-200">Country of Origin</h3>
                    <p className="text-slate-200">{artist.country_of_origin}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-200">Label</h3>
                    <p className="text-slate-200">{artist.label}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-purple-200">Distributor</h3>
                    <p className="text-slate-200">{artist.distributor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Social Media</h2>
              <div className="grid grid-cols-2 gap-4">
                {artist.social_media_links.instagram && (
                  <a
                    href={artist.social_media_links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-700 text-purple-200 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                    <span>Instagram</span>
                  </a>
                )}
                {artist.social_media_links.twitter && (
                  <a
                    href={artist.social_media_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-700 text-purple-200 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </a>
                )}
                {artist.social_media_links.facebook && (
                  <a
                    href={artist.social_media_links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-700 text-purple-200 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </a>
                )}
                {artist.social_media_links.youtube && (
                  <a
                    href={artist.social_media_links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-700 text-purple-200 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                    <span>YouTube</span>
                  </a>
                )}
                {artist.social_media_links.spotify && (
                  <a
                    href={artist.social_media_links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-slate-700 text-purple-200 hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <Music className="w-5 h-5" />
                    <span>Spotify</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Biography */}
          <div className="col-span-2">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Biography</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {artist.biography}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditArtistModal
          artist={artist}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchArtist}
        />
      )}
    </div>
  )
}

export default ArtistDetails
