import {BookmarkIcon, ChatBubbleBottomCenterIcon, HeartIcon, PaperAirplaneIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {collection, deleteDoc, doc, onSnapshot, setDoc} from "firebase/firestore";
import {app, db} from "../../../../firebase/firebase";
import {getAuth} from "firebase/auth";
import {HeartIcon as HeartIconFilled} from "@heroicons/react/24/solid";

interface Props {
    postId: string,

}

export default function ModalActionList({postId}: Props) {

    const [hasLiked, setHasLiked] = useState(false);
    const [likes, setLikes] = useState<any[]>([]);
    const auth = getAuth(app as any);
    const currUser = auth.currentUser;

    useEffect(() => onSnapshot(collection(db, 'posts', postId, "likes"), (snapshot) =>
            setLikes(snapshot.docs as any)
        )
        , []);

    useEffect(() =>
            setHasLiked(likes.findIndex((like) => like.id == currUser?.uid) !== -1)
        , [likes]);

    const likePost = async () => {

        if (hasLiked) {
            await deleteDoc(doc(db, 'posts', postId, 'likes', (currUser?.uid ?? " ")))
        } else {

            await setDoc(doc(db, 'posts', postId, 'likes', (currUser?.uid ?? " ")), {
                username: currUser?.displayName,
                uid: currUser?.uid
            })
        }
    }

    return <div className="w-full border-t p-3 mt-auto   border-[#a1a1a1] border-opacity-25 ">
        <div className="flex justify-between mb-2  select-none">
            <div className="flex space-x-4 ">
                <LikeBtn hasLiked={hasLiked} onClick={likePost}/>
                <ChatBubbleBottomCenterIcon className="btn"/>
                <PaperAirplaneIcon className="btn rotate-45 pb-1"/>
            </div>
            <BookmarkIcon className="btn"/>
        </div>
        <p
            className="font-bold text-[14px] mb-1   cursor-pointer">
            {likes.length} Páči sa mi to
        </p>
    </div>;
}

function LikeBtn(props: { hasLiked: boolean, onClick: () => Promise<void> }) {
    return <>
        {props.hasLiked ?
            (<HeartIconFilled onClick={props.onClick} className="btn text-red-500"/>
            ) : (
                <HeartIcon onClick={props.onClick} className="btn"/>)
        }
    </>;
}