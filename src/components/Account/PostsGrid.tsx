import React from 'react'
import {CameraIcon} from "@heroicons/react/24/outline";

interface props {
    posts: post[]
}

interface post {
    uid: string,
    image: string,
}

export default function PostsGrid({posts}: props) {
    return (
        <div className="w-full flex flex-col">
            <ul className="flex flex-row justify-center space-x-4 text-sm">
                <li className="border-t px-3 py-2">
                    <p>PRÍSPEVKY</p>
                </li>
                <li className="px-3 py-2">
                    <p>ULOŽENÉ</p>
                </li>
                <li className="px-3 py-2">
                    <p>S OZNAČENÍM</p>
                </li>
            </ul>
            <div className=" w-full grid grid-cols-3 gap-[4px] justify-center mt-3">
                {posts?.length === 0 ? (
                    <div className="w-full h-[309px] flex flex-col justify-center items-center  text-[#737373] col-span-3">
                        <div className="p-4 border border-[#737373] rounded-full flex justify-center items-center mb-10">
                            <CameraIcon className="h-8 " />
                        </div>
                        <p className="text-xl text-white font bold">ŽIADNE PRÍSPEVKY</p>
                    </div>
                ) : (
                    posts?.map((post, index) => {
                        return (
                            <div key={index} className="w-[309] h-[309px]">
                                <img alt="" src={post?.image} className="w-full h-[309px] object-cover"/>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    )
}
