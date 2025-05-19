import { useState } from 'react'
import { Artist } from '@renderer/lib/types'
import { Instagram, Twitter, Facebook, Youtube, Music, Edit2, Trash2, Loader2 } from 'lucide-react'
import EditArtistModal from './EditArtistModal'

interface ArtistItemProps {
  artist: Artist
  onDelete: (id: string) => void
  onUpdate: () => Promise<void>
  isDeleting: boolean
}

const ArtistItem = ({ artist, onDelete, onUpdate, isDeleting }: ArtistItemProps) => {
  const [showEditModal, setShowEditModal] = useState(false)

  return (
    <>
      <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 p-6 hover:bg-slate-800/50 transition-all duration-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">{artist.real_name}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-slate-700/50 text-purple-400 hover:bg-slate-700 hover:text-purple-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(artist.id)}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-slate-700/50 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="space-y-2 text-purple-200 text-sm mb-4">
          <p>Country: {artist.country_of_origin}</p>
          <p>Label: {artist.label}</p>
          <p>Distributor: {artist.distributor}</p>
        </div>
        <p className="text-purple-200/80 text-sm mb-4 line-clamp-3">{artist.biography}</p>
        <div className="flex gap-3">
          {artist.social_media_links.instagram && (
            <a
              href={artist.social_media_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {artist.social_media_links.twitter && (
            <a
              href={artist.social_media_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {artist.social_media_links.facebook && (
            <a
              href={artist.social_media_links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          )}
          {artist.social_media_links.youtube && (
            <a
              href={artist.social_media_links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          )}
          {artist.social_media_links.spotify && (
            <a
              href={artist.social_media_links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Music className="w-5 h-5" />
            </a>
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
