import React, {useRef, useState} from 'react'
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {GifIcon, PhotoIcon, FaceSmileIcon} from "@heroicons/react/24/outline";
import {addCommentToThread} from "../../firebase/apiCalls";
import {useNavigate} from "react-router-dom";
import {CheckBadgeIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import {MenuItem} from "@material-tailwind/react";
import ElipsisMenu from "./ElipsisMenu";
import {useRecoilState} from "recoil";
import {loadingState} from "../../atoms/modalAtom";
import {ErrorToast} from "../../utils/ToastUtils";

interface props {
    threadId: string
    refresh: () => void
}

function ThreadAddComment({threadId, refresh}: props) {

    const auth = getAuth(app as any);
    const navigate = useNavigate();
    const textRef = useRef(null);
    const [isLoading,setIsLoading] = useRecoilState(loadingState)

    function handleUploadComment() {
        if (isLoading || textRef.current.innerText === "" || textRef.current.innerText.length > 300) {
            ErrorToast("Komentár nesmie byť dlhší než 300 znakov");
        };
        setIsLoading(true);

        addCommentToThread(threadId, textRef.current.innerText).then((response) => {
            refresh();
            textRef.current.innerText = "";
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <div
            className="w-full  flex flex-col ">
                    <div
                        className="text-white cursor-pointer transition-all
             border-b  border-b-gray-200 border-opacity-20  flex flex-row w-full py-2">
                        <div className="min-h-full flex flex-col items-center !w-16 ">
                            <img className="rounded-full h-[32px] w-[32px] object-contain" src={auth.currentUser.photoURL} alt=""/>
                            <div className="w-[1px]  border-r-2 border-r-gray-400 border-opacity-30 my-2 min-h-[20px] h-full"></div>
                            <div className="relative ">
                                <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                                     src={auth.currentUser.photoURL} alt=""/>
                                <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                                     src={auth.currentUser.photoURL} alt=""/>
                            </div>
                        </div>
                        <div className="w-full pl-3 min-h-[100px] h-[100%] flex flex-col items-start justify-start space-y-2">
                            <div className="flex flex-row items-center w-full">
                                <p className="font-bold text-[14px]">{auth.currentUser.displayName}</p>
                                <CheckBadgeIcon className="h-5 text-blue-500 mx-2 mr-auto"/>
                            </div>
                            <p className="text-sm text-white sm:max-w-[380px] max-w-[300px]
                               cursor-text focus:right-0 focus:border-0 text-left focus:outline-0 editableContent"
                               data-placeholder="Začnite vlákno..."
                               tabIndex={-1}
                               contentEditable={true}
                               ref={textRef}
                            >
                            </p>
                            <button onClick={() => handleUploadComment()} className="bg-white ml-auto hover:bg-gray-200 text-black font-bold text-[14px] px-4  py-1 rounded-xl ">
                                Uverejniť
                            </button>
                        </div>
                    </div>
        </div>
    )
}

export default ThreadAddComment
