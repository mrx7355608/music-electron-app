import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Loader2, X } from 'lucide-react'
import { Artist } from '../lib/types'
import ArtistItem from '@renderer/components/artists/ArtistItem'
import ArtistForm from '@renderer/components/artists/ArtistForm'

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deletingArtistId, setDeletingArtistId] = useState<string | null>(null)

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
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            Artists
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Artist
          </button>
        </div>

        {/* Show artists list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="flex items-center gap-2 text-purple-200">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading artists...</span>
              </div>
            </div>
          ) : artists.length === 0 ? (
            <div className="col-span-full text-center py-12 text-purple-200">No artists found</div>
          ) : (
            artists.map((artist) => (
              <ArtistItem
                key={artist.id}
                artist={artist}
                onDelete={handleDelete}
                onUpdate={fetchArtists}
                isDeleting={deletingArtistId === artist.id}
              />
            ))
          )}
        </div>

        {/* Show artist form */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl border border-purple-500/20 w-full max-w-2xl">
              <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
                <h2 className="text-xl font-semibold text-white">Add New Artist</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-purple-200 hover:text-white transition-colors"
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
