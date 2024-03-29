"use client"
import { useState, useRef, createRef, useCallback } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useSupabase } from "../supabase-provider"
import {
    TrashIcon,
    PencilSquareIcon,
    XCircleIcon
} from "@heroicons/react/24/outline"

import Link from "next/link"
import useStore from "../../../../store"
import Image from "next/image"
import Loading from "../../loading"
import MyPagenation from "../pagination"
import BlogLike from "./blog-like"

// コメント
const BlogComment = ({ blog, login }) => {
    const router = useRouter()
    const { supabase } = useSupabase()
    const { user } = useStore()
    const [loadingComment, setLoadingComment] = useState(false)
    const [loadingDeleteComment, setLoadingDeleteComment] = useState("")
    const [commentId, setCommentId] = useState("")
    const [offset, setOffset] = useState(0)
    const scrollRef = createRef()
    const commentRef = useRef(null)
    const perPage = 3 // 1ページのコメント数

    // コメント送信
    const onSubmit = async (e) => {
        e.preventDefault()
        setLoadingComment(true)

        if (!commentId) {
            // コメントを新規作成
            // supabaseのcommentsテーブルに格納される
            const { error: insertError } = await supabase.from("comments").insert({
                content: commentRef.current.value,
                blog_id: blog.id,
                profile_id: user.id
            })

            // エラーチェック
            if (insertError) {
                alert(insertError.message)
                setLoadingComment(false)
                return
            }
        } else {
            // コメントを編集
            const { error: updateError } = await supabase
                .from("comments")
                .update({
                    content: commentRef.current.value
                })
                .eq("id", commentId)

            // エラーチェック
            if (updateError) {
                alert(updateError.message)
                setLoadingComment(false)
                return
            }
        }

        // コメント編集クリア
        setCommentId("")

        // フォームクリア
        commentRef.current.value = ""

        // キャッシュクリア
        router.refresh()

        setLoadingComment(false)
    }

    //コメント並び替え
    blog.comments.sort((a, b) => {
        if (new Date(a.created_at) < new Date(b.created_at)) return 1
        if (new Date(a.created_at) > new Date(b.created_at)) return -1
        return 0
    })

    // コメント投稿フォームにスクロール
    const scrollToComment = useCallback(() => {
        scrollRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }, [scrollRef])

    // コメント削除
    const deleteComment = async comment_id => {
        setLoadingDeleteComment(comment_id)
        await supabase
            .from("comments")
            .delete()
            .match({ id: comment_id })
        setLoadingDeleteComment("")

        // キャッシュクリア
        router.refresh()
    }

    // コメント編集
    const editComment = (comment_id, content) => {
        setCommentId(comment_id)
        commentRef.current.value = content
        scrollToComment()
    }

    // コメント編集取り消し
    const editCancelComment = () => {
        setCommentId("")
        commentRef.current.value = ""
    }

    // コメントページネーション
    const paginationHandler = ({ selected }) => {
        setOffset(selected * perPage)
    }

    // コメント編集削除ボタン
    const renderEditDelete = data => {
        // 自身のコメントチェック
        if (login && data.profiles.id == user.id) {
            return (
                <div className="text-sm flex items-center space-x-2 pl-2">
                    <div
                        className="flex cursor-pointer"
                        onClick={() => editComment(data.id, data.content)}
                    >
                        <div className='mr-1'>編集</div>
                        <PencilSquareIcon className="h-5 w-5 text-blue-500 hover:brightness-110" />
                    </div>

                    {loadingDeleteComment == data.id ? (
                        <div className="h-4 w-4 animate-spin rounded border border-main-orange border-t-transparent" />
                    ) : (
                        <div
                            className="flex cursor-pointer"
                            onClick={() => deleteComment(data.id)}
                        >
                            <div className='mr-1'>削除</div>
                            <TrashIcon className="h-5 w-5 text-red-500 hover:brightness-110" />
                        </div>
                    )}
                </div>
            )
        }
    }

    return (
        <div>
            <div className={`border rounded mb-5 bg-white p-4 drop-shadow-xl mt-3`}>
                <div className="mb-3" ref={scrollRef}>
                    {!commentId ? (
                        <div className="font-bold">コメントする</div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="font-bold">コメントを編集する</div>
                            <div
                                className="text-sm text-red-500 cursor-pointer"
                                onClick={editCancelComment}
                            >
                                <XCircleIcon className="h-7 w-7 text-red-500" />
                            </div>
                        </div>
                    )}
                </div>

                {login ? (
                    <form onSubmit={onSubmit}>
                        <div className="mb-5">
                            <textarea
                                className="w-full rounded border py-1 px-3 outline-none focus:ring-2 focus:ring-main-orange"
                                rows={5}
                                ref={commentRef}
                                id="comment"
                                required
                            />
                        </div>
                        <div className="text-center mb-5">
                            {loadingComment ? (
                                <Loading />
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full text-white bg-main-orange hover:brightness-110 rounded duration-300 py-1 px-8"
                                >
                                    {!commentId ? "投稿" : "編集"}
                                </button>
                            )}
                        </div>
                    </form>
                ) : (
                    <div className="text-center my-10 text-sm text-gray-500">
                        コメントするには
                        <Link href="/auth/login" className="text-blue-500 underline">
                            ログイン
                        </Link>
                        が必要です。
                    </div>
                )}
            </div>

            <div className="">
                <div className=" flex items-center justify-between p-3 bg-white rounded drop-shadow-lg">
                    <div className="font-bold">コメント</div>
                    <div>{blog.comments.length}人</div>
                </div>

                {blog.comments.slice(offset, offset + perPage).map((data, index) => (
                    <div
                        key={data.id}
                        className={blog.comments.length - 1 === index ? "border-b rounded bg-white p-4 drop-shadow-xl my-2" : "border-b rounded bg-white p-4 drop-shadow-xl my-2"}
                    >
                        <div className="flex items-center justify-between border-b p-3 ">
                            <div className="flex items-center space-x-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={data.profiles.avatar_url ? data.profiles.avatar_url : '/default.png'}
                                        alt="avatar"
                                        layout="fill"
                                        objectFit="cover"
                                        unoptimized
                                    />
                                </div>
                                <div>{data.profiles.name}</div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {format(new Date(data.created_at), "yyyy/MM/dd HH:mm")}
                            </div>
                        </div>
                        <div className="leading-relaxed break-words whitespace-pre-wrap p-3 border-b">
                            {data.content}
                        </div>

                        <div className="flex items-center justify-end px-3 my-3">
                            <div className="flex items-center space-x-1">
                                <BlogLike data={data} login={login} />
                                <div>{data.likes.length}</div>
                                {renderEditDelete(data)}
                            </div>
                        </div>
                    </div>
                ))}

                {blog.comments.length != 0 && (
                    <div className="flex justify-center items-center my-5">
                        <MyPagenation
                            allCnt={blog.comments.length}
                            perPage={perPage}
                            clickPagenation={paginationHandler}
                        />
                    </div>
                )}

                {blog.comments.length == 0 && (
                    <div className="py-10 text-center text-sm text-gray-500">
                        コメントはまだありません
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlogComment
