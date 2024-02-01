import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'


// ミドルウェア
export const middleware = async (req) => {
    const res = NextResponse.next()

    const supabase = createMiddlewareSupabaseClient ({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // 未認証状態で新規投稿画面に遷移した場合は、ログイン画面にリダイレクト
    if (!session && req.nextUrl.pathname.startsWith('/blog/new')) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/auth/login'
        return NextResponse.redirect(redirectUrl)
    }

    return res
}