import {BookmarkIcon, ChatBubbleBottomCenterIcon, HeartIcon, PaperAirplaneIcon} from "@heroicons/react/24/outline";
import React, {useState} from "react";

interface Props {
    likesCount: number
}

export default function ModalActionList({likesCount}:Props) {

    const [hasLiked, setHasLiked] = useState(false);

    return <div className="w-full border-t p-3 mt-auto   border-[#a1a1a1] border-opacity-25 ">
        <div className="flex justify-between mb-2  select-none">
            <div className="flex space-x-4 ">
                <HeartIcon className="btn"/>
                <ChatBubbleBottomCenterIcon className="btn"/>
                <PaperAirplaneIcon className="btn rotate-45 pb-1"/>
            </div>
            <BookmarkIcon className="btn"/>
        </div>
        <p
            className="font-bold text-[14px] mb-1   cursor-pointer">
            {likesCount} Páči sa mi to
        </p>
        <p className="text-[12px] text-gray-500">FEBRUAR 21</p>
    </div>;
}