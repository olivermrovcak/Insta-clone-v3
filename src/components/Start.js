import React, {useEffect} from 'react';
import Header from './Header';
import Feed from './Feed';
import Modal from './Modal';

import {app} from '../firebase/firebase';
import { getAuth,  onAuthStateChanged } from "firebase/auth";

import { doc, getDoc, collection, setDoc, addDoc, serverTimestamp, query, where,getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import ModalLikes from './ModalLikes';


function Start() {

  const auth = getAuth(app);


  //prida pouzivatela do db uzivatelov alebo zaznam o pouzivatelovi updatuje
useEffect(() => {

  const pom = auth?.currentUser?.uid?.toString();
  

  const addToDatabase = async () =>{

    await setDoc(doc(db, "users", auth?.currentUser?.uid?.toString()), {
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoUrl: auth.currentUser.photoURL,
      uid: auth.currentUser.uid,
    });

    

    


  }
  addToDatabase()


}, []);

  return (

    <div className='bg-gray-50 h-screen overflow-y-scroll scrollbar-hide'>
        <Header/>
        <Feed/>
        <Modal />
        <ModalLikes/>
        
    </div>

  );
}

export default Start;
