import React, {useEffect, useState} from 'react';
import {Thread as ThreadType} from "../../utils/types/Thread";
import {useRecoilState} from "recoil";
import {loadingState, threadOverview} from "../../atoms/modalAtom";
import {getThreadById, getUserByUid} from "../../firebase/apiCalls";
import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import ThreadHeader from "./ThreadHeader";
import ThreadsComments from "./ThreadsComments";
import ThreadAddComment from "./ThreadAddComment";
import {useParams} from "react-router";
import AttachmentRender from "./AttachmentRender";

export default function ThreadOverview() {

    const [thread, setThread] = useState<ThreadType>();
    const [, setIsLoading] = useRecoilState(loadingState)
    const [openedThread, setOpenedThread] = useRecoilState(threadOverview);
    const [user, setUser] = useState<any>(null);
    const {threadId} = useParams();

    function handleGoBack() {
        setOpenedThread({opened: false, id: "", uid: ""})
    }

    useEffect(() => {
        setIsLoading(true)
        getThreadById(threadId).then((response) => {
            setThread(response.data);
            getUserByUid(response.data.uid).then((response) => {
                setUser(response.data)
            }).catch((error) => {
                console.error(error)
            });
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsLoading(false);
        });
    }, [threadId]);

    return (
        <div className="w-full sm:min-w-[500px] my-7 relative">
            <div className="w-full py-3 text-white sticky flex flex-row items-center space-x-3">
                <div onClick={handleGoBack}
                     className="border hover:bg-opacity-10 hover:bg-gray-200 transition-all border-gray-500 w-fit p-3 cursor-pointer rounded-full flex items-center justify-center">
                    <ArrowLeftIcon className="h-5 text-white"/>
                </div>
                <h1 className="font-bold text-2xl">Thread</h1>
            </div>
            <div className="w-full border-gray-500  border-[1px] rounded-tr-md rounded-tl-md  p-4">
                <ThreadHeader
                    imgSrc={user?.photoUrl}
                    uId={"GSDFSDFDS"}
                    userName={user?.name}
                    timeStamp={thread?.timeStamp}
                />
                <div className="text-2xl text-white">
                    {thread?.text}
                </div>
                <div className="w-full  py-4 ">
                   <AttachmentRender url={thread?.attachment}/>
                </div>
                <p className="text-gray-500 text-sm hover:underline cursor-pointer w-fit">
                    1:13 AM · Dec 19, 2023
                </p>
            </div>
            <ThreadAddComment threadId={threadId}/>
            <ThreadsComments comments={thread?.comments}/>
        </div>
    )
}
