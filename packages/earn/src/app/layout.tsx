import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Superteam Earn - Sponsor Dashboard',
  description: 'AI-Powered GitHub Auto-Review System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

