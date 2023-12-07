import React, {ReactNode} from "react";
import {Link} from "react-router-dom";
import '../../index.css';

interface MenuProps {
    text: string
    icon: ReactNode
    link?: any
    onClick?: any
}

export default function MenuItem({text, icon, link, onClick}: MenuProps) {
    return (
        <Link to={link} onClick={onClick}
              className="rounded-full hover:bg-gray-50 hover:bg-opacity-[6%] transition-all group">
            <li className="flex flex-row items-center  ">
                <div className="w-[30px] relative group-hover:scale-[105%]  ">
                    {icon}
                </div>

                <p className="pl-3">{text}</p>
            </li>
        </Link>

    );
}
