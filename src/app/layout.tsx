import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'your-tax-agent — AI Tax Filing for Tech Workers',
  description: 'Stop overpaying taxes. AI finds what your CPA missed. RSU basis correction, MFJ optimization, 30 IRS compliance checks.',
  openGraph: {
    title: 'your-tax-agent',
    description: 'AI-powered tax filing that saved $17K+ on a real return',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
