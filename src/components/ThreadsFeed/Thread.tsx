import React from 'react'
import {Thread as ThreadType} from "../../utils/types/Thread";
import {useRecoilState} from "recoil";
import {threadOverview} from "../../atoms/modalAtom";
import {useNavigate} from "react-router-dom";
import {Bars2Icon, CheckBadgeIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import AttachmentRender from "./AttachmentRender";
import ThreadsActionList from "./ThreadsActionList";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {Menu, MenuHandler, MenuItem, MenuList} from "@material-tailwind/react";
import {deleteRepostedThread, deleteThread} from "../../firebase/apiCalls";
import {SuccessToast} from "../../utils/ToastUtils";
import ElipsisMenu from "./ElipsisMenu";
import {reportThread} from "../../firebase/report";

interface props {
    uid: string,
    text: string,
    userName?: string,
    timeStamp?: string,
    attachment?: string,
    id: string,
    user: any,
    isRepost?: boolean
    repostId?: string
    refresh?: () => void
}

function Thread({uid, text, timeStamp, attachment, id, user, isRepost, repostId, refresh}: props) {

    const [, setOpenedThread] = useRecoilState(threadOverview);
    const navigate = useNavigate();
    const auth = getAuth(app as any);

    function handleSetOpenedThread() {
        setOpenedThread({opened: true, id: id, uid: uid})
    }

    function handleDeleteThread() {
        if (isRepost) {
            deleteRepostedThread(repostId).then((response: any) => {
                console.log(response)
                SuccessToast("Repost vymazaný");
                handleRefresh();
            }).catch((error: any) => {
                console.log(error)
            });
        } else {
            deleteThread(id).then((response: any) => {
                console.log(response)
                SuccessToast("Thread vymazaný");
                handleRefresh();
            }).catch((error: any) => {
                console.log(error)
            });
        }
    }

    function handleRefresh() {
        if (refresh) {
            refresh();
        }
    }

    function isOwner() {
        return auth.currentUser?.uid === uid;
    }

    function handleReport() {
        reportThread("gg", id).then((response: any) => {
            console.log(response)
        }).catch((error: any) => {

        })
    }

    return (
        <div
            className="text-white cursor-pointer transition-all
             border-b  border-b-gray-200 border-opacity-20  flex flex-row w-full py-2 overflow-x-hidden max-w-[470px]">
            <div className="min-h-full flex flex-col items-center  min-w-16 ">
                {user?.photoUrl ? (
                    <img className="rounded-full h-[32px] w-[32px] object-contain" src={user?.photoUrl} alt=""/>
                ) : (
                    <div className="rounded-full h-[32px] w-[32px] object-contain  loader-2"></div>
                )}
                <div className="w-[1px]  border-r-2 border-r-gray-400 border-opacity-30 my-2 min-h-[20px] h-full"></div>
                <div className="relative ">
                    <img onClick={handleSetOpenedThread} className="rounded-full h-4 object-contain"
                         src={user?.photoUrl} alt=""/>
                    <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                         src={user?.photoUrl} alt=""/>
                </div>
            </div>
            <div className="w-full pl-3 min-h-[100px] h-[100%] flex flex-col items-start justify-between">
                <div className="flex flex-row items-center w-full">
                    <p className="font-bold text-[14px]">{user?.name}</p>
                    <CheckBadgeIcon className="h-5 text-blue-500 mx-2 mr-auto"/>
                    <ElipsisMenu handler={<EllipsisHorizontalIcon className="h-5 "/>}>
                        <MenuItem
                            onClick={handleReport}
                            className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 !rounded-b-none last:!border-b-0 "
                            onResize={undefined} onResizeCapture={undefined}>Nahlásiť</MenuItem>
                        {isOwner() &&
                            <MenuItem onClick={handleDeleteThread}
                                      className="px-5 py-3  border-b border-b-gray-500 border-opacity-20 text-red-600 !rounded-b-none last:!border-b-0 "
                                      onResize={undefined} onResizeCapture={undefined}>Vymazať</MenuItem>
                        }
                    </ElipsisMenu>
                </div>
                <p onClick={handleSetOpenedThread} className="text-sm text-white w-[80%] break-words ">{text}</p>
                {attachment &&
                    <AttachmentRender url={attachment}/>
                }
                <ThreadsActionList openThread={() => handleSetOpenedThread()} threadId={id}/>
                <p className="text-gray-500 text-sm hover:underline cursor-pointer w-fit justify-self-end">
                    1:13 AM · Dec 19, 2023
                </p>
            </div>
        </div>
    )
}

export default Thread

