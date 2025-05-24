import { Dispatch, SetStateAction } from 'react'

type IFiltersData = {
  artist_name: string
  label: string
  title: string
  date: string
  month: string
  year: string
  genre: string
  bundle: string
  status: string
  recently_added: boolean
  new_artist: boolean
}

export default function Filters({
  filters,
  setFilters,
  setCurrentPage
}: {
  filters: IFiltersData
  setFilters: Dispatch<SetStateAction<IFiltersData>>
  setCurrentPage: (page: number) => void
}) {
  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }
  return (
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
  )
}
