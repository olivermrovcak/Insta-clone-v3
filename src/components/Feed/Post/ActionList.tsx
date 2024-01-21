import {HeartIcon as HeartIconFilled} from "@heroicons/react/24/solid";
import {BookmarkIcon, ChatBubbleLeftIcon, HeartIcon, PaperAirplaneIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {collection, deleteDoc, doc, onSnapshot, setDoc} from "firebase/firestore";
import {app, db} from "../../../firebase/firebase";

import {getAuth} from "firebase/auth";
import PostLikes from "./PostLikes";
import {useRecoilState} from "recoil";
import {postDataForModal} from "../../../atoms/modalAtom";

interface Props {
    postId: string,
}


export default function ActionList({postId}: Props) {

    const auth = getAuth(app as any);
    const currUser = auth.currentUser;

    const [hasLiked, setHasLiked] = useState(false);
    const [likes, setLikes] = useState<any[]>([]);

    const [, setDataForPostModal] = useRecoilState(postDataForModal)

    function handleOpenPostDialog() {
        setDataForPostModal({opened: true, id: postId})
    }

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

    return <div>
        <div className="flex justify-between pl-0 pt-4 pb-2 select-none">
            <div className="flex space-x-4 ">
                <LikeBtn hasLiked={hasLiked} onClick={likePost}/>
                <ChatBubbleLeftIcon onClick={handleOpenPostDialog} className="btn"/>
                <PaperAirplaneIcon className="btn rotate-45 pb-1"/>
            </div>
            <BookmarkIcon className="btn"/>
        </div>
        <PostLikes likesCount={likes.length}/>
    </div>
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
