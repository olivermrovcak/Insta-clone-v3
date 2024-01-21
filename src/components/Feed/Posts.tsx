import React, {useEffect, useState} from 'react';
import Post from './Post/Post';
import {useRecoilState} from "recoil";
import {loadingState, postDataForModal} from "../../atoms/modalAtom";
import {Post as PostType} from "../../utils/types/Post";
import {getAllPosts, getFollowingPosts} from '../../firebase/apiCalls';
import PostUpdateModal from "./Post/PostModal/PostUpdateModal";
import PostModal from "./Post/PostModal/PostModal";
import {useLocation, useNavigate} from "react-router-dom";
import ReportModal from "./ReportModal";
import {CameraIcon} from "@heroicons/react/24/outline";

function Posts() {

    const location = useLocation();
    const path = window.location.pathname;

    const [dataForPostModal, setDataForPostModal] = useRecoilState(postDataForModal)
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useRecoilState(loadingState)

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
            {posts.length > 1 ? posts.map((post) => (
                <Post key={post.id}
                      id={post.id}
                      username={post.username}
                      userImg={post.profileImg}
                      postImg={post.image}
                      caption={post.caption}
                      userId={post.uid}
                      refresh={getPosts}
                />
            )) : (
                <>
                    {!isLoading &&
                        <div className="w-full h-[309px] flex flex-col justify-center items-center  text-[#737373] col-span-3">
                            <div className="p-4 border border-[#737373] rounded-full flex justify-center items-center mb-10">
                                <CameraIcon className="h-8 " />
                            </div>
                            <p className="text-xl text-white font bold">ŽIADNE PRÍSPEVKY</p>
                        </div>
                    }
                </>
                )}
            <PostUpdateModal/>
            <PostModal opened={dataForPostModal.opened} onClose={handleClose} postId={dataForPostModal.id}/>
            <ReportModal/>
        </div>
    )
}

export default Posts;