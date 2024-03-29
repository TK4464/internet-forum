"use client"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

import ReactPaginate from "react-paginate"

const MyPagenation = ({ allCnt, perPage, clickPagenation }) => {
    return (
        <>
            <ReactPaginate
                previousLabel={<ChevronLeftIcon className="h-5 w-5" />}
                nextLabel={<ChevronRightIcon className="h-5 w-5" />}
                breakLabel={"..."}
                pageCount={Math.ceil(allCnt / perPage)}
                // initialPage={page - 1}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={clickPagenation}
                containerClassName={
                    "z-0 inline-flex rounded -space-x-px text-sm bg-white"
                }
                pageLinkClassName={
                    "border border-gray-100 hover:bg-main-orange hover:text-white inline-flex items-center px-3 py-2"
                }
                activeLinkClassName={
                    "z-10 bg-main-orange text-white border border-main-orange inline-flex items-center px-3 py-2"
                }
                breakLinkClassName={
                    "inline-flex items-center px-3 py-2 border border-gray-100"
                }
                previousLinkClassName={
                    "inline-flex items-center px-2 py-2 rounded-l border border-gray-100 hover:bg-main-orange hover:text-white"
                }
                nextLinkClassName={
                    "inline-flex items-center px-2 py-2 rounded-r border border-gray-100 hover:bg-main-orange hover:text-white"
                }
                disabledClassName={"hidden"}
            />
        </>
    )
}

export default MyPagenation
