import React, {useEffect, useRef, useState} from 'react'
import {getAuth} from "firebase/auth";
import {app} from "../../firebase/firebase";
import {GifIcon, PhotoIcon, FaceSmileIcon} from "@heroicons/react/24/outline";
import {addCommentToThread, uploadThread} from "../../firebase/apiCalls";
import {useNavigate} from "react-router-dom";
import {CheckBadgeIcon, EllipsisHorizontalIcon} from "@heroicons/react/24/solid";
import {MenuItem} from "@material-tailwind/react";
import ElipsisMenu from "./ElipsisMenu";
import {useRecoilState} from "recoil";
import {loadingState} from "../../atoms/modalAtom";
import {ErrorToast, SuccessToast} from "../../utils/ToastUtils";
import {SubmitHandler, useForm} from "react-hook-form";
import {RHFBasicTextArea} from "../../utils/ReactHookFormUtils";

interface props {
    threadId: string
    refresh: () => void
}

interface Inputs {
    comment: string
}

function ThreadAddComment({threadId, refresh}: props) {

    const auth = getAuth(app as any);
    const navigate = useNavigate();
    const textRef = useRef(null);
    const [isLoading, setIsLoading] = useRecoilState(loadingState)

    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => submitForm(data);

    async function submitForm(formData: Inputs) {
        if (isLoading ) {
           return
        }
        setIsLoading(true);

        addCommentToThread(threadId, formData.comment).then((response) => {
            refresh();
            textRef.current.innerText = "";
        }).catch((error) => {
            console.error(error)
        }).finally(() => {
            setIsLoading(false);
        });
    }

    useEffect(() => {
        if (errors.comment) {
            ErrorToast(errors.comment.message);
        }
    }, [errors.comment]);

    return (
        <div
            className="w-full  flex flex-col ">
            <form>
                <div
                    className="text-white cursor-pointer transition-all
             border-b  border-b-gray-200 border-opacity-20  flex flex-row w-full py-2">
                    <div className="min-h-full flex flex-col items-center !w-16 ">
                        <img className="rounded-full h-[32px] w-[32px] object-contain" src={auth.currentUser.photoURL}
                             alt=""/>
                        <div
                            className="w-[1px]  border-r-2 border-r-gray-400 border-opacity-30 my-2 min-h-[20px] h-full"></div>
                        <div className="relative ">
                            <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                                 src={auth.currentUser.photoURL} alt=""/>
                            <img className="rounded-full h-4 absolute left-[65%] bottom-0 ring-2 ring-[#0f0f0f]"
                                 src={auth.currentUser.photoURL} alt=""/>
                        </div>
                    </div>
                    <div
                        className="w-full pl-3 min-h-[100px] h-[100%] flex flex-col items-start justify-start space-y-2">
                        <div className="flex flex-row items-center w-full">
                            <p className="font-bold text-[14px]">{auth.currentUser.displayName}</p>
                            <CheckBadgeIcon className="h-5 text-blue-500 mx-2 mr-auto"/>
                        </div>
                        <RHFBasicTextArea
                            name="comment"
                            control={control as any}
                            label={"comment"}
                            rules={{
                                required: true,
                                minLength: {
                                    value: 1,
                                    message: "Text must be at least 1 character long",
                                },
                                maxLength: {
                                    value: 300,
                                    message: "Maximálny počet znakov je 300",
                                },
                            }}
                        />
                        <button onClick={handleSubmit(onSubmit)}
                                className="bg-white ml-auto hover:bg-gray-200 text-black font-bold text-[14px] px-4  py-1 rounded-xl ">
                            Uverejniť
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ThreadAddComment
