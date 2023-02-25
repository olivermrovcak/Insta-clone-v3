import React from 'react';

import PostHeader from "./PostHeader";
import PostImg from "./PostImg";
import ActionList from "./ActionList";
import PostCaption from "./PostCaption";
import PostComments from "./PostComments";

interface Props {
    id: string,
    username: string,
    userImg: any,
    postImg: any,
    caption: string,
    userId: string
}


export default function Post({id, username, userImg, postImg, caption, userId}: Props) {

    return (
        <article className='bg-black text-white my-7 '>

            {/* HEADER */}
            <PostHeader userName={username} imgSrc={userImg} uId={userId}/>

            {/* POST IMG*/}
            <PostImg imgSrc={postImg}/>

            {/* BUTTONS */}
            <ActionList postId={id}/>

            {/* Caption */}
            <PostCaption userName={username} caption={caption}/>

            {/* Comments*/}
            <PostComments id={id}/>

        </article>


    )
}


