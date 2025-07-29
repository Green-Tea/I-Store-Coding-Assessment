import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'Hotel Booking System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body style={{ margin: 0 }}>
        <Navbar />
        <main style={{ padding: '0 1rem' }}>
          {children}
        </main>
      </body>
    </html>
  )
}