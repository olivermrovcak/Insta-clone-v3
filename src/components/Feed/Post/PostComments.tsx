import {FaceSmileIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {
    addDoc,
    collection,
    getDocs, orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import {db} from '../../../firebase/firebase';
import {getAuth} from "firebase/auth";

import {app} from '../../../firebase/firebase';
import getDataFromDb from "../../../firebase/functions";
import {useRecoilState} from "recoil";
import {postDataForModal} from "../../../atoms/modalAtom";


interface Props {
    actionSendComment?: () => void,
    id: string
}

export default function PostComments({actionSendComment, id}: Props) {

    const auth = getAuth(app as any);

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any>([]);
    const [, setDataForPostModal] = useRecoilState(postDataForModal);

    async function getComments() {
        const path = "posts";
        const pathSegments = id + "/comments";
        const orderByField = "timeStamp";
        const order = "asc";
        await getDataFromDb({path, pathSegments, orderByField, order}).then((res) => {
            setComments(res);
        });
    }

    const sendComment = async (e: any) => {
        e.preventDefault();
        const commentToSend = comment;
        setComment(" ");
        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            username: auth?.currentUser?.displayName,
            userImage: auth?.currentUser?.photoURL,
            timeStamp: serverTimestamp(),
        })
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            sendComment(e);
            getComments();
        }
    };

    const handleOpenComments = () => {
        setDataForPostModal({
            opened: true,
            id: id
        } as any);
    }

    useEffect(() => {
        getComments();
    }, [db, id])

    return <>
        <Comments comments={comments} setData={handleOpenComments}/>

        <form className='flex items-center  ' action="src/components/Feed/Post/Post.tsx">
            <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={handleKeyDown}
                   placeholder='Pridaj komentár...'
                   className='border-none bg-black flex-1 pl-0 text-gray-500 focus:ring-0 outline-none text-[12px]'
                   type="text"/>
            <FaceSmileIcon className='h-4'/>
        </form>

    </>
}

interface CommentsProps {
    comments: any[],
    setData: () => void,
}

function Comments({comments, setData}: CommentsProps) {

    return <div>
        {comments?.length > 1 ? (
            <>
                <div key={comments[0]?.id} className='flex items-center mt-1 space-x-2 mb-1'>
                    <p className='text-sm flex-1 '>
                        <span
                            className='font-bold'>{comments[0]?.data().username}</span>{" "}{comments[0]?.data().comment}
                    </p>
                </div>
                <p onClick={setData} className="text-gray-300 text-[14px] cursor-pointer">Zobrazit všetky
                    komentare({comments?.length})</p>
            </>
        ) : (
            comments?.map((comment: any) => (
                <div key={comment.data().id} className='flex items-center mt-1 space-x-2 mb-3'>
                    <p className='text-sm flex-1 '>
                        <span className='font-bold'>{comment.data().username}</span>{" "}{comment.data().comment}
                    </p>
                </div>
            ))
        )}
    </div>
}

