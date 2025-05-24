import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Artist } from '@renderer/lib/types'
import { Instagram, Twitter, Facebook, Youtube, Music, Edit2, Trash2, Loader2 } from 'lucide-react'
import EditArtistModal from './EditArtistModal'
import { useSettings } from '../../hooks/useSettings'

interface ArtistItemProps {
  artist: Artist
  onDelete: (id: string) => void
  onUpdate: () => Promise<void>
  isDeleting: boolean
  viewMode: 'grid' | 'list'
}

const ArtistItem = ({ artist, onDelete, onUpdate, isDeleting, viewMode }: ArtistItemProps) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const navigate = useNavigate()
  const { settings } = useSettings()

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    navigate(`/artists/${artist.id}`)
  }

  const renderSocialLink = (url: string | undefined, icon: React.ReactNode) => {
    if (!url) return null

    if (settings.link_activation_enabled) {
      return (
        <Link
          to={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1DB954] hover:text-[#1ed760] transition-colors"
        >
          {icon}
        </Link>
      )
    }

    return <span className="text-[#1DB954]">{icon}</span>
  }

  return (
    <>
      <div
        onClick={handleClick}
        className={`bg-[#181818] rounded-lg border border-[#282828] hover:bg-[#282828] transition-colors cursor-pointer ${
          viewMode === 'grid' ? 'p-6' : 'p-4'
        }`}
      >
        <div className={viewMode === 'grid' ? 'space-y-4' : 'flex items-center'}>
          <div
            className={
              viewMode === 'grid' ? 'flex justify-between items-start' : 'flex items-center flex-1'
            }
          >
            <div className="flex items-center w-[200px]">
              <div className="ml-1">
                <h3 className="text-lg font-semibold text-white">{artist.real_name}</h3>
                {viewMode === 'list' && (
                  <p className="text-sm text-[#B3B3B3]">{artist.country_of_origin}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                disabled={isDeleting}
                className="p-1.5 rounded-lg bg-[#282828] text-[#1DB954] hover:bg-[#404040] hover:text-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(artist.id)}
                disabled={isDeleting}
                className="p-1.5 rounded-lg bg-[#282828] text-red-500 hover:bg-[#404040] hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <>
              <div className="space-y-2 text-[#B3B3B3] text-sm">
                <p className="font-bold">
                  Country: <span className="font-normal">{artist.country_of_origin}</span>
                </p>
                <p className="font-bold">
                  Label: <span className="font-normal">{artist.label}</span>
                </p>
                <p className="font-bold">
                  Distributor: <span className="font-normal">{artist.distributor}</span>
                </p>
              </div>
              <p className="text-[#B3B3B3] text-sm line-clamp-3 my-6">{artist.biography}</p>
              <div className="flex gap-3">
                {renderSocialLink(
                  artist.social_media_links.instagram,
                  <Instagram className="w-5 h-5" />
                )}
                {renderSocialLink(
                  artist.social_media_links.twitter,
                  <Twitter className="w-5 h-5" />
                )}
                {renderSocialLink(
                  artist.social_media_links.facebook,
                  <Facebook className="w-5 h-5" />
                )}
                {renderSocialLink(
                  artist.social_media_links.youtube,
                  <Youtube className="w-5 h-5" />
                )}
                {renderSocialLink(artist.social_media_links.spotify, <Music className="w-5 h-5" />)}
              </div>
            </>
          ) : (
            <div className="flex items-center flex-1 gap-4">
              <div className="w-[150px]">
                <span className="text-xs uppercase tracking-wider text-[#808080]">Label</span>
                <p className="mt-1 text-gray-300 text-sm">{artist.label}</p>
              </div>
              <div className="w-[150px]">
                <span className="text-xs uppercase tracking-wider text-[#808080]">Distributor</span>
                <p className="mt-1 text-gray-300 text-sm">{artist.distributor}</p>
              </div>
              <div className="flex gap-3 ml-auto">
                {renderSocialLink(
                  artist.social_media_links.instagram,
                  <Instagram className="w-5 h-5" />
                )}
                {renderSocialLink(
                  artist.social_media_links.twitter,
                  <Twitter className="w-5 h-5" />
                )}
                {renderSocialLink(
                  artist.social_media_links.facebook,
                  <Facebook className="w-5 h-5" />
                )}
                {renderSocialLink(
                  artist.social_media_links.youtube,
                  <Youtube className="w-5 h-5" />
                )}
                {renderSocialLink(artist.social_media_links.spotify, <Music className="w-5 h-5" />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditArtistModal
          artist={artist}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}

export default ArtistItem
