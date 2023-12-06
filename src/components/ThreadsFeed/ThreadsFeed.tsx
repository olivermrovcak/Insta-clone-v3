import React from 'react';
import MiniProfile from '../Nav/MiniProfile';
import Suggestions from '../SideBar/Suggestions';
import SidebarInfo from "../SideBar/SidebarInfo";

function ThreadsFeed() {
    return (

        <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-4xl mx-auto `}>
            {/*LEFT SECTION*/}

            {/*RIGHT SECTION*/}
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

export default ThreadsFeed;
