import {EllipsisHorizontalCircleIcon} from "@heroicons/react/24/outline";
import React from "react";

interface Props {
    profileImg: string,
    userName: string,

}


export default function ModalHeader({profileImg, userName}:Props) {
    return <div className="w-full p-3 flex justify-start items-center border-b  border-[#a1a1a1] border-opacity-25 ">
        {/*PROFILE IMG*/}
        <img
            src={profileImg}
            className="h-[32px] w-[32px] object-contain mr-2 rounded-full"
        />
        {/*Username*/}
        <div className="flex-1">
            <p className="text-[14px] font-bold">{userName}</p>
            <p className="text-[12px] ">Location</p>
        </div>
        <EllipsisHorizontalCircleIcon className="h-5  "/>
    </div>;
}