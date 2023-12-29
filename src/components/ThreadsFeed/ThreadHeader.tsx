import {Link} from "react-router-dom";
import {EllipsisHorizontalCircleIcon, TrashIcon, PencilIcon} from "@heroicons/react/24/outline";
import {CheckBadgeIcon} from "@heroicons/react/24/solid";
import React from "react";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {deletePost} from "../../firebase/apiCalls";
import {useRecoilState} from "recoil";
import { postUpdateModal} from "../../atoms/modalAtom";

interface Props {
    imgSrc: any,
    uId: string,
    userName: any,
    postId?: string
    timeStamp?: Date
    edited?: boolean
}

export default function ThreadHeader({imgSrc, uId, userName, postId, timeStamp ,edited}: Props) {

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

        <div className="flex flex-row justify-start flex-1">
            {userName ? (
                <>
                    <Link
                        className=""
                        to="/Account"
                        state={{userId: uId}}
                    >
                        <p className=" font-bold text-white text-[14px]">
                            {userName}
                        </p>
                        <p className="font-normal text-white text-[12px]">location</p>
                    </Link>
                    <CheckBadgeIcon className="h-5 text-blue-500 mx-2"/>
                    <p className="text-sm text-gray-500">{edited ? "edited" : ""}</p>
                </>
            ) : (
                <div className="space-y-1">
                    <p className="rounded-md loader-2 h-[12px] w-[150px]"></p>
                    <p className="rounded-md loader-2 h-[12px] w-[75px]"></p>
                </div>
            )}
        </div>

        {auth.currentUser?.uid === uId ? (
            <div className="space-x-2 flex flex-row text-white">
                <PencilIcon onClick={handleEdit} className="h-5  cursor-pointer"/>
                <TrashIcon onClick={handleDelete} className="h-5  cursor-pointer"/>
            </div>
        ) : (
            <EllipsisHorizontalCircleIcon  className="h-5 mr-3"/>
        )}
    </div>;
}
