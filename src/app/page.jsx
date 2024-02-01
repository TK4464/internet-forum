import { Suspense } from "react"

import BlogList from "./components/blog/blog-list"
import BlogNewButton from "./components/blog/blog-new-button"
import Loading from "./loading"

const page = ({ searchParams }) => {
    return (
        <div className="h-full">
            <BlogNewButton />
            {/* ローディングに時間がかかる処理を非同期対応 */}
            <Suspense fallback={<Loading />}>
                <BlogList searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

export default page