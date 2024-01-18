import {Menu, MenuHandler, MenuList} from "@material-tailwind/react";
import React from "react";

export default function ElipsisMenu({handler, children}: any) {
    return (
        <Menu placement="bottom-end">
            <MenuHandler>
                {handler}
            </MenuHandler>
            <MenuList
                className="!z-[101] rounded-xl p-0 bg-[#0f0f0f] border-gray-500 border border-opacity-20 text-white font-bold [&>*]:last:!border-b-0"
                onResize={undefined} onResizeCapture={undefined}>
                {children}
            </MenuList>
        </Menu>
    )
}