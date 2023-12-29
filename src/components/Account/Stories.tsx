import React from 'react'
import {PlusIcon} from "@heroicons/react/24/outline";

interface props {
    user: user,
}

interface user {
    photoUrl: string,
}

export default function Stories({user}: props) {
    return (
        <ul className="flex flex-row items-start w-full border-b border-opacity-20 border-gray-200 py-10 space-x-10 ">
            <li className="text-center space-y-2 cursor-pointer">
                <img alt="user-photo" src={user?.photoUrl}
                     className=" w-[77px] h-[77px] object-contain rounded-full p-1 border "/>
                <p className="text-sm">popis</p>
            </li>
            <li className="text-center space-y-2 cursor-pointer">
                <div
                    className=" flex flex-col justify-center items-center w-[77px] h-[77px] object-contain rounded-full p-1 border ">
                    <PlusIcon className="w-10 h-10 text-gray-300 "/>
                </div>
                <p className="text-sm">nové</p>
            </li>
        </ul>
    )
}
