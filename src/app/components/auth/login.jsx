'use client'

import { useRef, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'

import Link from 'next/link'
import Loading from '@/app/loading'

// ログイン
const Login = () => {
    const { supabase } = useSupabase()
    const router = useRouter()
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [loading, setLoading] = useState(false)

    // 送信
    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)


        // ログイン処理
        // 認証はクライアントコンポーネントで行う
        const { error: signinError } = await supabase.auth.signInWithPassword({
            email: emailRef.current.value,
            password: passwordRef.current.value
        })

        if (signinError) {
            // alert(signinError.message)
            alert("メールアドレスまたはパスワードが間違っています。")
            setLoading(false)
            return
        }
        // トップページ遷移
        router.push("/")

        setLoading(false)
    }

    return (
        <div className="max-w-sm mx-auto bg-white p-4 drop-shadow-xl rounded">
            <form onSubmit={onSubmit}>
                <div className="mb-5">
                    <div className="text-sm mb-1">メールアドレス</div>
                    <input
                        className="w-full bg-gray-100 rounded border py-1 px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-main-orange"
                        ref={emailRef}
                        type="email"
                        id="email"
                        placeholder="メールアドレスを入力してください"
                        required
                    />
                </div>

                <div className="mb-5">
                    <div className="text-sm mb-1">パスワード</div>
                    <input
                        className="w-full bg-gray-100 rounded border py-1 px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-main-orange"
                        ref={passwordRef}
                        type="password"
                        id="password"
                        placeholder="パスワードを入力してください"
                        required
                    />
                </div>

                <div className="text-center mb-5">
                    {loading ? (
                        <Loading />
                    ) : (
                        <button
                            type="submit"
                            className="w-full text-white bg-main-orange hover:brightness-110 duration-300 rounded py-1 px-8"
                        >
                            ログイン
                        </button>
                    )}
                </div>
            </form>

            <div className="text-center">アカウント未登録の場合は
                <Link href="/auth/signup" className="cursor-pointer text-blue-600 hover:text-emerald-500 duration-300 font-bold">
                    サインアップ
                </Link>
            </div>
        </div>
    )
}

export default Login