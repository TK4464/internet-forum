'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import useStore from '../../../../store'

const BlogNewButton = () => {
    const { user } = useStore()
    const [login, setLogin] = useState(false)


    // ログインしている人のみ表示
    const renderButton = () => {

        if (login) {
            return (
                <div className="mb-5 flex justify-center">
                    <Link href="blog/new">
                        <div className="text-white bg-main-orange duration-500 hover:opacity-80 rounded-md p-4 text-base drop-shadow-lg">
                            新規投稿
                        </div>
                    </Link>
                </div>
            )
        }
    }

    useEffect(() => {
        if (user.id) {
            setLogin(true)
        }
    }, [user])

    return <>{renderButton()}</>

}

export default BlogNewButton