import {FaceSmileIcon} from "@heroicons/react/24/outline";
import React, {useEffect} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {addCommentToThread} from "../../../../firebase/apiCalls";
import {ErrorToast} from "../../../../utils/ToastUtils";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {app, db} from "../../../../firebase/firebase";
import {useRecoilState} from "recoil";
import {loadingState} from "../../../../atoms/modalAtom";
import {getAuth} from "firebase/auth";
import {RHFBasicTextArea, RHFBasicTextField} from "../../../../utils/ReactHookFormUtils";

interface props {
    postId: string
}

interface Inputs {
    comment: string
}

export default function ModalCommentForm({postId}: props) {

    const auth = getAuth(app as any);
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

        await addDoc(collection(db, 'posts', postId, 'comments'), {
            comment: formData.comment,
            username: auth?.currentUser?.displayName,
            userImage: auth?.currentUser?.photoURL,
            timeStamp: serverTimestamp(),
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            ErrorToast(error.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    useEffect(() => {
        if (errors.comment) {
            ErrorToast(errors.comment.message);
        }
    }, [errors.comment]);

    return <div className="w-full border-t p-3   border-[#a1a1a1] border-opacity-25 ">
        <form className="flex items-center flex-row w-full" >
            <FaceSmileIcon className="h-8 mr-3"/>
                <RHFBasicTextField
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
            <button onClick={handleSubmit(onSubmit)} className="text-blue-400 font-bold">Uverejniť</button>
        </form>
    </div>;
}