import {Link} from "react-router-dom";
import {EllipsisHorizontalCircleIcon, TrashIcon, PencilIcon} from "@heroicons/react/24/outline";
import React from "react";
import {getAuth} from "firebase/auth";
import {app} from "../../../firebase/firebase";
import {deletePost} from "../../../firebase/apiCalls";
import {useRecoilState} from "recoil";
import {modalStateAdd, postUpdateModal} from "../../../atoms/modalAtom";

interface Props {
    imgSrc: any,
    uId: string,
    userName: any,
    postId?: string
}

export default function PostHeader({imgSrc, uId, userName, postId}: Props) {

    const auth = getAuth(app as any);
    const [editDialogOpened, setEditDialogOpened] = useRecoilState(postUpdateModal);

    function handleEdit() {
        setEditDialogOpened({
            opened: true,
            id: postId ?? ""
        });
    }

    function handleDelete() {
        deletePost(postId ?? "").then((response: any ) =>  {
            console.log(response)
        });
    }

    return <div className="flex items-center py-2">
        {imgSrc ? (
            <img className="rounded-full h-[32px] w-[32px] object-contain  mr-3" src={imgSrc} alt=""/>
        ) : (
            <div className="rounded-full h-[32px] w-[32px] object-contain  mr-3 loader-2"></div>
        )}

        <div className="flex flex-col justify-start flex-1">
            {userName ? (
                <Link
                    className="flex-1"
                    to="/Account"
                    state={{userId: uId}}
                >
                    <p className="flex-1 font-bold text-white text-[14px]">
                        {userName}
                        <span className="text-gray-500 font-normal text-[14px]"> &#x2022; 5.týž  &#x2022;</span>
                    </p>
                    <p className="flex-1 font-normal text-white text-[12px]">location</p>
                </Link>
            ) : (
                <div className="space-y-1">
                    <p className="rounded-md loader-2 h-[12px] w-[150px]"></p>
                    <p className="rounded-md loader-2 h-[12px] w-[75px]"></p>
                </div>
            )}
        </div>

        {auth.currentUser?.uid === uId ? (
            <div className="space-x-2 flex flex-row">
                <PencilIcon onClick={handleEdit} className="h-5  cursor-pointer"/>
                <TrashIcon onClick={handleDelete} className="h-5  cursor-pointer"/>
            </div>
        ) : (
            <EllipsisHorizontalCircleIcon  className="h-5 mr-3"/>
        )}
    </div>;
}
