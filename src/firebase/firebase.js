import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCjfJcJ-ck2xFcCeSHr64JNzR44rXHTCKo",
    authDomain: "oliverminstaclone.firebaseapp.com",
    projectId: "oliverminstaclone",
    storageBucket: "oliverminstaclone.appspot.com",
    messagingSenderId: "428830385552",
    appId: "1:428830385552:web:5885668a0c4c2e7246ff15",
    measurementId: "G-MTBKE4CRDW"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp;
  const db = getFirestore();
  const storage = getStorage();

  export { app, db, storage };