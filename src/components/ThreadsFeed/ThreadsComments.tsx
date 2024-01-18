import React from 'react'
import {CheckBadgeIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import {Menu, MenuHandler, MenuItem, MenuList, Textarea} from "@material-tailwind/react";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {deleteCommentFromThread} from "../../firebase/apiCalls";
import {ErrorToast, SuccessToast} from "../../utils/ToastUtils";
import ThreadComment from "./ThreadComment";

interface props {
    comments: any[]
    threadId: string
    refresh: () => void
}

function ThreadsComments({comments, threadId, refresh}: props) {

    const auth = getAuth(app as any);

    return (
        <div
            className="w-full  flex flex-col ">
            {comments?.map((comment) => (
                  <ThreadComment key={comment.id} comment={comment} threadId={threadId} refresh={refresh}/>
                )
            )}
        </div>
    )
}

export default ThreadsComments

function ElipsisMenu({handler, children}: any) {
    return (
        <Menu placement="bottom-end">
            <MenuHandler>
                {handler}
            </MenuHandler>
            <MenuList
                className="!z-[101] rounded-xl p-0 bg-[#0f0f0f] border-gray-500 border border-opacity-20 text-white font-bold [&>*]:last:!border-b-0"
                onResize={undefined} onResizeCapture={undefined}>
                {children}
            </MenuList>
        </Menu>
    )
}
