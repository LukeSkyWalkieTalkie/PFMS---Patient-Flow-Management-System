'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import MobileNav from './MobileNav'
import NameModal from '@/components/auth/NameModal'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <NameModal />
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopNav onMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
