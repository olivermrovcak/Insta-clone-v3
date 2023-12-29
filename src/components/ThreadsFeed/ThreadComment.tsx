import React, {useEffect} from 'react'
import {getUserByUid} from "../../firebase/apiCalls";
import ThreadHeader from "./ThreadHeader";

interface props {
    text: string,
    uid: string
    isEdited?: boolean
}

function ThreadComment({uid, text, isEdited}: props) {

    const [user, setUser] = React.useState<any>(null);

    useEffect(() => {
        getUserByUid(uid).then((response) => {
            setUser(response.data )
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }, []);

    return (
        <div className="w-full border-b-[1px] border-gray-500 p-5 flex flex-col ">
            <ThreadHeader imgSrc={user?.photoUrl} uId={uid} userName={user?.name} edited={isEdited}/>
            <p className="break-words">{text}</p>
        </div>
    )
}

export default ThreadComment
