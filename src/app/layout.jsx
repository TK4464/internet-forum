import { Inter } from 'next/font/google'
import './globals.css'
import 'server-only'
import Navigation from './components/navigation'
import { createClient } from '../../utils/supabase-server'
import SupabaseProvider from './components/supabase-provider'
import SupabaseListener from './components/supabase-listener'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '就活掲示板 Reboot',
  description: 'エンジニアを目指す再進学者のための就活掲示板 Rebootです',
}

// キャッシュをしない
export const revalidate = 0

const RootLayout = async ({ children }) => {
  const supabase = createClient()

  // セッション情報取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="ja" className='overflow-x-hidden'>
      <body className={inter.className}>
        <SupabaseProvider>
          <SupabaseListener serverAccessToken={session?.access_token} />

          <div className="flex flex-col min-h-screen">
            <Navigation />

            <main className="flex-1 container max-w-screen-xl mx-auto px-5 py-10">{children}</main>

            <footer className="py-20 bg-slate-100">
              <div className="text-center text-sm text-black">
                &copy; Reboot All rights reserved.
              </div>
            </footer>
          </div>
        </SupabaseProvider>
      </body>
    </html>
  )
}

export default RootLayout