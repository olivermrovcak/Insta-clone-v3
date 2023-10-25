import React from "react";

interface Props {
    imgSrc: string | null
}

export default function PostImg({imgSrc}: Props) {
    return <div className="">
        {imgSrc ? (
            <img
                //onDoubleClick={doubleClick}
                className="object-cover w-full rounded-md max-h-screen"
                src={imgSrc}
                alt="Post-img"
            />
        ) : (
            <div className="object-cover w-full rounded-md max-h-screen min-h-[500px] loader-1 "></div>
        )}
    </div>;
}