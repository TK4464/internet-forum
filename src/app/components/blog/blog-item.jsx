"use client"
import { format } from "date-fns"

import Link from "next/link"
import Image from "next/image"

const BlogItem = (blog) => {
    const MAX_LENGTH = 55
    let content = blog.content.replace(/\r?\n/g, "")

    // 文字数制限
    if (content.length > MAX_LENGTH) {
        content = content.substring(0, MAX_LENGTH) + "..."
    }

    return (
        <div className="break-words bg-white drop-shadow-xl rounded hover:opacity-80 duration-500">
            <div className="mb-5">
                <Link href={`blog/${blog.id}`}>
                    <Image
                        src={blog.image_url}
                        className=" aspect-video object-cover rounded-t"
                        alt="image"
                        width={640}
                        height={360}
                        unoptimized
                    />
                </Link>
            </div>

            <div className="text-gray-500 text-sm mx-3">
                {format(new Date(blog.created_at), "yyyy/MM/dd HH:mm")}
            </div>

            <div className="font-bold text-xl mx-3">{blog.title}</div>
            <div className="mb-3 text-gray-500 mx-3">{content}</div>

            <div className="flex items-center space-x-3 border-t">
                <div className=" relative w-11 h-11 rounded-full overflow-hidden m-3">
                    <Image
                        src={blog.profiles.avatar_url ? blog.profiles.avatar_url : '/default.png'}
                        alt="avatar"
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                    />
                </div>
                <div className="font-bold">{blog.profiles.name}</div>
                
            </div>

        </div>
    )
}

export default BlogItem