import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, Table, FileText } from 'lucide-react'
import { Release } from '../lib/types'
import { useNavigate } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { unparse } from 'papaparse'
import * as XLSX from 'xlsx'

const ITEMS_PER_PAGE = 10

const Dashboard = () => {
  const navigate = useNavigate()
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({
    artist_name: '',
    label: '',
    title: '',
    date: '',
    month: '',
    year: '',
    genre: '',
    bundle: '',
    status: '',
    recently_added: false,
    new_artist: false
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [isExportingXlsx, setIsExportingXlsx] = useState(false)

  const fetchReleases = async () => {
    setLoading(true)
    try {
      let query = supabase.from('releases').select(
        `
          *,
          artist:artist_id!inner(id, real_name),
          bundle:bundle_id(name),
          tracks:tracks!release_id(title)
        `,
        {
          count: 'exact'
        }
      )

      // Apply search
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,label.ilike.%${searchTerm}%`)
      }

      // Apply filters
      if (filters.artist_name) {
        query = query.ilike('artist.real_name', `%${filters.artist_name}%`)
      }
      if (filters.label) {
        query = query.ilike('label', `%${filters.label}%`)
      }
      if (filters.title) {
        query = query.ilike('title', `%${filters.title}%`)
      }
      if (filters.date) {
        query = query.eq('release_date', String(filters.date).padStart(2, '0'))
      }
      if (filters.month) {
        console.log(filters.month)
        query = query.eq('release_month', filters.month)
      }
      if (filters.year) {
        query = query.eq('release_year', filters.year)
      }
      if (filters.genre) {
        query = query.eq('genre', filters.genre)
      }
      if (filters.bundle) {
        query = query.ilike('bundle.name', `%${filters.bundle}%`)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.recently_added) {
        query = query.order('created_at', { ascending: false })
      }
      if (filters.new_artist) {
        query = query.order('artist.real_name', { ascending: true })
      }

      // Add pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE
      const to = from + ITEMS_PER_PAGE - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setReleases(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching releases:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReleases()
  }, [currentPage, searchTerm, filters])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  const exportAsCsv = async () => {
    setIsExportingCsv(true)
    try {
      // Create and download CSV file
      const flatData = releases.map((release) => {
        return {
          id: release.id,
          created_at: new Date(release.created_at).toLocaleDateString(),
          title: release.tracks?.map((track) => track.title).join('\n'),
          genre: release.genre,
          original_producer: release.original_producer,
          bundle_name: release.bundle?.name,
          label: release.label,
          status: release.status,
          artist_id: release.artist_id,
          release_year: release.release_year,
          release_month: release.release_month,
          release_date: release.release_date,
          artist_name: release.artist.real_name
        }
      })
      const csv = unparse(flatData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, 'releases.csv')
    } catch (error) {
      console.error('CSV Export error:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExportingCsv(false)
    }
  }

  const exportAsXlsx = async () => {
    setIsExportingXlsx(true)
    try {
      // Create an excel sheet
      const flatData = releases.map((release) => {
        return {
          id: release.id,
          created_at: new Date(release.created_at).toLocaleDateString(),
          title: release.tracks?.map((track) => track.title).join('\n'),
          genre: release.genre,
          original_producer: release.original_producer,
          bundle_name: release.bundle?.name,
          label: release.label,
          status: release.status,
          artist_id: release.artist_id,
          release_year: release.release_year,
          release_month: release.release_month,
          release_date: release.release_date,
          artist_name: release.artist.real_name
        }
      })
      const worksheet = XLSX.utils.json_to_sheet(flatData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Releases')
      const xlsxBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      })

      // Download file
      const blob = new Blob([xlsxBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      saveAs(blob, 'releases.xlsx')
    } catch (error) {
      console.error('XLSX Export error:', error)
      alert('Failed to export XLSX. Please try again.')
    } finally {
      setIsExportingXlsx(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Releases Dashboard</h1>
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => exportAsCsv()}
                disabled={isExportingCsv}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181818] border border-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                {isExportingCsv ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <span>CSV</span>
                )}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => exportAsXlsx()}
                disabled={isExportingXlsx}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181818] border border-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Table className="w-4 h-4" />
                {isExportingXlsx ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <span>XLSX</span>
                )}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
              <input
                type="text"
                placeholder="Search releases..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-[#181818] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-lg bg-[#181818] border border-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 rounded-lg bg-[#181818] border border-[#282828]">
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Artist Name</label>
              <input
                type="text"
                value={filters.artist_name}
                onChange={(e) => handleFilterChange('artist_name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Label</label>
              <input
                type="text"
                value={filters.label}
                onChange={(e) => handleFilterChange('label', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Release Title</label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Date</label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors"
              >
                <option value="">Select Day</option>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors"
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, '0')
                  return (
                    <option key={month} value={month}>
                      {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors"
              >
                <option value="">Select Genre</option>
                <option value="Pop">Pop</option>
                <option value="K-Pop">K-Pop</option>
                <option value="Rap">Rap</option>
                <option value="Rock">Rock</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Electronic">Electronic</option>
                <option value="Classical">Classical</option>
                <option value="Indie">Indie</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#121212] border border-[#282828] text-white focus:outline-none focus:border-[#1DB954] transition-colors"
              >
                <option value="">Select Status</option>
                <option value="online">Online</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2 text-[#B3B3B3]">
                <input
                  type="checkbox"
                  checked={filters.recently_added}
                  onChange={(e) => handleFilterChange('recently_added', e.target.checked)}
                  className="rounded border-[#282828] text-[#1DB954] focus:ring-[#1DB954]"
                />
                Recently Added
              </label>
              <label className="flex items-center gap-2 text-[#B3B3B3]">
                <input
                  type="checkbox"
                  checked={filters.new_artist}
                  onChange={(e) => handleFilterChange('new_artist', e.target.checked)}
                  className="rounded border-[#282828] text-[#1DB954] focus:ring-[#1DB954]"
                />
                New Artist
              </label>
            </div>
          </div>
        )}

        <div className="bg-[#181818] rounded-lg border border-[#282828] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#121212]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">
                    Artist Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">Label</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">
                    Distributor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">
                    Release Title(s)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">
                    Release Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">Genre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">Bundle</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">
                    Original Producer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#B3B3B3]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center gap-2 text-[#B3B3B3]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading releases...</span>
                      </div>
                    </td>
                  </tr>
                ) : releases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-[#B3B3B3]">
                      No releases found
                    </td>
                  </tr>
                ) : (
                  releases.map((release) => (
                    <tr key={release.id} className="hover:bg-[#282828] transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/artists/${release.artist.id}`)}
                          className="hover:cursor-pointer text-white hover:text-[#1DB954] transition-colors"
                        >
                          {release.artist.real_name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{release.label}</td>
                      <td className="px-6 py-4 text-sm text-white">{release.distributor}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        <div className="space-y-2">
                          {release.tracks?.map((track) => (
                            <div key={track.id} className="text-white">
                              {track.title},
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {new Date(release.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{release.genre}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        {release.bundle?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{release.original_producer}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="font-medium text-white">
                          {release.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-[#B3B3B3]">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} releases
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#181818] border border-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#181818] border border-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#282828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
