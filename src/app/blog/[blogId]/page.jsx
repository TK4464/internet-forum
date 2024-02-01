import notFound from "@/app/not-found";
import { createClient } from "../../../../utils/supabase-server";

import BlogDetail from "@/app/components/blog/blog-detail";



const BlogDetailPage = async ({ params }) => {
    const supabase = createClient()

    // ブログ詳細取得
    const { data: blogData } = await supabase
        .from('blogs')
        .select(
            'id, created_at, title, content, image_url, profiles(id, name, avatar_url), comments(id, content, created_at, profiles(id, name,  avatar_url), likes(user_id))'
        ) // コメント取得
        .eq('id', params.blogId)
        .single()

    // ブログが存在しない場合
    if (!blogData) return notFound()

    return <BlogDetail blog={blogData} />
}

export default BlogDetailPage
