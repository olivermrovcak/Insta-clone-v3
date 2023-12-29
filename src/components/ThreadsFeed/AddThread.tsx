import React from 'react'
import {PaperClipIcon} from "@heroicons/react/24/outline";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {uploadThread} from "../../firebase/apiCalls";
import {useRecoilState} from "recoil";
import {postDataForModal, threadAddModal} from "../../atoms/modalAtom";

function AddThread() {

    const auth = getAuth(app as any);
    const [text, setText] = React.useState<string>("");
    //threadAddModal
    const [openedThread, setOpenedThread] = useRecoilState(threadAddModal)

    function handleAddThread() {
        if (text === "") {
            return;
        }
        const thread = {
            uid: auth.currentUser?.uid,
            userName: auth.currentUser?.displayName,
            text: text,
            attachment: "",
        }
        uploadThread(thread).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.error(error)
        });
    }

    function handleOpenThreadModal() {
        setOpenedThread(true)
    }

    return (
        <div className="w-full flex flex-row justify-between items-center px-2 border-b py-5 border-b-gray-200 border-opacity-20">
            <img className="rounded-full h-[32px] w-[32px] object-contain  mr-3"
                 src={auth?.currentUser?.photoURL as string} alt=""/>
            <p onClick={handleOpenThreadModal} className=" text-stone-500 text-left w-full">Začnite vlákno...</p>
            <button onClick={handleAddThread} className="bg-white hover:bg-gray-200 text-black font-bold text-[14px] px-4  py-1 rounded-xl ">
                Uverejniť
            </button>
        </div>
    )
}

export default AddThread
