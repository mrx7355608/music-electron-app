import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Loader2, X, List, Grid } from 'lucide-react'
import { Artist } from '../lib/types'
import ArtistItem from '@renderer/components/artists/ArtistItem'
import ArtistForm from '@renderer/components/artists/ArtistForm'

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingArtistId, setDeletingArtistId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const fetchArtists = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('artists').select('*')

      if (error) throw error
      setArtists(data || [])
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingArtistId(id)
    try {
      const { error } = await supabase.from('artists').delete().eq('id', id)
      if (error) throw error
      await fetchArtists()
    } catch (error) {
      console.error('Error deleting artist:', error)
    } finally {
      setDeletingArtistId(null)
    }
  }

  useEffect(() => {
    fetchArtists()
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Artists</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#282828] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#1DB954] text-white'
                    : 'text-[#B3B3B3] hover:text-white'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#1DB954] text-white'
                    : 'text-[#B3B3B3] hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Artist
            </button>
          </div>
        </div>

        {/* Show artists list */}
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="flex items-center gap-2 text-[#B3B3B3]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading artists...</span>
              </div>
            </div>
          ) : artists.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#B3B3B3]">No artists found</div>
          ) : (
            artists.map((artist) => (
              <ArtistItem
                key={artist.id}
                artist={artist}
                onDelete={handleDelete}
                onUpdate={fetchArtists}
                isDeleting={deletingArtistId === artist.id}
                viewMode={viewMode}
              />
            ))
          )}
        </div>

        {/* Show artist form */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#181818] rounded-lg border border-[#282828] w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b border-[#282828]">
                <h2 className="text-xl font-semibold text-white">Add New Artist</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#B3B3B3] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ArtistForm setShowAddModal={setShowAddModal} fetchArtists={fetchArtists} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Artists
