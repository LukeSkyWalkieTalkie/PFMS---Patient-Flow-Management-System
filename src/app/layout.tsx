import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AppShell from '@/components/layout/AppShell'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PFMS - Patient Flow Management System',
  description: 'Clinic-scale patient flow management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
