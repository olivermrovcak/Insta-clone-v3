import React, {Fragment, useRef, useState, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {modalStateLikes, postId} from '../../atoms/modalAtom';
import {Dialog, Transition} from "@headlessui/react"
import {Link} from "react-router-dom";

import {db} from "../../firebase/firebase";
import {getAuth} from "firebase/auth";
import {app} from '../../firebase/firebase';
import {addDoc, collection, query, getDocs, onSnapshot, orderBy, doc, getDoc} from 'firebase/firestore';

function ModalLikes() {

    const auth = getAuth(app);
    const [openLikesWindow, setOpenLikesWindow] = useRecoilState(modalStateLikes);
    const [post, setPost] = useRecoilState(postId)
    const [whoLiked, setWhoLiked] = useState([]);
    const [allUsers, setAllUsers] = useState([])


    //nastavi do allUsers vsetkych pouzivatelov z databazy
    useEffect(() => {

        const getAllUsers = async () => {


            setAllUsers([]);
            const p = query(collection(db, "users"));

            const querySnapshots = await getDocs(p);
            querySnapshots.forEach((doc) => {

                setAllUsers(allUsers => [...allUsers, doc.data()])

            });

        }
        getAllUsers()

    }, [db])


    //nastavi do const whoLiked id tych ktory post likli
    useEffect(() => {

        if (post) {

            const getUsersWhoLiked = async () => {


                setWhoLiked([]);
                const q = query(collection(db, "posts", post.toString(), "likes"));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    setWhoLiked(whoLiked => [...whoLiked, doc.id])
                });
            }
            getUsersWhoLiked()
        }
    }, [post])

    return (
        <Transition.Root show={openLikesWindow} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-10 inset-0 overflow-y-auto"
                onClose={setOpenLikesWindow}
            >
                <div
                    className='flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave="ease-in duration-200"
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'

                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50
                     transition-opacity"/>

                    </Transition.Child>
                    <span className='hidden sm:inline-block sm:align-middle sm:h-screen'
                          aria-hidden="true"
                    >
                    &#8203;
                </span>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                        enterTo='opacity-40 translate-y-0 sm:scale-100'
                        leave="ease-in duration-200"
                        leaveFrom='opacity-100 translate-y-0 sm:scale-95'
                        leaveTo='opacity-0'

                    >
                        <div className='inline-block align-bottom bg-white
                    rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl
                    transform transition-all sm:my-7 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
                            <div>


                                {allUsers.map((user, index) => (

                                    <div className='mb-3' key={index}>
                                        {whoLiked.some(animal => animal === user.uid) ? (
                                            <div className='w-full flex flex-row items-center justify-start'>
                                                <img
                                                    className='w-10 h-10 rounded-full mr-5 '
                                                    src={user.photoUrl}
                                                />

                                                <Link
                                                    className='flex-1'
                                                    to='/Account'
                                                    state={{userId: user.uid}}
                                                >
                                                    <p className='flex-1'>{user.name}</p>
                                                </Link>

                                                {user.uid === auth.currentUser.uid ? "" : <button
                                                    className='bg-blue-500 hover:bg-blue-600 text-white  py-1 px-4 rounded'>sledovať</button>}

                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>

                                ))}


                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>

        </Transition.Root>
    )
}

export default ModalLikes;
