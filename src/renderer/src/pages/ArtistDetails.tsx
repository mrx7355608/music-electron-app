import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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
import { useSettings } from '../hooks/useSettings'

const ArtistDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const { settings } = useSettings()

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

  const renderSocialLink = (url: string | undefined, icon: React.ReactNode, label: string) => {
    if (!url) return null

    if (settings.link_activation_enabled) {
      return (
        <Link
          to={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-3 rounded-lg bg-[#282828] text-[#B3B3B3] hover:bg-[#404040] hover:text-white transition-colors"
        >
          {icon}
          <span>{label}</span>
        </Link>
      )
    }

    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-[#282828] text-[#B3B3B3]">
        {icon}
        <span>{label}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-5xl mx-auto p-8">
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-2 text-[#B3B3B3]">
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
      <div className="min-h-screen bg-black">
        <div className="max-w-5xl mx-auto p-8">
          <div className="text-center py-12 text-[#B3B3B3]">Artist not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/artists')}
              className="p-2 rounded-lg bg-[#282828] text-[#B3B3B3] hover:bg-[#404040] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">{artist.real_name}</h1>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Artist
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="col-span-1 space-y-6">
            <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#1DB954] mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-[#B3B3B3]">Country of Origin</h3>
                    <p className="text-white">{artist.country_of_origin}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#1DB954] mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-[#B3B3B3]">Label</h3>
                    <p className="text-white">{artist.label}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-[#1DB954] mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-[#B3B3B3]">Distributor</h3>
                    <p className="text-white">{artist.distributor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Social Media</h2>
              <div className="grid grid-cols-2 gap-4">
                {renderSocialLink(
                  artist.social_media_links.instagram,
                  <Instagram className="w-5 h-5" />,
                  'Instagram'
                )}
                {renderSocialLink(
                  artist.social_media_links.twitter,
                  <Twitter className="w-5 h-5" />,
                  'Twitter'
                )}
                {renderSocialLink(
                  artist.social_media_links.facebook,
                  <Facebook className="w-5 h-5" />,
                  'Facebook'
                )}
                {renderSocialLink(
                  artist.social_media_links.youtube,
                  <Youtube className="w-5 h-5" />,
                  'YouTube'
                )}
                {renderSocialLink(
                  artist.social_media_links.spotify,
                  <Music className="w-5 h-5" />,
                  'Spotify'
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Biography */}
          <div className="col-span-2">
            <div className="bg-[#181818] rounded-lg border border-[#282828] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Biography</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-[#B3B3B3] whitespace-pre-wrap leading-relaxed">
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
