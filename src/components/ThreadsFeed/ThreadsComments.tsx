import React from 'react'
import ThreadComment from "./ThreadComment";

interface props {
    comments: any[]
}

function ThreadsComments({comments}: props) {

    return (
        <div
            className="w-full border-gray-500 border-[1px] border-t-0 rounded-bl-md rounded-br-md text-white flex flex-col ">
            {comments?.map((comment) => (
                    <ThreadComment text={comment.text} uid={comment.uid} isEdited={comment?.edited}/>
                )
            )}
        </div>
    )
}

export default ThreadsComments
