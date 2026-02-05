import { Playfair_Display, Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'YemenStay - Experience Yemen\'s Timeless Beauty',
  description: 'Book unique stays in Yemen\'s most beautiful destinations. Luxury hotels in Sana\'a, Aden, Taiz and more.',
  keywords: 'hotel, booking, yemen, sanaa, taiz, aden, accommodation, luxury, travel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
          <AuthProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
