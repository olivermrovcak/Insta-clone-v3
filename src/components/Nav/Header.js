import React from 'react';
import {
    PaperAirplaneIcon, MagnifyingGlassIcon, AtSymbolIcon, WrenchIcon
} from "@heroicons/react/24/solid";

import {
    HomeIcon
} from "@heroicons/react/24/outline";
import {useRecoilState} from 'recoil';
import MenuItem from "./MenuItem";
import {FilmIcon, PlusCircleIcon, StopIcon} from "@heroicons/react/24/solid";
import {modalStateAdd} from "../../atoms/modalAtom";
import logo from "../../images/instagram.png"
import {appState as appStateAtom} from "../../atoms/appStateAtom";

function Header() {

    const [appState, setAppState] = useRecoilState(appStateAtom);
    const [, setOpen] = useRecoilState(modalStateAdd);
    const handleOpen = () => setOpen(true);

    return (<nav
        className='shadow-sm border-r p-[12px]  border-[#a1a1a1] border-opacity-25 bg-black sticky  top-0 z-50 shrink  flex flex-col h-screen w-24  sm:w-[245px] '>
        {/* LOGO */}
        <div className="p-[16px] mb-[16px]">
            <img className='object-contain invert w-[106px] hidden sm:block'
                 src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1600px-Instagram_logo.svg.png'/>
            <img className='object-contain w-[106px] sm:hidden block'
                 src={logo}/>
        </div>
        {/* NAV */}
        <ul className="flex flex-col text-white w-full  text-[16px] [&>*]:p-[14px]  ">
            {appState.isUserAdmin && (
                <MenuItem text={"Admin"} icon={<WrenchIcon className="w-[26px]"/>} link={"/admin"}/>
            )}
            <MenuItem text={"Domov"} icon={<HomeIcon className="w-[26px]"/>} link={"/posts/following"}/>
            <MenuItem text={"Hľadať"} icon={<MagnifyingGlassIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Preskúmať"} icon={<StopIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Filmové pásy"} icon={<FilmIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Upozornenia"} icon={<PaperAirplaneIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Vytvoriť"} icon={<PlusCircleIcon className="w-[26px]"/>} onClick={handleOpen}/>
            <MenuItem text={"Profil"} icon={<HomeIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Threads"} icon={<AtSymbolIcon className="w-[26px]"/>} link={"/threads"}/>
        </ul>
    </nav>);
}

export default Header;
