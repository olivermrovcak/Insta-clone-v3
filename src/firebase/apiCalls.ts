import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import axios from "axios";

import {db} from '../firebase/firebase';
import { getAuth } from "firebase/auth";
import {app} from '../firebase/firebase';

const auth = getAuth(app as any);

export async function getFollowingPosts() {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.get("https://us-central1-oliverminstaclone.cloudfunctions.net/getAllPosts", {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

export async function getDataFromFirebase(path: string) {
    const postsCol = collection(db, path);
    const postsSnapshot = await getDocs(postsCol);
    return postsSnapshot.docs.map(doc => doc.data());
}

export async function getFollowersIds(userId: string) {
    const postsCol = collection(db, 'users/' + userId + '/followers' );
    const postsSnapshot = await getDocs(postsCol);
    const retVal = postsSnapshot.docs.map(doc => doc.data().uid);
    return retVal;
}

export async function getFollowersProfiles(userId: string) {
    const followersCol = collection(db, 'users/' + userId + '/followers');
    const followersSnapshot = await getDocs(followersCol);
    const profilePromises = followersSnapshot.docs.map(async doc => {
        const profile = await getProfile(doc.data().uid);
        return profile;
    });
    const profiles = await Promise.all(profilePromises);
    return profiles;
}

export async function getProfile(userId: string) {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
        return userDocSnapshot.data();
    } else {
        return null; // User document does not exist
    }
}

export async function getFollowersCount(userId: string) {
    const followersCol = collection(db, 'users/' + userId + '/followers');
    const followersSnapshot = await getDocs(followersCol);
    const followersCount = followersSnapshot.docs.length;
    return followersCount;
}

export async function getFollowingCount(userId: string) {
    const followingCol = collection(db, 'users/' + userId + '/following');
    const followingSnapshot = await getDocs(followingCol);
    const followingCount = followingSnapshot.docs.length;
    return followingCount;
}

export async function getPosts() {
    const path = 'posts';
    return getDataFromFirebase(path);
}