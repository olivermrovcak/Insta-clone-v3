import React from 'react'
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {GifIcon, PhotoIcon, FaceSmileIcon} from "@heroicons/react/24/outline";
import {addCommentToThread} from "../../firebase/apiCalls";
import {useNavigate} from "react-router-dom";

interface props {
    threadId: string
}

function ThreadAddComment({threadId}: props) {

    const auth = getAuth(app as any);
    const [text, setText] = React.useState<string>("");
    const navigate = useNavigate();

    function handleUploadComment() {
        if (text === "") {
            return;
        }
        addCommentToThread(threadId, text).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error(error)
        });
    }

    return (
        <div className="w-full border-[1px] border-t-0 border-gray-500 p-5 flex flex-col">
            <div className="w-full flex flex-row items-start ">
                <img className="rounded-full h-[32px] w-[32px] object-contain  mr-3"
                     src={auth?.currentUser?.photoURL as string} alt=""/>
                <div className="w-full overflow-x-hidden">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="bg-transparent block resize-none p-0 w-full text-2xl overflow-x-hidden break-words outline-none border-none
                            focus:ring-0 focus:outline-none focus:border-none  text-white"
                            placeholder={`What do u think, ${auth?.currentUser?.displayName?.split(" ")[0]}?`}
                        >
                        </textarea>
                </div>
            </div>
            <div className="w-full text-blue-500 flex flex-row items-center">
                <div className="w-fit space-x-3 flex-1 flex flex-row" >
                    <GifIcon className="h-6 cursor-pointer"/>
                    <PhotoIcon className="h-6 cursor-pointer"/>
                    <FaceSmileIcon className="h-6 cursor-pointer"/>
                </div>
                <button onClick={handleUploadComment} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ">
                    REPLY
                </button>
            </div>
        </div>
    )
}

export default ThreadAddComment
