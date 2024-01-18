import React from 'react';
import {useRecoilState} from "recoil";
import {loadingState} from "../../atoms/modalAtom";
import {LinearProgress} from "@mui/material";
import ThreadsFeed from "./ThreadsFeed";
import ThreadsMenu from "./ThreadsHeader";

function ThreadsMain() {

    const [isLoading,] = useRecoilState(loadingState)

    return (
        <div className='bg-[#0f0f0f] h-screen overflow-y-scroll scrollbar-hide flex flex-col items-start !relative transition-all duration-300 '>
            {isLoading && <LinearProgress className="!fixed !top-0 !w-screen !z-[1000] rainbow-linear-progress" color="inherit"/>}
            <ThreadsMenu/>
            <ThreadsFeed/>
        </div>
    );
}

export default ThreadsMain;
