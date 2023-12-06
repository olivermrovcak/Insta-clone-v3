import React, {useEffect, useState} from 'react';
import Header from './Nav/Header';
import Feed from './Feed/Feed';
import {app} from '../firebase/firebase';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import ModalLikes from './Feed/ModalLikes';
import PostModal from "./Feed/Post/PostModal/PostModal";

function Main() {

    const auth = getAuth(app as any);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        async function test() {
            const idToken = await auth?.currentUser?.getIdToken(true);
            fetch("http://127.0.0.1:5001/oliverminstaclone/us-central1/getAllPosts", {
                headers: {
                    'Authorization': idToken as string,
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
        <div className='bg-black h-screen overflow-y-scroll scrollbar-hide flex items-start'>
            <Header/>
            <Feed/>
            <ModalLikes/>
        </div>

    );
}

export default Main;
