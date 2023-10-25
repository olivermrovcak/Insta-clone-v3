import React from "react";

interface Props {
    likesCount: number
}

export default function PostLikes({likesCount}: Props) {
    return <>
        <p
            className="font-bold text-[14px] mb-1   cursor-pointer">
            {likesCount > 0 && likesCount + " Páči sa mi to"}
        </p>
    </>;
}