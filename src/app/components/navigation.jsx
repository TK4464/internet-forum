'use client'

import Link from 'next/link'
import useStore from '../../../store'
import Image from 'next/image'

// ナビゲーション
const Navigation = () => {
    const { user } = useStore()

    return (
        <header className="border-b bg-slate-100 sticky top-0 z-[9999] py-5 drop-shadow">
            <div className="container max-w-screen-xl mx-auto flex justify-between items-center">
                <Link href="/" className=" font-bold text-xl cursor-pointer">
                    <div className="relative w-32 h-8 sm:w-48 sm:h-12 ml-7">
                        <Image
                            src="/main-logo.png"
                            alt="Reboot"
                            width={200}
                            height={200}
                        />
                    </div>
                </Link>
                {/* ログイン状態の時とそうでない時で表示を分ける */}
                <div className="mr-6">
                    {user.id ? (
                        <div className="flex space-x-4 items-center">
                            {/* <p>{user.email}</p>
                            <div className="relative rounded-full w-11 h-11 overflow-hidden">
                                <Image
                                    src={user.avatar_url ? user.avatar_url : '/default.png'}
                                    alt="avatar"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <p>{user.name}aaaa</p> */}
                            <Link href="/auth/profile" className='p-3 bg-black text-white rounded-md hover:opacity-80 duration-500'>マイページ</Link>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link href="/auth/login" className='border bg-white text-black rounded-lg text-sm sm:text-base p-[6px] sm:p-2 hover:text-main-orange duration-300'>ログイン</Link>
                            <Link href="/auth/signup" className='bg-black text-white rounded-lg text-sm sm:text-base p-[6px] sm:p-2 hover:opacity-80 duration-300'>サインアップ</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navigation