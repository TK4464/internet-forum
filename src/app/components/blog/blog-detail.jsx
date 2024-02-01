'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

import Link from 'next/link'
import useStore from '../../../../store'
import Image from 'next/image'
import Loading from '@/app/loading'
import BlogComment from './blog-comment'


const BlogDetail = ({ blog }) => {
    const { supabase } = useSupabase()
    const router = useRouter()
    const { user } = useStore()
    const [myBlog, setMyBlog] = useState(false)
    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState(false)


    useEffect(() => {
        // console.log(user); // ユーザーオブジェクトの変化を確認 結果、最初falseで返されていたものがundifinedで返されてtrueになりログインしていることになってしまうためログインチェックを修正

        // ログインチェック
        if (user && user.id && user.id != '') {
            setLogin(true)

            // 自分が投稿したブログチェック
            if (user.id === blog.profiles.id) {
                setMyBlog(true)
            }
        } else {
            setLogin(false)
        }
    }, [user])

    // ブログ削除
    const deleteBlog = async () => {
        setLoading(true)

        // supabaseブログ削除
        const { error } = await supabase.from('blogs').delete().eq('id', blog.id)

        if (error) {
            // alert(error.message)
            alert("掲示板を消去できませんでした。")
            setLoading(false)
            return
        }
        // ファイル名取得
        const fileName = blog.image_url.split('/').slice(-1)[0]

        // 画像を削除
        await supabase.storage.from('blogs').remove([`${user.id}/${fileName}`])

        // トップページに遷移
        router.push(`/`)
        router.refresh()

        setLoading(false)
    }



    // 自分が投稿したブログのみ、編集削除ボタンを表示
    const renderButton = () => {
        if (myBlog) {
            return (
                <div className="flex justify-end mb-10 bg-white p-4 drop-shadow-xl rounded-b">
                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link className='flex' href={`/blog/${blog.id}/edit`}>
                                <div className='mr-1'>編集</div>
                                <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:brightness-110" />
                            </Link>
                            <div className="cursor-pointer flex" onClick={() => deleteBlog()}>
                                <div className='mr-1'>削除</div>
                                <TrashIcon className="h-5 w-5 text-red-500 hover:brightness-110" />
                            </div>
                        </div>

                    )}
                </div>
            )
        }
    }


    return (
        <div className="max-w-screen-md mx-auto drop-shadow-xl">
            <div className="flex flex-col items-center justify-center mb-5">
                <div className="mb-1">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image
                        src={blog.profiles.avatar_url ? blog.profiles.avatar_url : '/default.png'}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                </div>
                <div className="font-bold text-gray-500">{blog.profiles.name}</div>
                <div className="text-sm text-gray-500">
                    {format(new Date(blog.created_at), 'yyyy/MM/dd HH:mm')}
                </div>
            </div>

            <div>
                <div className="text-center font-bold text-3xl mb-5">{blog.title}</div>
                <div>
                    <Image
                        src={blog.image_url}
                        className="rounded-t aspect-video object-cover"
                        alt="image"
                        width={1024}
                        height={576}
                    />
                </div>
                <div className="bg-white p-4 border-b border-gray-200 border-solid drop-shadow-xl rounded-b leading-relaxed break-words whitespace-pre-wrap">{blog.content}</div>
            </div>

            {renderButton()}
            
            <BlogComment blog={blog} login={login} />
        </div>
    )
}

export default BlogDetail