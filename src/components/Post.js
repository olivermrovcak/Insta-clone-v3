import React, { useEffect, useState } from 'react';
import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon,

} from "@heroicons/react/outline"

import {HeartIcon as HeartIconFilled} from "@heroicons/react/solid";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import Moment from 'react-moment';


import { getAuth } from "firebase/auth";
import {app} from '../firebase/firebase';
import { Link } from "react-router-dom";


import { useRecoilState } from 'recoil';
import { modalStateLikes, postId } from '../atoms/modalAtom';





function Post({ id, username, userImg, postImg, caption, userId }) {

    const [openLikesWindow, setOpenLikesWindow] = useRecoilState(modalStateLikes)
    const [post, setPost] = useRecoilState(postId)


    const auth = getAuth(app);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => onSnapshot(query(collection(db, "posts", id, "comments"),orderBy("timestamp", "desc")), 
    snapshot =>setComments(snapshot.docs)
    ), [db, id]);
    
    useEffect(() => onSnapshot(collection(db, 'posts', id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
    )
     
    , [db, id]);

   useEffect(() => 
       
        setHasLiked(likes.findIndex((like) => like.id == auth?.currentUser?.uid) !== -1 )
   , [likes]);
   
    
    
    const likePost = async () => {
        
        if(hasLiked){
            await deleteDoc(doc(db, 'posts', id, 'likes', auth.currentUser.uid))
        } else {

            await setDoc(doc(db, 'posts', id, 'likes', auth.currentUser.uid),{
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
    <div className='bg-white my-7 border rounded-sm '>

    {/* HEADER */}
    <div className='flex items-center p-5'>
        <img className='rounded-full h-12 w-12 object-contain border mr-3' src={userImg} alt="" />
        <Link
            className='flex-1'
            to='/Account'
            state={{ userId: userId }}
            >
           <p className='flex-1 font-bold' >{username}</p>
        </Link>
        
        <DotsHorizontalIcon className="h-5  " />
    </div>
    {/* POST IMG*/}
    <div className=''>
        <img onDoubleClick={likePost} className='object-cover w-full  max-h-screen' src={postImg} alt="" />

    </div>
    {/* BUTTON */}
    
    
    <div className='flex justify-between px-4 pt-4' >
        <div className='flex space-x-4 '>

        {hasLiked ? ( <HeartIconFilled onClick={likePost} className='btn text-red-500'/>
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
        <p className='p-5 truncate'>
        {likes.length > 0 && (
                    <>
                    <p onClick={() => {setOpenLikesWindow(true);setPost(id)}} className='font-bold mb-1 cursor-pointer'>{likes.length} likes</p>
                    
                    </>
                )}
           

            <span className='font-bold mr-1'>{username}</span>
            {caption}
        </p>
    </div>
    {/* comm */}
    <div className='ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                {comments.map(comment =>(
                    <div key={comment.id} className='flex items-center space-x-2 mb-3'>
                        <img className='h-7 rounded-full' src={comment.data().userImage} alt="" />
                        <p className='text-sm flex-1 '><span className='font-bold'>{comment.data().username}</span>{" "}{comment.data().comment}</p>


                        <Moment fromNow className='pr-4 text-sm'>
                            {comment.data().timestamp?.toDate()}
                        </Moment>
                    </div>
                ))}
            </div>

    {/* input */}
    

    <form className='flex items-center p-4 border-t' action="">
            <EmojiHappyIcon className='h-7'/>
            <input value={comment} onChange={e => setComment(e.target.value)} placeholder='Pridaj komentár...' className='border-none flex-1 focus:ring-0 outline-none' type="text" />
            <button
             type="submit" 
             disabled={!comment.trim()}
              className='font-semibold text-blue-400'
              onClick={sendComment}
              >
                  Post
              
              </button>

        </form>
    


    
    
</div>


  )
}

export default Post;
