import React, {useEffect, useState} from 'react';
import Header from './Nav/Header';
import Feed from './Feed/Feed';
import {app} from '../firebase/firebase';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import ModalLikes from './Feed/ModalLikes';
import {Outlet} from 'react-router';
import ModalUpload from "./Nav/ModalUpload";

function Main() {

    return (
        <div className='bg-black h-screen overflow-y-scroll scrollbar-hide flex items-start'>
            <Header/>
            <Outlet/>
            <ModalLikes/>
            <ModalUpload />
        </div>
    );
}

export default Main;
