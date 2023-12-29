import {ArrowPathRoundedSquareIcon, ChatBubbleBottomCenterIcon} from "@heroicons/react/24/outline";
import {HeartIcon as SolidHeartIcon} from "@heroicons/react/24/solid";
import {HeartIcon as OutlinedHeartIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {hasLiked, likeThread, repostThread, unlikeThread} from "../../firebase/apiCalls";


interface Props {
    threadId: string,
    openThread: () => void
}

export default function ThreadsActionList({threadId, openThread}: Props) {

    const [liked, setLiked] = useState<boolean>(false);

    function handleHasLiked() {
        hasLiked(threadId).then((response) => {
            setLiked(response?.data?.hasLiked)
        }).catch((error) => {
            console.error(error)
        })
    }

    function handleLikeThread() {
        if (liked ) {
            handleUnlikeThread();
            return
        }
        likeThread(threadId).then((response) => {
            console.log(response)
            setLiked(true)
        }).catch((error) => {
            console.error(error)
        })
    }

    function handleUnlikeThread() {
        unlikeThread(threadId).then((response) => {
            console.log(response)
            setLiked(false)
        }).catch((error) => {
            console.error(error)
        })
    }

    function handleRepostThread() {
        repostThread(threadId).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error(error)
        })
    }

    useEffect(() => {
       handleHasLiked()
    }, []);

    return <div className=" flex flex-row space-x-2 my-2 ">
        {liked ? (
            <SolidHeartIcon onClick={handleLikeThread} className="h-6 text-red-500"/>
        ) : (
            <OutlinedHeartIcon onClick={handleLikeThread} className="h-6 text-white "/>
        )}
        <ChatBubbleBottomCenterIcon onClick={openThread} className="h-6"/>
        <ArrowPathRoundedSquareIcon onClick={handleRepostThread} className="h-6"/>
    </div>
}

