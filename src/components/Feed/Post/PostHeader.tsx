import {Link} from "react-router-dom";
import {EllipsisHorizontalCircleIcon, TrashIcon, PencilIcon} from "@heroicons/react/24/outline";
import React from "react";
import {getAuth} from "firebase/auth";
import {app} from "../../../firebase/firebase";
import {deletePost} from "../../../firebase/apiCalls";
import {useRecoilState} from "recoil";
import {modalStateAdd, postUpdateModal, reportModal} from "../../../atoms/modalAtom";
import {Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import {Bars2Icon} from "@heroicons/react/24/solid";

interface Props {
    imgSrc: any,
    uId: string,
    userName: any,
    postId?: string
}

export default function PostHeader({imgSrc, uId, userName, postId}: Props) {

    const auth = getAuth(app as any);
    const [editDialogOpened, setEditDialogOpened] = useRecoilState(postUpdateModal);
    const [reportModalState, setReportModalState] = useRecoilState(reportModal);

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

    function handleReportPost() {
        setReportModalState({
            opened: true,
            id: postId
        })
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
            <Menu placement="bottom">
                <MenuHandler>
                    <EllipsisHorizontalCircleIcon className="h-5 cursor-pointer hover:scale-[110%] transition-all"/>
                </MenuHandler>
                <MenuList
                    className="!z-[101] bg-[#0f0f0f] border-gray-500 border border-opacity-20 text-white font-bold "
                    onResize={undefined} onResizeCapture={undefined}>
                    <MenuItem onClick={handleReportPost} className="hover:bg-gray-100 hover:bg-opacity-10 text  !px-4 !py-1"
                              onResize={undefined} onResizeCapture={undefined}>Nahlásiť</MenuItem>
                </MenuList>
            </Menu>
        )}
    </div>;
}
