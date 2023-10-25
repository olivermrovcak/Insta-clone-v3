import {Link} from "react-router-dom";
import {DotsHorizontalIcon} from "@heroicons/react/outline";
import React from "react";

interface Props {
    imgSrc: any,
    uId: string,
    userName: any,
}

export default function PostHeader({imgSrc, uId, userName}: Props) {
    return <div className="flex items-center py-2">
        {imgSrc ? (
            <img className="rounded-full h-[32px] w-[32px] object-contain  mr-3" src={imgSrc} alt=""/>
        ) : (
            <div className="rounded-full h-[32px] w-[32px] object-contain  mr-3 loader-2"></div>
        )}

        <div className="flex flex-col justify-start flex-1">
            {userName ? (
                <Link
                    className="flex-1"
                    to="/Account"
                    state={{userId: uId}}
                >
                    <p className="flex-1 font-bold text-white text-[14px]">
                        {userName}
                        <span className="text-gray-500 font-normal text-[14px]"> &#x2022; 5.týž  &#x2022;</span>
                    </p>
                    <p className="flex-1 font-normal text-white text-[12px]">location</p>
                </Link>
            ) : (
                <div className="space-y-1">
                    <p className="rounded-md loader-2 h-[12px] w-[150px]"></p>
                    <p className="rounded-md loader-2 h-[12px] w-[75px]"></p>
                </div>
            )}
        </div>
        <DotsHorizontalIcon className="h-5  "/>
    </div>;
}
