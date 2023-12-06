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

    const auth = getAuth(app );
    const [dataForPostModal, setDataForPostModal] = useRecoilState(postDataForModal)
    const [posts, setPosts] = useState([]);
    const handleClose = () => setDataForPostModal({opened: false});


    useEffect(() => {
        async function test() {
            const idToken = await auth?.currentUser?.getIdToken(true);
            fetch("http://127.0.0.1:5001/oliverminstaclone/us-central1/getAllPosts", {
                headers: {
                    'Authorization': idToken,
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => console.error('Error:', error));
        }
        test();
    }, []);

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
