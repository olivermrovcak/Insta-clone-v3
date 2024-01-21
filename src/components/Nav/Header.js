import React from 'react';
import {
    PaperAirplaneIcon, MagnifyingGlassIcon, AtSymbolIcon, WrenchIcon, FlagIcon
} from "@heroicons/react/24/solid";

import {
    HomeIcon
} from "@heroicons/react/24/outline";
import {useRecoilState} from 'recoil';
import MenuItem from "./MenuItem";
import {FilmIcon, PlusCircleIcon, StopIcon} from "@heroicons/react/24/solid";
import {modalStateAdd, searchBarOpened} from "../../atoms/modalAtom";
import logo from "../../images/instagram.png"
import {appState as appStateAtom} from "../../atoms/appStateAtom";

function Header() {

    const [appState, setAppState] = useRecoilState(appStateAtom);
    const [isSearchBarOpened, setIsSearchBarOpened] = useRecoilState(searchBarOpened);
    const [, setOpen] = useRecoilState(modalStateAdd);
    const handleOpen = () => setOpen(true);

    function handleSearchBarOpen() {
        if (isSearchBarOpened) {
            setIsSearchBarOpened(false)
        } else {
            setIsSearchBarOpened(true)
        }
    }

    return (<nav
        className={`shadow-sm border-r p-[12px]  border-[#a1a1a1] 
        border-opacity-25 bg-black sticky  
        top-0 z-[1001] shrink  flex flex-col 
        h-screen 
        transition-all duration-500 ease-in-out
        ${isSearchBarOpened ? "w-20 " : "w-24 md:w-[245px]"}
        `}>
        {/* LOGO */}
        <div className="p-[16px] mb-[16px]">
            {isSearchBarOpened ? (
                <img className='object-contain h-8  block'
                     src={logo}/>
            ) : (
                <>
                    <img className='object-contain invert h-8 w-24 sm:block hidden'
                         src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1600px-Instagram_logo.svg.png'/>
                    <img className='object-contain h-8 sm:hidden block'
                         src={logo}/>
                </>
            )}
        </div>
        {/* NAV */}
        <ul className="flex flex-col text-white w-full  text-[16px] [&>*]:p-[14px] break-keep ">
            {appState.isUserAdmin && (
                <>
                    <MenuItem  text={"Admin"} icon={<WrenchIcon className="w-[26px]"/>} link={"/admin"}/>
                    <MenuItem  text={"Reports"} icon={<FlagIcon className="w-[26px]"/>} link={"/reports"}/>
                </>
            )}
            <MenuItem text={"Domov"} icon={<HomeIcon className="w-[26px]"/>} link={"/posts/following"}/>
            <MenuItem  onClick={() => handleSearchBarOpen()} text={"Hľadať"}
                      icon={<MagnifyingGlassIcon className="w-[26px]"/>}/>
            <MenuItem text={"Preskúmať"} icon={<StopIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Upozornenia"} icon={<PaperAirplaneIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Vytvoriť"} icon={<PlusCircleIcon className="w-[26px]"/>} onClick={handleOpen}/>
            <MenuItem text={"Profil"} icon={<HomeIcon className="w-[26px]"/>} link={"/"}/>
            <MenuItem text={"Threads"} icon={<AtSymbolIcon className="w-[26px]"/>} link={"/threads"}/>
        </ul>
    </nav>);
}

export default Header;
