import React from 'react'
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {uploadThread} from "../../firebase/apiCalls";
import {useRecoilState} from "recoil";
import {threadAddModal} from "../../atoms/modalAtom";

function AddThread() {

    const auth = getAuth(app as any);
    const [text, setText] = React.useState<string>("");
    //threadAddModal
    const [openedThread, setOpenedThread] = useRecoilState(threadAddModal)

    function handleOpenThreadModal() {
        setOpenedThread(true)
    }

    return (
        <div className="w-full flex flex-row justify-between items-center px-2 border-b py-5 border-b-gray-200 border-opacity-20">
            <img className="rounded-full h-[32px] w-[32px] object-contain  mr-3"
                 src={auth?.currentUser?.photoURL as string} alt=""/>
            <p onClick={handleOpenThreadModal} className=" text-gray-500  text-left w-full">Začnite vlákno...</p>
            <button className="bg-white hover:bg-gray-200 text-black font-bold text-[14px] px-4  py-1 rounded-xl ">
                Uverejniť
            </button>
        </div>
    )
}

export default AddThread
