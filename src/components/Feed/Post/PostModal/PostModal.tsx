import Modal from "@mui/material/Modal";
import {
    HeartIcon,
} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import getDataFromDb, {getDocument} from "../../../../firebase/functions";
import ModalActionList from "./ModalActionList";
import ModalCommentForm from "./ModalCommentForm";
import ModalCaption from "./ModalCaption";
import ModalHeader from "./ModalHeader";
import {getPostById} from "../../../../firebase/apiCalls";
import {db} from "../../../../firebase/firebase";

interface Props {
    opened: boolean,
    onClose: () => void,
    postId: string
}

export default function PostModal({opened, onClose, postId}: Props) {

    const [post, setPost] = useState<any>();

    function getPost() {
        getPostById(postId).then((response) => {
            setPost(response.data)
        }).catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        getPost();
    }, [postId,db])

    return <Modal
        open={opened}
        onClose={onClose}
    >
        <section className="absolute w-[90vw] sm:w-[70vw] md:w-[90vw] min-h-[60vh] select-none ring-0 focus:ring-0 border-none  -translate-y-[50%] -translate-x-[50%] left-[50%] top-[50%] grid grid-cols-1 sm:grid-cols-2  ">
            <div className=" bg-black flex justify-center items-center  max-w-[90vw] ">
                <img
                    src={post?.image}
                    className="object-cover w-full"
                />
            </div>
            <div className="bg-black text-white flex flex-col ">
                <ModalHeader userName={post?.username} profileImg={post?.profileImg}/>
                <div className="w-full p-3 flex flex-1  items-start flex-col overflow-y-scroll scrollbar-hide basis-24 md:basis-64  ">
                    <ModalCaption post={post}/>
                    <PostModalComments comments={post?.comments}/>
                </div>
                <ModalActionList  postId={postId}/>
                <ModalCommentForm postId={postId} />
            </div>
        </section>
    </Modal>;
}

interface PostModalCommentProps {
    comments: any []
}

function PostModalComments({comments}: PostModalCommentProps) {
    return <>
        {comments ? (
            comments?.map((comment, id) => (
                <div key={id + comment?.uid} className="w-full flex flex-row mb-2">
                    <img
                        src={comment?.userImage}
                        className="h-[32px] w-[32px] object-contain mr-2 rounded-full"
                    />
                    <div className="flex flex-col relative w-full justify-center items-start ">
                        <p className="text-[14px] font-bold ">{comment?.username} {" "}
                            <span className="font-normal">
                 {comment?.comment}
                </span>
                        </p>
                        <p className="text-[12px] text-[#8E8E8E]">
                            1t Páči sa mi to Odpovedať
                        </p>
                        <HeartIcon className="w-3 h-4 right-0 top-[10px] absolute"/>
                    </div>
                </div>
            ))
        ) : (
            ""
        )}
    </>;
}