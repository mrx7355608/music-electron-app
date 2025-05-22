import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, Loader2 } from 'lucide-react'
import { Release, Bundle } from '../lib/types'

const Bundles: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [bundleName, setBundleName] = useState('')
  const [releases, setReleases] = useState<Release[]>([])
  const [selectedReleases, setSelectedReleases] = useState<Release[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoadingReleases, setIsLoadingReleases] = useState(true)
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [isLoadingBundles, setIsLoadingBundles] = useState(true)

  const fetchReleases = async () => {
    setIsLoadingReleases(true)
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*, artist:artist_id!inner(id, real_name)')
        .is('bundle_id', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReleases(data || [])
    } catch (error) {
      console.error('Error fetching releases:', error)
    } finally {
      setIsLoadingReleases(false)
    }
  }

  const fetchBundles = async () => {
    setIsLoadingBundles(true)
    try {
      const { data, error } = await supabase
        .from('bundles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBundles(data || [])
    } catch (error) {
      console.error('Error fetching bundles:', error)
    } finally {
      setIsLoadingBundles(false)
    }
  }

  useEffect(() => {
    fetchReleases()
    fetchBundles()
  }, [])

  const handleCreateBundle = async () => {
    setIsCreating(true)
    try {
      const { data, error } = await supabase
        .from('bundles')
        .insert({ name: bundleName, total_releases: selectedReleases.length })
        .select()
        .single()

      if (error) throw error

      // Update releases with bundle_ide
      const bundleId = data.id
      const promises = selectedReleases.map((r) =>
        supabase.from('releases').update({ bundle_id: bundleId }).eq('id', r.id)
      )
      await Promise.all(promises)

      setShowModal(false)
      setBundleName('')
      setSelectedReleases([])
      fetchBundles() // Refresh bundles list after creating new bundle
    } catch (error) {
      console.error('Error creating bundle:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleReleaseSelection = (release: Release) => {
    setSelectedReleases((prev) => {
      const isSelected = prev.some((r) => r.id === release.id)
      if (isSelected) {
        return prev.filter((r) => r.id !== release.id)
      } else {
        return [...prev, release]
      }
    })
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Bundles</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Bundle</span>
          </button>
        </div>

        <div className="bg-[#181818] rounded-lg border border-[#282828] overflow-hidden">
          {isLoadingBundles ? (
            <div className="p-8 text-center">
              <div className="flex justify-center items-center gap-2 text-[#B3B3B3]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading bundles...</span>
              </div>
            </div>
          ) : bundles.length === 0 ? (
            <div className="p-8 text-center text-[#B3B3B3]">No bundles found</div>
          ) : (
            <div className="divide-y divide-[#282828]">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="p-4 hover:bg-[#282828] transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{bundle.name}</h3>
                      <p className="text-sm text-[#B3B3B3]">{bundle.total_releases} releases</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-[#181818] rounded-lg border border-[#282828] w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-white">Create New Bundle</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                      Bundle Name
                    </label>
                    <input
                      type="text"
                      value={bundleName}
                      onChange={(e) => setBundleName(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
                      placeholder="Enter bundle name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B3B3B3] mb-2">
                      Select Releases
                    </label>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {isLoadingReleases ? (
                        <div className="p-4 text-center">
                          <div className="flex justify-center items-center gap-2 text-[#B3B3B3]">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading releases...</span>
                          </div>
                        </div>
                      ) : releases.length === 0 ? (
                        <div className="p-4 text-center text-[#B3B3B3]">No releases found</div>
                      ) : (
                        releases.map((release) => {
                          const isSelected = selectedReleases.some((r) => r.id === release.id)
                          return (
                            <div
                              key={release.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-[#121212] border border-[#282828] hover:bg-[#282828] transition-colors"
                            >
                              <div>
                                <div className="text-white font-medium">{release.title}</div>
                                <div className="text-sm text-[#B3B3B3]">
                                  {release.artist.real_name} • {release.label}
                                </div>
                              </div>
                              <button
                                onClick={() => toggleReleaseSelection(release)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isSelected
                                    ? 'bg-[#1DB954] text-white'
                                    : 'bg-[#282828] text-[#B3B3B3] hover:bg-[#404040]'
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowModal(false)}
                      disabled={isCreating}
                      className="px-4 py-2 rounded-lg bg-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#404040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateBundle}
                      disabled={!bundleName || selectedReleases.length === 0 || isCreating}
                      className="px-4 py-2 rounded-lg bg-[#1DB954] text-white hover:bg-[#1ed760] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Bundle</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Bundles
