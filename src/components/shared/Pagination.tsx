'use client'

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | string)[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>
      {pages.map((page, i) =>
        typeof page === 'string' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              page === currentPage
                ? 'bg-clinical-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}
