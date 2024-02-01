'use client'

import { useRef, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'
import Link from 'next/link'
import Loading from '@/app/loading'

const SignUp = () => {
    const { supabase } = useSupabase()
    const router = useRouter()
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        setLoading(false)

        // supabaseサインアップ
        const { error: signupError } = await supabase.auth.signUp({
            email: emailRef.current.value,
            password: passwordRef.current.value
        })

        if (signupError) {
            // alert(signupError.message)
            alert("サインアップに失敗しました。入力されている名前、メールアドレス、パスワードが正しいか確認してください。")
            return
        }

        // プロフィールの名前を更新
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ name: nameRef.current.value })
            .eq("email", emailRef.current.value)

        if (updateError) {
            alert(updateError.message)
            setLoading(false)
            return
        }
        // トップページに遷移
        router.push("/")

        setLoading(false)
    }

    return (
        <div className='max-w-sm mx-auto bg-white p-4 drop-shadow-xl rounded'>
            <form onSubmit={onSubmit}>
                <div className="mb-5">
                    <div className="text-sm mb-1">名前</div>
                    <input
                        className="w-full bg-gray-100 rounded border py-1 px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-main-orange"
                        ref={nameRef}
                        type="text"
                        id="name"
                        placeholder="名前を入力してください"
                        required
                    />
                </div>

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
                            サインアップ
                        </button>
                    )}
                </div>
            </form>

            {/* ログイン用リンク */}
            <div className="text-center">アカウントをお持ちの場合は
                <Link href="/auth/login" className="cursor-pointer text-blue-600 hover:text-emerald-500 duration-300 font-bold">
                    ログイン
                </Link>
            </div>
        </div>
    )
}

export default SignUp