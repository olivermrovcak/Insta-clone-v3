import React from "react";

interface Props {
    userName: string,
    caption: string
}

export default function PostCaption({userName, caption}: Props) {
    return <p className="font-bold text-[14px] mr-1">
        {userName + " " + caption}
    </p>;
}