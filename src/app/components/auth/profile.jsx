'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../supabase-provider'
import { v4 as uuidv4 } from 'uuid'

import useStore from '../../../../store'
import Image from 'next/image'
import Loading from '@/app/loading'
import { format } from "date-fns";
import Link from 'next/link'
import MyPagenation from '../pagination'
// プロフィール
const Profile = () => {
    const { supabase } = useSupabase()
    const router = useRouter()
    const { user } = useStore()
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const [email, setEmail] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false)
    // useState フックを使用して blogsData 状態を初期化
    const [blogsData, setBlogsData] = useState([]);
    const [offset, setOffset] = useState(0)
    const perPage = 3 // 1ページのコメント数


    // 画像アップロード
    const onUploadImage = useCallback(e => {
        const files = e.target.files

        if (!files || files?.length == 0) {
            return
        }
        setAvatar(files[0])
    }, [])

    // supabaseからプロフィール情報を取得
    useEffect(() => {
        if (user.id) {
            // プロフィール取得
            // ログインユーザーと一致するデータを取得
            const getProfile = async () => {
                const { data: userData, error } = await supabase
                    .from("profiles")
                    .select()
                    .eq("id", user.id)
                    .single()

                // プロフィール取得失敗
                if (error) {
                    // alert(error.message)
                    alert("プロフィール取得に失敗しました。")
                    return
                }

                // 名前設定
                if (userData.name) {
                    nameRef.current.value = userData.name
                }

                //email設定
                if (userData.email) {
                    emailRef.current.value = userData.email
                }

                // 画像URL設定
                if (userData.avatar_url) {
                    setAvatarUrl(userData.avatar_url)
                }
            }

            const getBlogList = async () => {
                const { data: blogsData, error } = await supabase
                    .from("blogs")
                    .select("id, title, created_at, image_url")
                    .eq("profile_id", user.id)
                    .order("created_at", { ascending: false }); // 作成日順に並び替え

                // リストが見つからない場合
                if (error) {
                    console.error('ブログデータの取得に失敗しました:', error);
                    return;
                }
                // データ取得後に状態を更新
                setBlogsData(blogsData)
            }

            getProfile()
            setEmail(user.email)
            getBlogList()
        }
    }, [user])

    // 送信
    const onSubmit = async e => {
        e.preventDefault()
        setLoading(true)

        if (user.id) {
            let avatar_url = avatarUrl

            // 画像をアップロードした場合
            if (avatar) {
                // supabaseストレージに画像アップロード
                const {
                    data: storageData,
                    error: storageError
                } = await supabase.storage
                    .from("profile")
                    .upload(`${user.id}/${uuidv4()}`, avatar)

                if (storageError) {
                    alert(storageError.message)
                    setLoading(false)
                    return
                }

                if (avatar_url) {
                    const fileName = avatar_url.split("/").slice(-1)[0]

                    // 古い画像を削除
                    await supabase.storage.from("profile").remove([`${user.id}/${fileName}`])
                }

                // 画像のURLを取得
                const { data: urlData } = await supabase.storage
                    .from("profile")
                    .getPublicUrl(storageData.path)

                avatar_url = urlData.publicUrl
            }

            // プロフィールアップデート
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    name: nameRef.current.value,
                    email: emailRef.current.value,
                    avatar_url: avatar_url
                })
                .eq("id", user.id)

            if (updateError) {
                alert(updateError.message)
                setLoading(false)
                return
            }
            // プロフィールのアップデートに成功した時にトップページ遷移
            router.push("/")
            router.refresh()
        }
        setLoading(false)
    }


    // ログアウト
    const logout = async () => {
        setLoadingLogout(true)
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
        setLoadingLogout(false)
    }

    const paginationHandler = ({ selected }) => {
        setOffset(selected * perPage)
    }

    return (
        <div>
            <div className='max-w-sm mx-auto bg-white p-4 drop-shadow-xl rounded'>
                <form onSubmit={onSubmit}>
                    <div className="mb-5">
                        <div className="flex justify-center mb-5">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden">
                                <Image
                                    src={avatarUrl ? avatarUrl : "/default.png"}
                                    alt="avatar"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </div>
                        <input type="file" id="thumbnail" onChange={onUploadImage} />
                    </div>

                    <div className="mb-5">
                        <div className="text-sm mb-1">名前</div>
                        <input
                            className="w-full bg-gray-100 rounded border py-1 px-3 outline-none focus:bg-transparent focus:ring-2 focus:ring-main-orange"
                            ref={nameRef}
                            type="text"
                            id="name"
                            placeholder="Name"
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

                    <div className="text-center mb-10">
                        {loading ? (
                            <Loading />
                        ) : (
                            <button
                                type="submit"
                                className="w-full text-white bg-main-orange hover:brightness-110 duration-500 rounded py-1 px-8"
                            >
                                変更
                            </button>
                        )}
                    </div>
                </form>

                <div className="text-center ">
                    {loadingLogout ? (
                        <Loading />
                    ) : (
                        <div className="inline-block text-white bg-red-500 hover:opacity-80 duration-300 p-2 rounded-md cursor-pointer" onClick={logout}>
                            ログアウト
                        </div>
                    )}
                </div>
            </div >

            <h2 className='text-center text-2xl font-semibold mt-20'>My投稿リスト</h2>
            <ul className='my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>

                {blogsData.slice(offset, offset + perPage).map((blog, index) => {
                    return (
                        <Link href={`/blog/${blog.id}`} key={blog.id}>
                            <li
                                className='bg-white drop-shadow-xl my-2 hover:opacity-80 duration-300 rounded'
                            >
                                <div className="relative w-full h-56 object-covera overflow-hidden rounded-t">
                                    <Image
                                        src={blog.image_url ? blog.image_url : '/default.png'}
                                        alt="avatar"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className='mx-3 py-2'>
                                    <h2>
                                        {format(new Date(blog.created_at), "yyyy/MM/dd")}
                                    </h2>
                                    <p>{blog.title}</p>
                                </div>
                            </li>
                        </Link>
                    );
                })}
            </ul>

            <div className="flex justify-center items-center">
                {blogsData.length != 0 && (
                    <div className="flex justify-center items-center my-5">
                        <MyPagenation
                            allCnt={blogsData.length}
                            perPage={perPage}
                            clickPagenation={paginationHandler}
                        />
                    </div>
                )}

                {blogsData.length == 0 && (
                    <div className="py-10 text-center text-sm text-gray-500">
                        投稿はまだありません
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile