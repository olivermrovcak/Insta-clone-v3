import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import { postUpdateModal} from '../../../../atoms/modalAtom';
import {Dialog, Transition} from "@headlessui/react"
import {getAuth} from "firebase/auth";
import {app} from '../../../../firebase/firebase';
import {getPost, updatePost} from "../../../../firebase/apiCalls";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {TextField} from "@mui/material";


interface Inputs {
    caption: string,
}

function PostUpdateModal() {
    const auth = getAuth(app as any);
    const [open, setOpen] = useRecoilState(postUpdateModal);
    const [postData, setPostData] = useState<any>();
    const [wasChanged, setWasChanged] = useState(false);

    const {
        watch,
        handleSubmit,
        control,
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => submitForm(data);

    function submitForm(formData: Inputs) {
        handleUpdate(formData.caption);
    }

    const handlleClose = () => {
        setOpen({
            opened: false,
            id: ""
        })
    }

    async function fetchData() {
        try {
            const post = await getPost(open.id);
            setPostData(post);
            console.log(post)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function handleUpdate(dataToUpdate: any) {
        updatePost(open.id, dataToUpdate).then((response: any) => {
            console.log(response)
        });
    }

    useEffect(() => {
        if (open.opened) {
            fetchData()
        }
    }, [open]);

    return (<Transition.Root show={open.opened} as={Fragment}>
        <Dialog
            as="div"
            className="fixed z-1000 inset-0 overflow-y-auto"
            onClose={handlleClose}
        >
            <div
                className='flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave="ease-in duration-200"
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"/>

                </Transition.Child>
                <span className='hidden sm:inline-block sm:align-middle sm:h-screen'
                      aria-hidden="true"
                >
                    &#8203;
                </span>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    enterTo='opacity-100 translate-y-0 sm:scale-100'
                    leave="ease-in duration-200"
                    leaveFrom='opacity-100 translate-y-0 sm:scale-95'
                    leaveTo='opacity-0'
                >
                    <div className=' z-100 inline-block align-bottom  bg-white max-w-xl w-[100%] md:w-[70%]
                    rounded-lg  pb-4 text-left overflow-hidden shadow-xl
                    transform transition-all  sm:align-middle p-5  absolute
                    top-[50%] h-64 -translate-y-[50%] left-[50%] -translate-x-[50%] '>
                        <div className='flex items-center flex-col justify-between h-full'>
                            <form>
                                {postData &&
                                <Controller
                                    name="caption"
                                    control={control}
                                    defaultValue={postData?.caption || ""}
                                    rules={{ required: true }}
                                    render={({field: {onChange, value}, fieldState: {error}}) => (
                                        <TextField error={!!error} onChange={(newValue) => {
                                            setWasChanged(true)
                                            onChange(newValue)
                                        }} value={value} label="Popis" variant="standard"/>
                                    )}
                                />}
                            </form>
                            <div className="w-full flex justify-end">
                                <button disabled={!wasChanged}  onClick={ handleSubmit(onSubmit)}
                                        className={`font-bold py-2 px-4 rounded-xl ${!wasChanged ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}>
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Dialog>

    </Transition.Root>)
}

export default PostUpdateModal;
