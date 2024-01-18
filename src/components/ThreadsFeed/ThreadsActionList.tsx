import {ArrowPathRoundedSquareIcon, ChatBubbleBottomCenterIcon} from "@heroicons/react/24/outline";
import {HeartIcon as SolidHeartIcon} from "@heroicons/react/24/solid";
import {HeartIcon as OutlinedHeartIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {repostThread} from "../../firebase/apiCalls";
import {collection, deleteDoc, doc, onSnapshot, setDoc} from "firebase/firestore";
import {app, db} from "../../firebase/firebase";
import {getAuth} from "firebase/auth";

interface Props {
    threadId: string,
    openThread?: () => void
}

export default function ThreadsActionList({threadId, openThread}: Props) {

    const [liked, setLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<any>([]);
    const auth = getAuth(app as any);

    const likePost = async () => {
        const uid = auth?.currentUser?.uid;
        if (!uid) {
            return;
        }

        if(liked){
            await deleteDoc(doc(db, 'threads', threadId, 'likes', uid));
        } else {
            await setDoc(doc(db, 'threads', threadId, 'likes', uid), {
                uid: uid
            });
        }
    }

    function handleRepostThread() {
        repostThread(threadId).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error(error)
        })
    }

    useEffect(() => onSnapshot(collection(db, 'threads', threadId, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
    ), [db, threadId]);

    useEffect(() => {
        setLiked(likes.findIndex((like) => like.id == auth?.currentUser?.uid) !== -1)
    }, [likes]);

    return <div className=" flex flex-row space-x-2 my-2 ">
        {liked ? (
            <SolidHeartIcon onClick={likePost} className="h-6 text-red-500"/>
        ) : (
            <OutlinedHeartIcon onClick={likePost} className="h-6 text-white "/>
        )}
        {openThread && <ChatBubbleBottomCenterIcon onClick={openThread} className="h-6"/> }
        <ArrowPathRoundedSquareIcon onClick={handleRepostThread} className="h-6"/>
    </div>
}

