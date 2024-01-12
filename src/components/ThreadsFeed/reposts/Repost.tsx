import React, {useEffect} from 'react'
import {getUserByUid} from "../../../firebase/apiCalls";
import {getThreadById} from "../../../firebase/apiCalls";
import Thread from "../Thread";
import {ArrowPathRoundedSquareIcon} from "@heroicons/react/24/outline";

interface props {
    uid: string,
    timestamp: string,
    threadId: string,
    user: any
    thread: any
}

export default function Repost({uid, timestamp, threadId, user, thread}: props) {

    return (
        <div>
            <div className="flex flex-row text-gray-500 items-center space-x-2 pl-4">
                <ArrowPathRoundedSquareIcon className="h-6"/>
                <p className="font-bold text-sm">Reposted by {user?.name}</p>
            </div>
            {user &&
                <Thread
                    text={thread?.text}
                    uid={thread?.uid}
                    attachment={thread?.attachment}
                    id={thread?.id}
                    userName={thread?.userName}
                    user={user}
                />
            }
        </div>

    )
}

