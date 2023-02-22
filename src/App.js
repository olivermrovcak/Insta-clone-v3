import { Routes, Route, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import react, { useState, useEffect } from "react";
import SignIn from "./components/SignIn/SignIn";

import Main from "./components/Main";
import AccoutPage from "./components/Account/AccountPage";


import {app} from './firebase/firebase';
import { getAuth,  onAuthStateChanged } from "firebase/auth";

import { doc, getDoc, collection, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/firebase';
import { Snapshot } from 'recoil';

function App() {

const [isUserSignedIn, setIsUserSignedIn] = useState(false);
const auth = getAuth(app);




useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsUserSignedIn(true);
      
      
      
    } else {
      setIsUserSignedIn(false);
    }
  });
  return onAuthStateChanged
}, []);


  return (
    <BrowserRouter>
    <Routes>

      {isUserSignedIn ? (
        <>
        <Route path="/" element={<Main/>} />

        <Route path="Account" element={<AccoutPage/>} />
     
        </>
      ): (
        <Route path="/" element={<SignIn />} />
      )}
      
    
    </Routes>
  </BrowserRouter>
  );

} 

export default App;
