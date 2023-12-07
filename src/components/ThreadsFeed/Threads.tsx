import React, {useEffect, useState} from 'react';
import {getFollowingThreads} from '../../firebase/apiCalls';
import {Thread as ThreadType} from "../../utils/types/Thread";
import Thread from "./Thread";
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {PaperClipIcon} from "@heroicons/react/outline";
import AddThread from "./AddThread";

function Threads() {

    const [threads, setThreads] = useState<ThreadType[]>([]);
    const auth = getAuth(app as any);

    async function getThreads() {
        try {
            const response = await getFollowingThreads();
            setThreads(response.data);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    }

    useEffect(() => {
        const mockedThreads: ThreadType[] = [
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan, augue quis eleifend dignissim, purus felis tempus massa, sit amet consectetur erat magna at odio. Pellentesque molestie, diam faucibus scelerisque porta, nisl mauris cursus turpis, vitae maximus nisl mauris id sem. Morbi egestas magna eget est auctor pulvinar. Suspendisse potenti. Aenean gravida, lacus ut pulvinar scelerisque, nisi est vehicula ex, vel fringilla nibh tellus nec sem. Ut imperdiet lectus accumsan nibh convallis, eget posuere sem commodo. Praesent quis est ante. Aliquam facilisis dignissim neque, sit amet feugiat est mollis quis. Nam in mauris interdum, tristique felis sit amet, vulputate lorem.",
                uid: "1",
                userName: "John",
                timeStamp: "1",
                attachment: "https://firebasestorage.googleapis.com/v0/b/oliverminstaclone.appspot.com/o/posts%2FElJCD9ObsjL2Vzyz0WoM%2Fimage?alt=media&token=12801e68-ab55-4913-8dd6-2dfbc3c4888f"
            },
            {
                text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed eget tellus a ligula fermentum fringilla. Nulla facilisi.",
                uid: "2",
                userName: "Alice",
                timeStamp: "2",
                attachment: ""
            },
            {
                text: "Duis bibendum metus non leo gravida, vel convallis sem laoreet. Integer ultrices massa et velit tristique, nec tincidunt velit fermentum.",
                uid: "3",
                userName: "Bob",
                timeStamp: "3",
                attachment: ""
            },
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras accumsan, augue quis eleifend dignissim, purus felis tempus massa, sit amet consectetur erat magna at odio. Pellentesque molestie, diam faucibus scelerisque porta, nisl mauris cursus turpis, vitae maximus nisl mauris id sem. Morbi egestas magna eget est auctor pulvinar. Suspendisse potenti. Aenean gravida, lacus ut pulvinar scelerisque, nisi est vehicula ex, vel fringilla nibh tellus nec sem. Ut imperdiet lectus accumsan nibh convallis, eget posuere sem commodo. Praesent quis est ante. Aliquam facilisis dignissim neque, sit amet feugiat est mollis quis. Nam in mauris interdum, tristique felis sit amet, vulputate lorem.",
                uid: "1",
                userName: "John",
                timeStamp: "1",
                attachment: ""
            },
            {
                text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed eget tellus a ligula fermentum fringilla. Nulla facilisi.",
                uid: "2",
                userName: "Alice",
                timeStamp: "2",
                attachment: ""
            },
            {
                text: "Duis bibendum metus non leo gravida, vel convallis sem laoreet. Integer ultrices massa et velit tristique, nec tincidunt velit fermentum.",
                uid: "3",
                userName: "Bob",
                timeStamp: "3",
                attachment: ""
            }
        ]
        setThreads(mockedThreads)
    }, []);

    return (
        <div className="max-w-[470px] my-7 space-y-5">

            <AddThread/>

            {threads.map((thread) => (
                <Thread
                    key={thread.uid}
                    uid={thread.uid}
                    text={thread.text}
                    userName={thread.userName}
                    timeStamp={thread.timeStamp}
                    attachment={thread.attachment}
                />
            ))}
        </div>
    )
}

export default Threads;