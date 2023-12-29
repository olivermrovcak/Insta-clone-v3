import {FaceSmileIcon} from "@heroicons/react/24/outline";
import React from "react";

export default function ModalCommentForm() {
    return <div className="w-full border-t p-3   border-[#a1a1a1] border-opacity-25 ">
        <form className="flex items-center  " action="src/components/Feed/Post/Post.tsx">
            <FaceSmileIcon className="h-8 mr-3"/>
            <input
                placeholder="Pridaj komentár..."
                className="border-none bg-black flex-1 pl-0 text-gray-500 focus:ring-0 outline-none text-[14px]"
                type="text"/>
            <button className="text-blue-400 font-bold">Uverejnit</button>

        </form>
    </div>;
}