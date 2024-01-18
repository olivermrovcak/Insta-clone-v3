import React from 'react';
import Threads from "./Threads";
import ThreadOverview from "./ThreadOverview";
import {useRecoilState} from "recoil";
import {threadOverview} from "../../atoms/modalAtom";

function ThreadsFeed() {

    const [openedThread,] = useRecoilState(threadOverview);

    return (
        <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-4xl mx-auto `}>
            <section className='col-span-3 '>
                {openedThread?.opened ? <ThreadOverview/> : <Threads/>}
            </section>
        </main>
    )
}

export default ThreadsFeed;
