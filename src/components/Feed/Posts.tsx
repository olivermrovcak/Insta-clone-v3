import React, {useEffect, useState} from 'react';
import Post from './Post/Post';
import {useRecoilState} from "recoil";
import {loadingState, postDataForModal} from "../../atoms/modalAtom";
import {Post as PostType} from "../../utils/types/Post";
import {getAllPosts, getFollowingPosts} from '../../firebase/apiCalls';
import PostUpdateModal from "./Post/PostModal/PostUpdateModal";
import PostModal from "./Post/PostModal/PostModal";
import {useNavigate} from "react-router-dom";

function Posts() {

    const path = window.location.pathname;

    const [dataForPostModal, setDataForPostModal] = useRecoilState(postDataForModal)
    const [posts, setPosts] = useState<PostType[]>([]);
    const [, setIsLoading] = useRecoilState(loadingState)

    async function getPosts() {
        try {
            setIsLoading(true);
            if (path === "/posts/following") {
                await getFollowingPosts().then((response) => {
                    setPosts(response.data);
                    console.log(response.data)
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    setIsLoading(false);
                });
            } else if (path === "/posts/forYou") {
                await getAllPosts().then((response) => {
                    setPosts(response.data);
                    console.log(response.data)
                }).catch((error) => {
                    console.error(error)
                }).finally(() => {
                    setIsLoading(false);
                });
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    }

    function handleClose() {
        setDataForPostModal({opened: false, id: ""})
    }

    useEffect(() => {
        getPosts();
    }, [path]);

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
            <PostModal opened={dataForPostModal.opened} onClose={handleClose} postId={dataForPostModal.id}/>
        </div>
    )
}

export default Posts;