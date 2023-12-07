import React from 'react'
import {Thread as ThreadType} from "../../utils/types/Thread";
import PostHeader from "../Feed/Post/PostHeader";
import ActionList from "../Feed/Post/ActionList";

function Thread({uid, text, userName, timeStamp, attachment}: ThreadType) {

    //function that truncates text to 100 characters
    function truncateText(text: string) {
        return text.length > 300 ? text.substring(0, 300) + "..." : text;
    }

    return (
        <div className="text-white border border-1 border-gray-200 rounded-2xl flex flex-col w-full p-4">
            <PostHeader
                imgSrc={"https://lh3.googleusercontent.com/a/ACg8ocIAzbOHjRmqgboCYPGSSgio2Z8FxhU-fv2mS-xcQomX=s96-c"}
                uId={uid}
                userName={userName}
            />
            <div className="w-full">
                <p>
                    {truncateText(text)}
                </p>
            </div>

            <div className="w-full p-4 pl-0">
                <div className="">
                    <img src={attachment} className="object-contain rounded-md"/>
                </div>
            </div>

            <ActionList postId={uid}/>
        </div>
    )
}

export default Thread
