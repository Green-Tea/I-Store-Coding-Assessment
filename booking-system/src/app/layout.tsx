// src/app/layout.tsx
import type { Metadata } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import BootstrapClient from '@/components/BootstrapClient'

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
      <body className="m-0 bg-light">
        <BootstrapClient />
        <Navbar />
        <main className="container-fluid px-3 bg-light min-vh-100">
          {children}
        </main>
      </body>
    </html>
  )
}