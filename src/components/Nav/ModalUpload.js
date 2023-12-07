import React, {Fragment, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import {modalStateAdd} from '../../atoms/modalAtom';
import {Dialog, Transition} from "@headlessui/react"
import {getAuth} from "firebase/auth";
import {app} from '../../firebase/firebase';
import {serverTimestamp} from 'firebase/firestore';
import {uploadPost} from "../../firebase/apiCalls";

function ModalUpload() {
    const auth = getAuth(app);
    const [open, setOpen] = useRecoilState(modalStateAdd);
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const captionRef = useRef(null);
    const [loading, setLoading] = useState(null);

    //uploadne post 
    const handleUploadPost = async () => {
        if (loading) return;
        setLoading(true);

        const post = {
            caption: captionRef.current.value,
            username: auth.currentUser.displayName,
            timestamp: serverTimestamp(),
            uid: auth.currentUser.uid,
            profileImg: auth.currentUser.photoURL,
            fileToUpload: selectedFile
        }

        await uploadPost(post).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        })

        setOpen(false);
        setLoading(false);
        setSelectedFile(null);
    }
    //prida obrazok k postu
    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        }
    }

    return (<Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed z-1000 inset-0 overflow-y-auto"
                onClose={setOpen}
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
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"/>

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
                        enterTo='opacity-100 translate-y-0 sm:scale-100'
                        leave="ease-in duration-200"
                        leaveFrom='opacity-100 translate-y-0 sm:scale-95'
                        leaveTo='opacity-0'
                    >
                        <div className=' z-100 inline-block align-bottom  bg-white max-w-xl w-[100%] md:w-[70%]
                    rounded-lg  pb-4 text-left overflow-hidden shadow-xl
                    transform transition-all  sm:align-middle  absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] '>
                            <div className='flex items-center flex-col'>
                                <div className='w-full h-10 border flex items-center justify-center '>
                                    <p className='font-semibold'>Vytvorit nový príspevok</p>
                                </div>
                                <div className='flex flex-col items-center'>
                                    {selectedFile ? (<img className=' cursor-pointer w-[50%]'
                                                          src={selectedFile}
                                                          onClick={() => setSelectedFile(null)}
                                                          alt=""/>) : (
                                        <button onClick={() => filePickerRef.current.click()}
                                                class="bg-blue-500 mt-3 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                            Vybrať zo zariadenia
                                        </button>)}
                                    <div>
                                        <div className='mt-3 text-center sm:mt-5'>
                                        </div>
                                        <div>
                                            <input
                                                ref={filePickerRef}
                                                type="file"
                                                hidden
                                                onChange={addImageToPost}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <input className='border-none focus:ring-0 w-full text-center'
                                                   placeholder='Zadaj popis...' type="text"
                                                   ref={captionRef}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-5 sm:mt-6'>
                                    <button
                                        disabled={!selectedFile}
                                        onClick={handleUploadPost}
                                        type='button'
                                        className="inline-flex justify-center w-32 rounded-md border shadow-sm
                                        px-4 py-2  text-base font-medium text-black hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm 
                                        disabled:cursor-not-allowed "
                                    >
                                        {loading ? "Posting..." : "Post"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>

        </Transition.Root>)
}

export default ModalUpload;
