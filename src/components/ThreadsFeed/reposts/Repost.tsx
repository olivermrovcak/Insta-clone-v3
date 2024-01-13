import React from 'react'
import Thread from "../Thread";
import {ArrowPathRoundedSquareIcon} from "@heroicons/react/24/outline";

interface props {
    id: string,
    uid: string,
    timestamp: string,
    threadId: string,
    user: any,
    thread: any,
}

export default function Repost({user, thread, threadId, id}: props) {

    return (
        <div>
            <div className="flex flex-row text-gray-500 items-center space-x-2 pl-4">
                <ArrowPathRoundedSquareIcon className="h-6"/>
                <p className="font-bold text-sm">Reposted by {user?.name}</p>
            </div>
            {(user && thread) &&
                <Thread
                    text={thread?.text}
                    uid={thread?.uid}
                    attachment={thread?.attachment}
                    id={threadId}
                    userName={thread?.userName}
                    user={user}
                    isRepost={true}
                    repostId={id}
                />
            }
        </div>
    )
}

