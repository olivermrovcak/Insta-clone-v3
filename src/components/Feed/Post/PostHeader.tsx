import {Link} from "react-router-dom";
import {EllipsisHorizontalCircleIcon, TrashIcon, PencilIcon} from "@heroicons/react/24/outline";
import React from "react";
import {getAuth} from "firebase/auth";
import {app} from "../../../firebase/firebase";
import {deletePost} from "../../../firebase/apiCalls";
import {useRecoilState} from "recoil";
import {modalStateAdd, postUpdateModal, reportModal} from "../../../atoms/modalAtom";
import {Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import {Bars2Icon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import ElipsisMenu from "../../ThreadsFeed/ElipsisMenu";
import {ErrorToast, SuccessToast} from "../../../utils/ToastUtils";

interface Props {
    imgSrc: any,
    uId: string,
    userName: any,
    postId?: string
    refresh?: () => void
}

export default function PostHeader({imgSrc, uId, userName, postId, refresh}: Props) {

    const auth = getAuth(app as any);
    const [editDialogOpened, setEditDialogOpened] = useRecoilState(postUpdateModal);
    const [reportModalState, setReportModalState] = useRecoilState(reportModal);

    function isOwner() {
        return auth.currentUser?.uid === uId;
    }

    function handleEdit() {
        setEditDialogOpened({
            opened: true,
            id: postId ?? ""
        });
    }

    function handleDelete() {
        deletePost(postId ?? "").then((response: any) => {
            SuccessToast("Príspevok bol vymazaný");
            refresh();
        }).catch((error: any) => {
            console.log(error);
            ErrorToast("Nepodarilo sa vymazať príspevok");
        });
    }

    function handleReportPost() {
        setReportModalState({
            opened: true,
            id: postId,
            type: "post"
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
            <ElipsisMenu handler={<EllipsisHorizontalIcon className="h-5 cursor-pointer "/>}>
                <MenuItem
                    onClick={handleReportPost}
                    className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 !rounded-b-none last:!border-b-0 "
                    onResize={undefined} onResizeCapture={undefined}>Nahlásiť</MenuItem>
                {isOwner() &&
                    <>
                        <MenuItem onClick={handleEdit}
                                  className="px-5 py-3  border-b border-b-gray-500 border-opacity-20  !rounded-b-none last:!border-b-0 "
                                  onResize={undefined} onResizeCapture={undefined}>Upraviť</MenuItem>
                        <MenuItem onClick={handleDelete}
                                  className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 text-red-600 !rounded-b-none last:!border-b-0 "
                                  onResize={undefined} onResizeCapture={undefined}>Vymazať</MenuItem>

                    </>
                }
            </ElipsisMenu>
    </div>;
}
