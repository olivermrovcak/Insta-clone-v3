import React, { useEffect } from 'react'
import posts from "../Feed/Posts";
import {getAuth} from "firebase/auth";
import {app, db} from "../../firebase/firebase";
import {collection, doc, getDoc, setDoc, deleteDoc} from "firebase/firestore";

interface user {
    uid: string,
    photoUrl: string,
    name: string
}

interface props {
    user: user,
    postsCount: number,
    followersCount: number,
    followingCount: number,
}

export default function UserInformation({user, postsCount, followersCount, followingCount}: props) {

    const auth = getAuth(app as any);
    const [isFollowingUser, setIsFollowingUser] = React.useState<boolean>(false);

    const isFollowing = async () => {
        const followerDocRef = doc(collection(doc(db, 'users', user.uid), 'followers'), auth.currentUser.uid);
        const followingDocRef = doc(collection(doc(db, 'users', auth.currentUser.uid), 'following'), user.uid);

        const followerDocSnapshot = await getDoc(followerDocRef);
        const followingDocSnapshot = await getDoc(followingDocRef);

        return followerDocSnapshot.exists() && followingDocSnapshot.exists();
    }

    async function handleFollow() {
        const followerDocRef = doc(collection(doc(db, 'users', user.uid), 'followers'), auth.currentUser.uid);
        const followingDocRef = doc(collection(doc(db, 'users', auth.currentUser.uid), 'following'), user.uid);

        const followerDocSnapshot = await getDoc(followerDocRef);
        const followingDocSnapshot = await getDoc(followingDocRef);

        if (followerDocSnapshot.exists() && followingDocSnapshot.exists()) {
            await deleteDoc(followerDocRef).then(async () => {
                console.log("Document successfully deleted from followers!");
                await deleteDoc(followingDocRef).then(() => {
                    console.log("Document successfully deleted from following!");
                    setIsFollowingUser(false)
                });
            });
        } else {
            await setDoc(followerDocRef, {
                uid: auth.currentUser.uid,
            }).then(async () => {
                console.log("Document successfully written to followers!");
                await setDoc(followingDocRef, {
                    uid: user.uid,
                }).then(() => {
                    console.log("Document successfully written to following!");
                    setIsFollowingUser(true)
                });
            });
        }
    }

    useEffect(() => {
        const checkFollowing = async () => {
            const result = await isFollowing();
            setIsFollowingUser(result);
        }
        checkFollowing();
    }, []);

    return (
            <div className=" flex flex-row space-x-8">
                <img src={user?.photoUrl} alt="" className='w-[150px] h-[150px] rounded-full mx-auto mt-10'/>
                <div className="w-full flex flex-col justify-center items-start space-y-3">
                    <div className="flex flex-row space-x-4 items-center">
                        <h5>{user?.name}</h5>
                        {isFollowingUser ? (
                            <button onClick={() => handleFollow()} className="bg-gray-600 text-white rounded-xl px-5 py-1 ">
                                Sledované
                            </button>
                        ) : (
                            <button onClick={() => handleFollow()} className="bg-[#0095f6] text-white rounded-xl px-5 py-1 ">
                                Sledovať
                            </button>
                        )}

                    </div>
                    <div className="flex flex-row space-x-4">
                        <h6>Príspevky: {postsCount}</h6>
                        <h6>Sledovatelia: {followersCount}</h6>
                        <h6>Sledované: {followingCount}</h6>
                    </div>
                    <div className="flex flex-row">
                        <h6>{user?.name}</h6>
                    </div>
                </div>
            </div>
    )
}
