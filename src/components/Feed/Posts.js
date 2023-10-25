import {collection, onSnapshot, orderBy, query, doc} from 'firebase/firestore';
import React, {useEffect, useState} from 'react';
import {db} from '../../firebase/firebase';
import Post from './Post/Post';
import getDataFromDb from "../../firebase/functions";
import {useRecoilState} from "recoil";
import {postDataForModal, userIdForFollowing} from "../../atoms/modalAtom";
import PostModal from "./Post/PostModal/PostModal";
import {data} from "autoprefixer";

function Posts() {

    const [dataForPostModal, setDataForPostModal] = useRecoilState(postDataForModal)
    const [posts, setPosts] = useState([]);

    const handleClose = () => setDataForPostModal({opened: false});


    async function getPosts() {
        var path = "posts";
        var pathSegments = "";
        await getDataFromDb({path, pathSegments}).then((res) => {
            setPosts(res);

        })
    };

    useEffect(() => {
        getPosts();
    }, [db])

    return (

        <div className="max-w-[470px] mx-auto">
            {posts.map((posts) => (
                <Post key={posts.id}
                      id={posts.id}
                      username={posts.data().username}
                      userImg={posts.data().profileImg}
                      postImg={posts.data().image}
                      caption={posts.data().caption}
                      userId={posts.data().uid}
                />
            ))}

            <PostModal opened={dataForPostModal.opened} onClose={handleClose} postId={dataForPostModal.id}/>
        </div>

    )
}

export default Posts;
