import React from "react";


interface Props {
    imgSrc: string
}

export default function PostImg({ imgSrc}: Props) {
    return <div className="">

        <img
            //onDoubleClick={doubleClick}
            className="object-cover w-full rounded-md max-h-screen"
            src={imgSrc}
            alt="Post-img"
        />

        <div className="">

        </div>

    </div>;
}