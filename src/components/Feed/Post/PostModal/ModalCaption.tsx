import React from "react";

export default function ModalCaption(props: { post: any }) {
    return <div className="w-full flex  mb-2">

        <img
            src={props.post?.profileImg}
            className="h-[32px] w-[32px] object-contain mr-2 rounded-full"
        />

        <div className="break-all flex-1">
            <p className="text-[14px] font-bold ">{props.post?.username}</p>
            <p className="text-[12px]">{props.post?.caption}</p>
        </div>

    </div>;
}