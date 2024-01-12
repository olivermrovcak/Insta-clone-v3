import React from "react";
import {useRecoilState} from "recoil";
import {postDataForModal} from "../../../atoms/modalAtom";

interface Props {
    imgSrc: string | null,
    postId: any
}

export default function PostImg({imgSrc, postId}: Props) {

    const [, setDataForPostModal] = useRecoilState(postDataForModal)

    function handleOpenPostDialog() {
        setDataForPostModal({opened: true, id: postId})
    }

    return <div  className="">
        {imgSrc ? (
            <img
                onClick={() => handleOpenPostDialog()}
                className="object-cover w-full rounded-md max-h-screen"
                src={imgSrc}
                alt="Post-img"
            />
        ) : (
            <div className="object-cover w-full rounded-md max-h-screen min-h-[500px] loader-1 "></div>
        )}
    </div>;
}