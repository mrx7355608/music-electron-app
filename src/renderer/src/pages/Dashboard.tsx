import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Table,
  FileText,
  ChevronDown
} from 'lucide-react'
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
  const [showExportMenu, setShowExportMenu] = useState(false)

  const fetchReleases = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('releases')
        .select('*, artist:artist_id!inner(id, real_name), bundle:bundle_id(name)', {
          count: 'exact'
        })

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
        console.log(filters.date)
        query = query.eq('release_date', filters.date)
      }
      if (filters.month) {
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
          title: release.title,
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
          title: release.title,
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
    <div className="p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            Releases Dashboard
          </h1>
          <div className="flex gap-4">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white hover:cursor-pointer hover:bg-slate-800/70 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <FileText className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800/90 border border-purple-500/20 shadow-lg z-10">
                  <button
                    onClick={() => {
                      exportAsCsv()
                      setShowExportMenu(false)
                    }}
                    disabled={isExportingCsv}
                    className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileText className="w-4 h-4" />
                    {isExportingCsv ? (
                      <>
                        <div className="w-4 h-4 border-2 border-purple-200 border-t-transparent rounded-full animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <span>Export as CSV</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      exportAsXlsx()
                      setShowExportMenu(false)
                    }}
                    disabled={isExportingXlsx}
                    className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Table className="w-4 h-4" />
                    {isExportingXlsx ? (
                      <>
                        <div className="w-4 h-4 border-2 border-purple-200 border-t-transparent rounded-full animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <span>Export as XLSX</span>
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search releases..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-xl bg-slate-800/50 border border-purple-500/20 text-white hover:bg-slate-800/70 transition-all duration-200 flex items-center gap-2"
            >
              <Filter className="w-5 h-5 text-purple-400" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 rounded-xl bg-slate-800/30 border border-purple-500/20">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Artist Name</label>
              <input
                type="text"
                value={filters.artist_name}
                onChange={(e) => handleFilterChange('artist_name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Label</label>
              <input
                type="text"
                value={filters.label}
                onChange={(e) => handleFilterChange('label', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Release Title
              </label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Date</label>
              <select
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
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
              <label className="block text-sm font-medium text-purple-200 mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
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
              <label className="block text-sm font-medium text-purple-200 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
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
              <label className="block text-sm font-medium text-purple-200 mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
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
              <label className="block text-sm font-medium text-purple-200 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white"
              >
                <option value="">Select Status</option>
                <option value="online">Online</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2 text-purple-200">
                <input
                  type="checkbox"
                  checked={filters.recently_added}
                  onChange={(e) => handleFilterChange('recently_added', e.target.checked)}
                  className="rounded border-purple-500/20 text-purple-500 focus:ring-purple-500"
                />
                Recently Added
              </label>
              <label className="flex items-center gap-2 text-purple-200">
                <input
                  type="checkbox"
                  checked={filters.new_artist}
                  onChange={(e) => handleFilterChange('new_artist', e.target.checked)}
                  className="rounded border-purple-500/20 text-purple-500 focus:ring-purple-500"
                />
                New Artist
              </label>
            </div>
          </div>
        )}

        <div className="bg-slate-800/30 rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Artist Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">Label</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Distributor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Release Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Release Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">Genre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Bundle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Original Producer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-purple-200">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center gap-2 text-purple-200">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Loading releases...</span>
                      </div>
                    </td>
                  </tr>
                ) : releases.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center text-purple-200">
                      No releases found
                    </td>
                  </tr>
                ) : (
                  releases.map((release) => (
                    <tr key={release.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/artists/${release.artist.id}`)}
                          className="text-white hover:underline hover:cursor-pointer"
                        >
                          {release.artist.real_name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{release.label}</td>
                      <td className="px-6 py-4 text-sm text-white">{release.distributor}</td>
                      <td className="px-6 py-4 text-sm text-white">{release.title}</td>
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
            <div className="text-sm text-purple-200">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} releases
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800/70 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-slate-800/50 border border-purple-500/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800/70 transition-all duration-200"
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
