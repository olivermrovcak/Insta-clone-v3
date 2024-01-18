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
import ThreadsActionList from "./ThreadsActionList";
import Thread from "./Thread";

export default function ThreadOverview() {

    const [thread, setThread] = useState<ThreadType>();
    const [, setIsLoading] = useRecoilState(loadingState)
    const [openedThread, setOpenedThread] = useRecoilState(threadOverview);
    const {threadId} = useParams();

    function getThread() {
        setIsLoading(true)
        getThreadById(openedThread.id).then((response) => {
            setThread(response.data);
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        getThread();
    }, [openedThread]);

    return (
        <div className="w-[98%] sm:min-w-[500px] my-7 relative ">
            <Thread
                id={openedThread?.id}
                uid={thread?.uid}
                text={thread?.text}
                userName={thread?.userName}
                timeStamp={thread?.timeStamp}
                attachment={thread?.attachment}
                user={thread?.user}
                isRepost={false}
                refresh={() => {}}
            />
            <ThreadAddComment threadId={openedThread.id} refresh={getThread}/>
            <ThreadsComments comments={thread?.comments} threadId={openedThread?.id} refresh={getThread}/>
        </div>
    )
}
