import React, {useEffect, useState} from 'react';
import Post from './Post/Post';
import {useRecoilState} from "recoil";
import {postDataForModal, userIdForFollowing} from "../../atoms/modalAtom";
import {Post as PostType} from "../../utils/types/Post";
import {getFollowingPosts} from '../../firebase/apiCalls';
import PostUpdateModal from "./Post/PostModal/PostUpdateModal";

function Posts() {

    const [dataForPostModal, setDataForPostModal] = useRecoilState(postDataForModal)
    const [posts, setPosts] = useState<PostType[]>([]);

    async function getPosts() {
        try {
            const response = await getFollowingPosts();
            setPosts(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    }

    useEffect(() => {
        getPosts();
    }, []);

    return (
        <div className="max-w-[470px] mx-auto">
            {posts.map((post) => (
                <Post key={post.id}
                      id={post.id ?? ""}
                      username={post.username}
                      userImg={post.profileImg}
                      postImg={post.image}
                      caption={post.caption}
                      userId={post.uid}
                />
            ))}
            <PostUpdateModal/>
        </div>
    )
}

export default Posts;