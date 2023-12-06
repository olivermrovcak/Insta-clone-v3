import React, {useState, useEffect, useRef} from 'react';
import {
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    PlusSmIcon, SearchIcon,
    AtSymbolIcon
} from "@heroicons/react/outline";
import {
    HomeIcon
} from "@heroicons/react/outline";
import {useRecoilState} from 'recoil';
import MenuItem from "./MenuItem";
import {FilmIcon, PlusCircleIcon, StopIcon} from "@heroicons/react/solid";


function Header() {

    return (
        <nav
            className='shadow-sm border-r p-[12px]  border-[#a1a1a1] border-opacity-25 bg-black sticky  top-0 z-50 shrink  flex flex-col h-screen w-[245px] '>

            {/* LOGO */}
            <div className="p-[16px] mb-[16px]">
                <img className='object-contain invert w-[106px]'
                     src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1600px-Instagram_logo.svg.png'/>
            </div>

            {/* NAV */}

            <ul className="flex flex-col text-white w-full  text-[16px] [&>*]:p-[14px]  ">
                <MenuItem text={"Domov"} icon={<HomeIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Hľadať"} icon={<SearchIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Preskúmať"} icon={<StopIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Filmové pásy"} icon={<FilmIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Upozornenia"} icon={<PaperAirplaneIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Vytvoriť"} icon={<PlusCircleIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Profil"} icon={<HomeIcon className="w-[26px]"/>} link={"/"}/>
                <MenuItem text={"Threads"} icon={<AtSymbolIcon className="w-[26px]"/>} link={"/threads"}/>
            </ul>
        </nav>
    );
}

export default Header;
