import React from 'react';
import Stories from './Stories';
import Posts from './Posts';
import MiniProfile from '../Nav/MiniProfile';
import Suggestions from '../SideBar/Suggestions';
import SidebarInfo from "../SideBar/SidebarInfo";
import FeedSelector from "./FeedSelector";

function Feed() {

    return (
        <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-4xl mx-auto `}>
            <section className='col-span-2 p-3 sm:p-0'>
                <FeedSelector/>
                <Stories/>
                <Posts/>
            </section>
            <section className='hidden xl:inline-grid md:col-span-1'>
                <div className=' '>
                    <MiniProfile/>
                    <Suggestions/>
                    <SidebarInfo/>
                </div>
            </section>
        </main>
    )
}

export default Feed;
