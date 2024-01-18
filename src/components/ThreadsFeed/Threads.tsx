import React, {useEffect, useState} from 'react';
import {getAllThreads, getFollowingThreads} from '../../firebase/apiCalls';
import {Thread as ThreadType} from "../../utils/types/Thread";
import Thread from "./Thread";
import AddThread from "./AddThread";
import {useRecoilState} from "recoil";
import {loadingState, threadOverview} from "../../atoms/modalAtom";
import AddThreadModal from "./AddThreadModal";
import Repost from "./reposts/Repost";

function Threads() {

    const [threads, setThreads] = useState<any>([]);
    const [, setIsLoading] = useRecoilState(loadingState)
    const [openedThread, setOpenedThread] = useRecoilState(threadOverview);

    async function getThreads() {
        try {
            setIsLoading(true);
            await getAllThreads().then((response) => {
                setThreads(response.data);
                console.log(response.data)
            }).catch((error) => {
                console.error(error)
            }).finally(() => {
                setIsLoading(false);
            });
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    }

    useEffect(() => {
        getThreads();
    }, []);

    return (
        <div className="max-w-[470px] my-7 p-2 sm:p-0 space-y-5">
            <AddThread/>
            {threads?.map((thread) => {
                if (thread.text) {
                    return (
                        <Thread
                            id={thread?.id}
                            key={thread?.uid + thread?.id}
                            uid={thread?.uid}
                            text={thread?.text}
                            userName={thread?.userName}
                            timeStamp={thread?.timeStamp}
                            attachment={thread?.attachment}
                            user={thread?.user}
                            isRepost={false}
                            refresh={getThreads}
                        />
                    )
                } else {
                    return (
                        <Repost
                            key={thread?.uid + thread?.id}
                            uid={thread?.uid}
                            timestamp={thread?.timeStamp}
                            threadId={thread?.threadId}
                            user={thread?.user}
                            thread={thread?.thread}
                            id={thread?.id}
                        />
                    )
                }
            })}
            <AddThreadModal refresh={getThreads}/>
        </div>
    )
}

export default Threads;