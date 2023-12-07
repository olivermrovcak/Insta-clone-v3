import React from 'react'
import {PaperClipIcon} from "@heroicons/react/outline";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";

function AddThread() {

    const auth = getAuth(app as any);

    return (
        <div className="text-white border border-1 border-gray-200 rounded-2xl flex flex-col w-full items-center p-3">
            <div className="w-full flex flex-row items-start ">
                <img className="rounded-full h-[32px] w-[32px] object-contain  mr-3" src={auth?.currentUser?.photoURL as string} alt=""/>
                <div className="w-full overflow-x-hidden">
                        <textarea
                            className="bg-transparent block resize-none p-0 w-full text-2xl overflow-x-hidden break-words outline-none border-none
                            focus:ring-0 focus:outline-none focus:border-none  text-white"
                            placeholder={`What's happening, ${auth?.currentUser?.displayName?.split(" ")[0]}?`  }
                        >
                        </textarea>
                </div>
            </div>
            <div className="border border-0 border-b-[1px] w-full my-4 border-[#333333]"></div>
            <div className="w-full flex justify-between items-center px-2">
                <PaperClipIcon className="h-6 w-6 mr-2 text-blue-500 cursor-pointer"/>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ">
                    POST
                </button>
            </div>
        </div>
    )
}

export default AddThread
