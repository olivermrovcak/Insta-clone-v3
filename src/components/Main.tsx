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

    return (

        <div className='bg-black h-screen overflow-y-scroll scrollbar-hide flex items-start'>
            <Header/>
            <Feed/>
            <ModalLikes/>
        </div>

    );
}

export default Main;
