import { notFound } from "next/navigation";
import { createClient } from "../../../../../utils/supabase-server";

import BlogEdit from "@/app/components/blog/blog-edit";

// ブログ編集ページ
const BlogEditPage = async ({ params }) => {
    const supabase = createClient()

    // ブログ詳細取得
    const { data: blog } = await supabase.from('blogs').select().eq('id', params.blogId).single();

    // ブログが存在しない場合
    if (!blog) return notFound();

    // 取得したブログデータをblogEdit（クライアントコンポーネント）に渡す
    return <BlogEdit blog={blog} />

}

export default BlogEditPage