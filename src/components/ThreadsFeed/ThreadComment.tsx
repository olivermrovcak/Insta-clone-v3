import React, {useEffect} from 'react'
import {deleteCommentFromThread, getUserByUid, updateCommentInThread} from "../../firebase/apiCalls";
import ThreadHeader from "./ThreadHeader";
import {CheckBadgeIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import {MenuItem, Textarea} from "@material-tailwind/react";
import ElipsisMenu from "./ElipsisMenu";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {ErrorToast, SuccessToast} from "../../utils/ToastUtils";

interface props {
    comment: any,
    threadId: string
    refresh: () => void
}

function ThreadComment({comment, threadId, refresh}: props) {

    const [text, setText] = React.useState(comment.text);
    const auth = getAuth(app as any);
    const [isEditing, setIsEditing] = React.useState({
        isEditing: false,
        commentId: ""
    });

    function handleEdit(commentId: string) {
        setIsEditing({isEditing: true, commentId: commentId})
    }

    function isOwner(uid: string) {
        return auth.currentUser?.uid === uid;
    }

    function handleDeleteComment(commentId: string) {
        deleteCommentFromThread(threadId, commentId).then((response) => {
            refresh();
            SuccessToast("Komentár vymazaný");
        }).catch((error) => {
            console.error(error);
            ErrorToast("Komentár sa nepodarilo vymazať");
        })
    }

    function handleUpdateComment() {
        updateCommentInThread(threadId, comment.id, text).then((response) => {
            refresh();
            SuccessToast("Komentár upravený");
            setIsEditing({isEditing: false, commentId: ""})
        }).catch((error) => {
            console.error(error);
            ErrorToast("Komentár sa nepodarilo upraviť");
        })
    }

    return (
        <div
            className="text-white cursor-pointer transition-all
             border-b  border-b-gray-200 border-opacity-20  flex flex-row w-full py-2">
            <div className="min-h-full flex flex-col items-center !w-16 ">
                <img className="rounded-full h-[32px] w-[32px] object-contain" src={comment?.user?.photoUrl}
                     alt=""/>
                <div
                    className="w-[1px]  border-r-2 border-r-gray-400 border-opacity-30 my-2 min-h-[20px] h-full"></div>
                <div className="relative ">
                    <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                         src={comment?.user?.photoUrl} alt=""/>
                    <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                         src={comment?.user?.photoUrl} alt=""/>
                </div>
            </div>
            <div className="w-full pl-3 min-h-[100px] h-[100%] flex flex-col items-start justify-between">
                <div className="flex flex-row items-center w-full">
                    <p className="font-bold text-[14px]">{comment?.user?.name}</p>
                    <CheckBadgeIcon className="h-5 text-blue-500 mx-2 mr-auto"/>
                    <ElipsisMenu handler={<EllipsisHorizontalIcon className="h-5 "/>}>
                        <MenuItem
                            className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 !rounded-b-none last:!border-b-0 "
                            onResize={undefined} onResizeCapture={undefined}>Nahlásiť</MenuItem>
                        {isOwner(comment?.user?.uid) &&
                            <>
                                <MenuItem onClick={() => handleEdit(comment?.id)}
                                          className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 !rounded-b-none last:!border-b-0 "
                                          onResize={undefined} onResizeCapture={undefined}>Editovať</MenuItem>
                                <MenuItem onClick={() => handleDeleteComment(comment?.id)}
                                          className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 text-red-600 !rounded-b-none last:!border-b-0 "
                                          onResize={undefined} onResizeCapture={undefined}>Vymazať</MenuItem>
                            </>
                        }
                    </ElipsisMenu>
                </div>
                {(isEditing.isEditing && isEditing.commentId === comment?.id) ? (
                    <Textarea
                        resize={false}
                        onResize={undefined}
                        onResizeCapture={undefined}
                        className="scrollbar-hide border-none focus:ring-0 h-full"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    />
                ) : (
                    <p className="text-sm text-white ">{comment?.text}</p>
                )}
                {isEditing.isEditing &&
                    <button onClick={() => handleUpdateComment()} className="bg-white ml-auto hover:bg-gray-200 text-black font-bold text-[14px] px-4  py-1 rounded-xl ">
                        Uverejniť
                    </button>
                }
                <p className="text-gray-500 text-sm hover:underline cursor-pointer w-fit justify-self-end">
                    1:13 AM · Dec 19, 2023
                </p>
            </div>
        </div>
    )
}

export default ThreadComment
