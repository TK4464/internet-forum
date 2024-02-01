"use client"
import { useRouter } from "next/navigation"
import MyPagenation from "../pagination"

// ブログページネーション
const BlogPagination = ({ allCnt, perPage }) => {
    const router = useRouter()

    const paginationHandler = ({ selected }) => {
        router.push(`/?page=${selected + 1}`)
    }

    return (
        <MyPagenation
            allCnt={allCnt}
            perPage={perPage}
            clickPagenation={paginationHandler}
        />
    )
}

export default BlogPagination
