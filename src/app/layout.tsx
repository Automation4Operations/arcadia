import type { Metadata, Viewport } from 'next'
import './globals.css'
import AnimeFxEngine from '@/components/AnimeFxEngine'

export const metadata: Metadata = {
  title: 'Arcadia Games — Play Something Legendary',
  description: 'Arcadia Games is a fast, free browser game universe with instant play, curated categories, and a personal game Vault.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#09090d] text-white">
        <AnimeFxEngine />
        {children}
      </body>
    </html>
  )
}
