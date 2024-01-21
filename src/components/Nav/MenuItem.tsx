import React, {ReactNode} from "react";
import {Link} from "react-router-dom";
import '../../index.css';
import {useRecoilState} from "recoil";
import {searchBarOpened} from "../../atoms/modalAtom";

interface MenuProps {
    text: string
    icon: ReactNode
    link?: any
    onClick?: any
    id?: string
}

export default function MenuItem({text, icon, link, onClick, id}: MenuProps) {

    const [isSearchBarOpened, setIsSearchBarOpened] = useRecoilState(searchBarOpened);

    return (
        <Link  to={link} onClick={onClick}
              className="rounded-full hover:bg-gray-50 hover:bg-opacity-[6%] transition-all group">
            <li  className="flex flex-row items-center  ">
                <div id={"searchButton"} className="w-[30px] relative group-hover:scale-[105%]  ">
                    {icon}
                </div>

                {!isSearchBarOpened && <p className="pl-3 hidden md:block  ">{text}</p>}
            </li>
        </Link>

    );
}
