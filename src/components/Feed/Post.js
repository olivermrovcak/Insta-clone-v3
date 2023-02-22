import React, {useEffect, useState} from 'react';
import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon,

} from "@heroicons/react/outline"

import {HeartIcon as HeartIconFilled} from "@heroicons/react/solid";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import {db} from '../../firebase/firebase';
import Moment from 'react-moment';


import {getAuth} from "firebase/auth";
import {app} from '../../firebase/firebase';
import {Link} from "react-router-dom";


import {useRecoilState} from 'recoil';
import {modalStateLikes, postId} from '../../atoms/modalAtom';


function Post({id, username, userImg, postImg, caption, userId}) {

    const [openLikesWindow, setOpenLikesWindow] = useRecoilState(modalStateLikes)
    const [post, setPost] = useRecoilState(postId)


    const auth = getAuth(app);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
        snapshot => setComments(snapshot.docs)
    ), [db, id]);

    useEffect(() => onSnapshot(collection(db, 'posts', id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
        )

        , [db, id]);

    useEffect(() =>

            setHasLiked(likes.findIndex((like) => like.id == auth?.currentUser?.uid) !== -1)
        , [likes]);


    const likePost = async () => {

        if (hasLiked) {
            await deleteDoc(doc(db, 'posts', id, 'likes', auth.currentUser.uid))
        } else {

            await setDoc(doc(db, 'posts', id, 'likes', auth.currentUser.uid), {
                username: auth.currentUser.displayName,
                uid: auth.currentUser.uid
            })
        }


    }


    const sendComment = async (e) => {

        e.preventDefault();
        const commentToSend = comment;
        setComment(" ");
        await addDoc(collection(db, 'posts', id, 'comments'), {
            comment: commentToSend,
            username: auth.currentUser.displayName,
            userImage: auth.currentUser.photoURL,
            timestamp: serverTimestamp(),

        })

    }


    return (
        <div className='bg-black text-white my-7 '>

            {/* HEADER */}
            <div className='flex items-center py-2'>
                <img className='rounded-full h-[32px] w-[32px] object-contain  mr-3' src={userImg} alt=""/>

                <div className="flex flex-col justify-start flex-1">

                    <Link
                        className='flex-1'
                        to='/Account'
                        state={{userId: userId}}
                    >
                        <p className='flex-1 font-bold text-white text-[14px]'>
                            {username}
                            <span className="text-gray-500 font-normal text-[14px]"> &#x2022; 5.týž  &#x2022;</span>

                        </p>

                    </Link>
                    <p className='flex-1 font-normal text-white text-[12px]'>location</p>
                </div>


                <DotsHorizontalIcon className="h-5  "/>
            </div>
            {/* POST IMG*/}
            <div className=''>
                <img onDoubleClick={likePost} className='object-cover w-full rounded-md max-h-screen' src={postImg}
                     alt=""/>

            </div>
            {/* BUTTON */}


            <div className='flex justify-between pl-0 pt-4'>
                <div className='flex space-x-4 '>

                    {hasLiked ? (<HeartIconFilled onClick={likePost} className='btn text-red-500'/>
                    ) : (
                        <HeartIcon onClick={likePost} className='btn'/>)

                    }
                    <ChatIcon className='btn'/>
                    <PaperAirplaneIcon className='btn rotate-45 pb-1'/>
                </div>

                <BookmarkIcon className='btn'/>
            </div>


            {/* caprtion */}
            <div>
                <p className='pt-4 truncate'>
                    {likes.length > 0 && (
                        <>
                            <p onClick={() => {
                                setOpenLikesWindow(true);
                                setPost(id)
                            }} className='font-bold text-[14px] mb-1 cursor-pointer'>{likes.length} Páči sa mi to</p>

                        </>
                    )}
                </p>
                <p className='font-bold text-[14px] mr-1'>
                    {username} {caption}
                </p>



            </div>
            {/* comm */}
            <div className='  overflow-y-scroll scrollbar-thumb-black scrollbar-thin '>

            </div>

            {/* input */}


            <form className='flex items-center  ' action="src/components/Feed/Post">

                <input value={comment} onChange={e => setComment(e.target.value)} placeholder='Pridaj komentár...'
                       className='border-none bg-black flex-1 pl-0 text-gray-500 focus:ring-0 outline-none text-[12px]'
                       type="text"/>

                <EmojiHappyIcon className='h-4'/>
            </form>


        </div>


    )
}

export default Post;
