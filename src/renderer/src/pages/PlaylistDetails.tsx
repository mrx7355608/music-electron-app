import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Music, Clock, Heart, Users, Plus, X, Search, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Playlist {
  id: string
  title: string
  color_code: string
  type: string
  genre: string
  promo_tag: string
  last_updated: string
  user_name: string
  total_hours: number
  total_songs: number
  our_songs: number
  likes: number
}

interface Song {
  id: string
  title: string
  duration: string
  genre: string
  created_at: string
  artist: {
    real_name: string
  }
}

interface PlaylistTrack {
  id: string
  playlist_id: string
  track_id: string
  created_at: string
  track: Song
}

const PlaylistDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loadingSongs, setLoadingSongs] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playlistTracks, setPlaylistTracks] = useState<PlaylistTrack[]>([])
  const [loadingPlaylistTracks, setLoadingPlaylistTracks] = useState(false)
  const [loadingAddSongs, setLoadingAddSongs] = useState(false)
  const [removingTrackId, setRemovingTrackId] = useState<string | null>(null)

  useEffect(() => {
    fetchPlaylistDetails()
    fetchPlaylistTracks()
  }, [id])

  useEffect(() => {
    if (isAddSongsModalOpen) {
      fetchSongs()
    }
  }, [isAddSongsModalOpen])

  const fetchPlaylistDetails = async () => {
    try {
      const { data, error } = await supabase.from('playlists').select('*').eq('id', id).single()

      if (error) throw error

      // Add mock data for missing fields
      setPlaylist({
        ...data,
        total_hours: 2.5,
        likes: 1234
      })
    } catch (error) {
      console.error('Error fetching playlist details:', error)
      setError('Failed to load playlist details')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlaylistTracks = async () => {
    setLoadingPlaylistTracks(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('playlists_tracks')
        .select(
          `
          *,
          track:tracks(*, artist:artist_id(real_name))
        `
        )
        .eq('playlist_id', id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPlaylistTracks(data || [])
    } catch (error) {
      console.error('Error fetching playlist tracks:', error)
      setError('Failed to load playlist tracks')
    } finally {
      setLoadingPlaylistTracks(false)
    }
  }

  const fetchSongs = async () => {
    setLoadingSongs(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*, artist:artist_id(real_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSongs(data || [])
    } catch (error) {
      console.error('Error fetching songs:', error)
      setError('Failed to load songs')
    } finally {
      setLoadingSongs(false)
    }
  }

  const handleAddSongs = async () => {
    if (selectedSongs.length === 0) return

    setLoadingAddSongs(true)
    setError(null)
    try {
      const playlistData = selectedSongs.map((songId) => ({
        playlist_id: id,
        track_id: songId
      }))
      await supabase.from('playlists_tracks').insert(playlistData)

      const { error: updateError } = await supabase
        .from('playlists')
        .update({
          total_songs: playlist?.total_songs || 0 + selectedSongs.length,
          our_songs: playlist?.our_songs || 0 + selectedSongs.length
        })
        .eq('id', playlist?.id)
      if (updateError) throw updateError

      // After successful addition, refresh both playlist details and tracks
      await Promise.all([fetchPlaylistDetails(), fetchPlaylistTracks()])

      setIsAddSongsModalOpen(false)
      setSelectedSongs([])
    } catch (error) {
      console.error('Error adding songs:', error)
      setError('Failed to add songs to playlist')
    } finally {
      setLoadingAddSongs(false)
    }
  }

  const handleRemoveTrack = async (trackId: string) => {
    setRemovingTrackId(trackId)
    setError(null)
    try {
      const { error } = await supabase
        .from('playlists_tracks')
        .delete()
        .eq('playlist_id', id)
        .eq('track_id', trackId)

      if (error) throw error

      console.log(playlist?.id)
      const { error: updateError } = await supabase
        .from('playlists')
        .update({
          total_songs: playlist?.total_songs || 0 - 1,
          our_songs: playlist?.our_songs || 0 - 1
        })
        .eq('id', playlist?.id)
      if (updateError) throw updateError

      // After successful removal, refresh both playlist details and tracks
      await Promise.all([fetchPlaylistDetails(), fetchPlaylistTracks()])
    } catch (error) {
      console.error('Error removing track:', error)
      setError('Failed to remove track from playlist')
    } finally {
      setRemovingTrackId(null)
    }
  }

  const toggleSongSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    )
  }

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.real_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DB954]"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Playlist not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#B3B3B3] hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Playlists
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        {/* Playlist Info */}
        <div className="flex items-start gap-8 mb-8">
          <div
            className="w-48 h-48 rounded-lg shadow-lg"
            style={{ backgroundColor: playlist.color_code }}
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">{playlist.title}</h1>
            <div className="flex items-center gap-4 text-[#B3B3B3] mb-6">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                <span>{playlist.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{playlist.total_hours} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>{playlist.likes} likes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{playlist.our_songs} our songs</span>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-[#282828] text-[#B3B3B3] rounded-full">
                {playlist.genre}
              </span>
              <span className="px-3 py-1 bg-[#282828] text-[#B3B3B3] rounded-full">
                {playlist.promo_tag}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#181818] p-6 rounded-lg">
            <h3 className="text-[#B3B3B3] text-sm mb-2">Total Songs</h3>
            <p className="text-2xl font-bold text-white">{playlist.total_songs}</p>
          </div>
          <div className="bg-[#181818] p-6 rounded-lg">
            <h3 className="text-[#B3B3B3] text-sm mb-2">Our Songs</h3>
            <p className="text-2xl font-bold text-white">{playlist.our_songs}</p>
          </div>
          <div className="bg-[#181818] p-6 rounded-lg">
            <h3 className="text-[#B3B3B3] text-sm mb-2">Total Hours</h3>
            <p className="text-2xl font-bold text-white">{playlist.total_hours}</p>
          </div>
          <div className="bg-[#181818] p-6 rounded-lg">
            <h3 className="text-[#B3B3B3] text-sm mb-2">Last Updated</h3>
            <p className="text-2xl font-bold text-white">
              {new Date(playlist.last_updated).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Playlist Content */}
        <div className="bg-[#181818] rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Playlist Content</h2>
            <button
              onClick={() => setIsAddSongsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Songs
            </button>
          </div>

          {loadingPlaylistTracks ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 text-[#1DB954] animate-spin" />
            </div>
          ) : playlistTracks.length === 0 ? (
            <div className="text-center text-[#B3B3B3] py-8">
              No songs in this playlist yet. Click &quot;Add Songs&quot; to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {playlistTracks.map((playlistTrack) => (
                <div
                  key={playlistTrack.id}
                  className="flex items-center justify-between p-4 bg-[#282828] rounded-lg hover:bg-[#383838] transition-colors"
                >
                  <div>
                    <h3 className="text-white font-medium">{playlistTrack.track.title}</h3>
                    <p className="text-[#B3B3B3] text-sm">{playlistTrack.track.artist.real_name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#B3B3B3] text-sm">
                      {Math.floor(parseInt(playlistTrack.track.duration) / 60)}:
                      {(parseInt(playlistTrack.track.duration) % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[#B3B3B3] text-sm">{playlistTrack.track.genre}</span>
                    <button
                      onClick={() => handleRemoveTrack(playlistTrack.track_id)}
                      className="text-[#B3B3B3] hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={removingTrackId === playlistTrack.track_id}
                    >
                      {removingTrackId === playlistTrack.track_id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Songs Modal */}
        {isAddSongsModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#181818] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-6 border-b border-[#282828] flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Add Songs</h2>
                <button
                  onClick={() => setIsAddSongsModalOpen(false)}
                  className="text-[#B3B3B3] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 border-b border-[#282828]">
                <div className="relative">
                  <Search className="w-5 h-5 text-[#B3B3B3] absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#282828] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingSongs ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 text-[#1DB954] animate-spin" />
                  </div>
                ) : filteredSongs.length === 0 ? (
                  <div className="text-center text-[#B3B3B3] py-8">
                    {searchQuery ? 'No songs found matching your search' : 'No songs available'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredSongs.map((song) => (
                      <div
                        key={song.id}
                        onClick={() => toggleSongSelection(song.id)}
                        className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedSongs.includes(song.id)
                            ? 'bg-[#1DB954]/20 border border-[#1DB954]'
                            : 'bg-[#282828] hover:bg-[#383838]'
                        }`}
                      >
                        <div>
                          <h3 className="text-white font-medium">{song.title}</h3>
                          <p className="text-[#B3B3B3] text-sm">{song.artist.real_name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[#B3B3B3] text-sm">
                            {Math.floor(parseInt(song.duration) / 60)}:
                            {(parseInt(song.duration) % 60).toString().padStart(2, '0')}
                          </span>
                          <span className="text-[#B3B3B3] text-sm">{song.genre}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-[#282828] flex justify-end gap-4">
                <button
                  onClick={() => setIsAddSongsModalOpen(false)}
                  className="px-4 py-2 text-[#B3B3B3] hover:text-white transition-colors"
                  disabled={loadingAddSongs}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSongs}
                  disabled={selectedSongs.length === 0 || loadingAddSongs}
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingAddSongs ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding Songs...
                    </>
                  ) : (
                    `Add Selected Songs (${selectedSongs.length})`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistDetails
