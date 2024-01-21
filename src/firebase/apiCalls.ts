import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import axios from "axios";

import {db} from '../firebase/firebase';
import {getAuth} from "firebase/auth";
import {app} from '../firebase/firebase';
import {Post} from "../utils/types/Post";
import {Thread} from "../utils/types/Thread";

const auth = getAuth(app as any);

const devUrl = "https://us-central1-oliverminstaclone.cloudfunctions.net";
const prodUrl = "https://us-central1-oliverminstaclone.cloudfunctions.net";

export async function getUserByUid(uid: string) {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/getUserByUid", {
        uid: uid
    }, {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

export async function isUserAdmin(uid: string) {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/isUserAdmin", {
        uid: uid
    }, {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

export async function getFollowingPosts() {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.get(devUrl + "/getAllPostsFollowing", {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

export async function getAllPosts() {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.get(devUrl + "/getAllPosts", {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

//getPost
export async function getPostById(postId: string) {
    return axios.post(devUrl + "/getPost", {postId});
}

export async function getFollowingThreads() {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.get(devUrl + "/getAllPosts", {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

export async function uploadPost({uid, username, caption, profileImg, fileToUpload}: Post) {
    const data = {
        uid: uid,
        username: username,
        caption: caption,
        profileImg: profileImg,
        selectedFile: fileToUpload, // This should be a base64-encoded string
    };
    return axios.post(devUrl + "/uploadPost", data);
};

export async function updatePost(postId: string, caption: string) {
    console.log("updatePost", postId, caption);
    const data = {
        postId: postId,
        caption: caption,
    };
    return axios.post(devUrl + '/updatePost', data);
};

export async function deletePost(postId: string) {
    try {
        const response = await axios({
            method: 'delete',
            url: devUrl + '/deletePost',
            data: {
                postId: postId
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error deleting post', error);
    }
}

export async function getAllThreads() {
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.get(devUrl + "/getAllThreadsFollowing", {
        headers: {
            'Authorization': idToken ?? "",
        }
    })
}

export async function getThreadById(threadId: string) {
    const data = {
        threadId: threadId,
    };
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/getThreadById", data, {
        headers: {
            'Authorization': idToken ?? "",
        }
    });
}

export async function addCommentToThread(threadId: string, comment: string) {
    const data = {
        threadId: threadId,
        comment: comment,
        uid: auth.currentUser?.uid,
    };
    return axios.post(devUrl + "/addCommentToThread", data);
}

export async function deleteCommentFromThread(threadId: string, commentId: string) {
    const data = {
        threadId: threadId,
        commentId: commentId,
    };
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/deleteCommentFromThread", data, {
        headers: {
            'Authorization': idToken ?? "",
        }
    });
}

export async function updateCommentInThread(threadId: string, commentId: string, newText: string) {
    const data = {
        threadId: threadId,
        commentId: commentId,
        newText: newText,
    };
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/updateCommentInThread", data, {
        headers: {
            'Authorization': idToken ?? "",
        }
    });
}

export async function uploadThread({uid, text, attachment}: Thread) {
    const idToken = await auth?.currentUser?.getIdToken(true);
    const data = {
        uid: uid,
        text: text,
        attachment: attachment,
    };
    return axios.post(devUrl + "/uploadThread", data, {
        headers: {
            'Authorization': idToken ?? "",
        }
    });
}

export async function deleteThread(threadId) {
    const data = {
        threadId: threadId,
    };
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/deleteThread", data, {
        headers: {
            'Authorization': idToken ?? "",
        }
    });
}

export async function likeThread(threadId: string) {
    const data = {
        threadId: threadId,
        uid: auth.currentUser?.uid,
    };
    return axios.post(devUrl + "/likeThread", data);
}

export async function unlikeThread(threadId: string) {
    const data = {
        threadId: threadId,
        uid: auth.currentUser?.uid,
    };
    return axios.post(devUrl + "/unlikeThread", data);
}

export async function hasLiked(threadId: string) {
    const data = {
        threadId: threadId,
        uid: auth.currentUser?.uid,
    };

    return axios.post(devUrl + "/hasUserLikedThread", data);
}

export async function repostThread(threadId: string) {
    const data = {
        threadId: threadId,
        uid: auth.currentUser?.uid,
    };
    return axios.post(devUrl + "/repostThread", data);
}

export async function deleteRepostedThread(repostId: string) {
    const data = {
        repostId: repostId,
    };
    const idToken = await auth?.currentUser?.getIdToken(true);
    return axios.post(devUrl + "/deleteRepostedThread", data, {
        headers: {
            'Authorization': idToken ?? "",
        }
    });
}

export async function getDataFromFirebase(path: string) {
    const postsCol = collection(db, path);
    const postsSnapshot = await getDocs(postsCol);
    return postsSnapshot.docs.map(doc => doc.data());
}

export async function getRawDataFromFirebase(path: string) {
    const postsCol = collection(db, path);
    const postsSnapshot = await getDocs(postsCol);
    return postsSnapshot.docs.map(doc => doc);
}

export async function getFollowersIds(userId: string) {
    const postsCol = collection(db, 'users/' + userId + '/followers');
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

export async function getPost(postId: string) {
    const userDocRef = doc(db, 'posts', postId);
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