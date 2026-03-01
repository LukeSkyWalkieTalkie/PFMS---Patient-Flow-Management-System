'use client'

import Sidebar from './Sidebar'

export default function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72">
        <Sidebar onClose={onClose} />
      </div>
    </div>
  )
}
