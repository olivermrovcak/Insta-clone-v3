import {EmojiHappyIcon} from "@heroicons/react/outline";
import React, {useEffect, useState} from "react";
import {
    addDoc,
    collection,
    getDocs, orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import {db} from '../../firebase/firebase';
import {getAuth} from "firebase/auth";

import {app} from '../../firebase/firebase';


interface Props {
    actionSendComment?: () => void,
    id: string
}

export default function PostComments({actionSendComment, id}: Props) {

    const auth = getAuth(app as any);

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState<any>([]);


    async function getComments() {

        const q = query(collection(db, "posts", id, "comments"), orderBy('timestamp'));
        const querySnapshot = await getDocs(q);
        var comms: any = [];

        querySnapshot.forEach((doc) => {
            comms = [...comms, doc.data()]
        });
        setComments(comms);
        console.log("fetched ")
    }

    const sendComment = async (e: any) => {

        e.preventDefault();
        const commentToSend = comment;
        setComment(" ");
        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            username: auth?.currentUser?.displayName,
            userImage: auth?.currentUser?.photoURL,
            timestamp: serverTimestamp(),

        })
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            sendComment(e);
            getComments();
        }

    };


    useEffect(() => {
        getComments()
    }, [db, id])


    return <>

        <Comments comments={comments}/>


        <form className='flex items-center  ' action="src/components/Feed/Post.tsx">

            <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={handleKeyDown}
                   placeholder='Pridaj komentár...'
                   className='border-none bg-black flex-1 pl-0 text-gray-500 focus:ring-0 outline-none text-[12px]'
                   type="text"/>
            <EmojiHappyIcon className='h-4'/>
        </form>

    </>
}

interface CommentsProps {
    comments: any[]
}

function Comments({comments}: CommentsProps) {
    return <div>

        {comments?.length > 1 ? (
            <>
                <div key={comments[0]?.id} className='flex items-center mt-1 space-x-2 mb-1'>
                    <p className='text-sm flex-1 '>
                        <span className='font-bold'>{comments[0]?.username}</span>{" "}{comments[0]?.comment}
                    </p>
                </div>

                <p className="text-gray-300 text-[14px] cursor-pointer">Zobrazit všetky komentare({comments?.length})</p>
            </>

        ) : (


            comments?.map((comment: any) => (
                <div key={comment.id} className='flex items-center mt-1 space-x-2 mb-3'>
                    <p className='text-sm flex-1 '>
                        <span className='font-bold'>{comment.username}</span>{" "}{comment.comment}
                    </p>
                </div>
            ))

        )}


    </div>
}

