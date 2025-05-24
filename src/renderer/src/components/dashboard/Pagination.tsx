import { Dispatch, SetStateAction } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 10

export default function Pagination({
  currentPage,
  totalCount,
  totalPages,
  setCurrentPage
}: {
  currentPage: number
  totalCount: number
  totalPages: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}) {
  return (
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
  )
}
