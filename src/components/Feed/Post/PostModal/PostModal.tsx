import Modal from "@mui/material/Modal";
import {
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon
} from "@heroicons/react/outline";
import React, {useEffect, useState} from "react";
import getDataFromDb, {getDocument} from "../../../../firebase/functions";
import ModalActionList from "./ModalActionList";
import ModalCommentForm from "./ModalCommentForm";
import ModalCaption from "./ModalCaption";
import ModalHeader from "./ModalHeader";


interface Props {
    opened: boolean,
    onClose: () => void,
    postId: string

}




export default function PostModal({opened, onClose, postId}: Props) {


    const [comments, setComments] = useState<any>();
    const [post, setPost] = useState<any>();

    async function getPost() {
        const path = "posts";
        const pathSegments = postId;
        await getDocument({path, pathSegments}).then((res) => {
            setPost(res?.data());
        });
        getComments();
    }

    async function getComments() {
        const path = "posts";
        const pathSegments = postId + "/comments";
        const orderByField = "timeStamp";
        const order = "asc";
        await getDataFromDb({path, pathSegments, orderByField, order}).then((res) => {
            setComments(res);
        });
    }

    useEffect(() => {
        getPost();
        console.log(comments)
    }, [postId])


    return <Modal
        open={opened}
        onClose={onClose}
    >
        <section
            className="absolute w-[50vw]  select-none ring-0 focus:ring-0 border-none  -translate-y-[50%] -translate-x-[50%] left-[50%] top-[50%] grid grid-cols-2  ">

            <div className=" bg-black flex justify-center items-center ">
                <img
                    src={post?.image}
                    className="object-cover w-full"
                />
            </div>

            <div className="bg-black text-white flex flex-col">

                {/*HEADER*/}
                <ModalHeader userName={post?.username} profileImg={post?.profileImg} />

                <div
                    className="w-full p-3 flex flex-1  items-start flex-col overflow-y-scroll scrollbar-hide max-h-[300px] ">
                    {/*CAPTION */}
                    <ModalCaption post={post}/>
                    {/*COmments*/}
                    <PostModalComments comments={comments}/>
                </div>

                {/*Action list*/}
                <ModalActionList likesCount={0}/>
                {/*Post Comment*/}
                <ModalCommentForm/>
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
            comments.map((comment, id) => (
                <div key={id} className="w-full flex flex-row mb-2">
                    <img
                        src={comment?.data().userImage}
                        className="h-[32px] w-[32px] object-contain mr-2 rounded-full"
                    />

                    <div className="flex flex-col relative w-full justify-center items-start ">

                        <p className="text-[14px] font-bold ">{comment?.data().username} {" "}
                            <span className="font-normal">
                 {comment?.data().comment}
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