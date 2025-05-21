import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, Loader2 } from 'lucide-react'
import { Release } from '../lib/types'

const Bundles: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [bundleName, setBundleName] = useState('')
  const [releases, setReleases] = useState<Release[]>([])
  const [selectedReleases, setSelectedReleases] = useState<Release[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [isLoadingReleases, setIsLoadingReleases] = useState(true)
  const [bundles, setBundles] = useState<any[]>([])
  const [isLoadingBundles, setIsLoadingBundles] = useState(true)

  const fetchReleases = async () => {
    setIsLoadingReleases(true)
    try {
      const { data, error } = await supabase
        .from('releases')
        .select('*, artist:artist_id!inner(id, real_name)')
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
        .select('*, releases(*)')
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
        .insert({ name: bundleName })
        .select()
        .single()

      if (error) throw error
      const bundleId = data.id
      const promises = selectedReleases.map((r) =>
        supabase.from('releases').update({ bundle_id: bundleId }).eq('id', r.id)
      )
      const results = await Promise.all(promises)
      console.log(results)

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
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            Bundles
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white hover:cursor-pointer hover:bg-slate-800/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <Plus className="w-4 h-4" />
            <span>Create Bundle</span>
          </button>
        </div>

        {/* Bundles List */}
        <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 overflow-hidden">
          {isLoadingBundles ? (
            <div className="p-8 text-center">
              <div className="flex justify-center items-center gap-2 text-purple-200">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading bundles...</span>
              </div>
            </div>
          ) : bundles.length === 0 ? (
            <div className="p-8 text-center text-purple-200">No bundles found</div>
          ) : (
            <div className="divide-y divide-purple-500/10">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white">{bundle.name}</h3>
                      <p className="text-sm text-purple-200">
                        {bundle.releases?.length || 0} releases
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-xl border border-purple-500/20 w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Create New Bundle</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Bundle Name
                  </label>
                  <input
                    type="text"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter bundle name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Select Releases
                  </label>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {isLoadingReleases ? (
                      <div className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2 text-purple-200">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Loading releases...</span>
                        </div>
                      </div>
                    ) : releases.length === 0 ? (
                      <div className="p-4 text-center text-purple-200">No releases found</div>
                    ) : (
                      releases.map((release) => {
                        const isSelected = selectedReleases.some((r) => r.id === release.id)
                        return (
                          <div
                            key={release.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-purple-500/20 hover:bg-slate-800/70 transition-colors"
                          >
                            <div>
                              <div className="text-white font-medium">{release.title}</div>
                              <div className="text-sm text-purple-200">
                                {release.artist.real_name} • {release.label}
                              </div>
                            </div>
                            <button
                              onClick={() => toggleReleaseSelection(release)}
                              className={`p-2 rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-slate-700 text-purple-200 hover:bg-slate-600'
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
                    className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateBundle}
                    disabled={!bundleName || selectedReleases.length === 0 || isCreating}
                    className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        )}
      </div>
    </div>
  )
}

export default Bundles
