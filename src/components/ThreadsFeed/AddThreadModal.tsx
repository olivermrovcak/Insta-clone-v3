import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import {threadAddModal} from '../../atoms/modalAtom';
import {Dialog, Transition} from "@headlessui/react"
import {getAuth} from "firebase/auth";
import {app} from '../../firebase/firebase';
import {CheckBadgeIcon, XMarkIcon} from "@heroicons/react/24/solid";
import {PaperClipIcon} from "@heroicons/react/24/outline";
import {uploadThread} from "../../firebase/apiCalls";
import {ErrorToast, SuccessToast} from "../../utils/ToastUtils";
import {Textarea} from "@material-tailwind/react";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {RHFBasicTextArea} from "../../utils/ReactHookFormUtils";

interface props {
    refresh?: () => void
}

interface Inputs {
    text: string,
    attachment: string,
}

export default function AddThreadModal({refresh}: props) {
    const auth = getAuth(app as any);
    const [open, setOpen] = useRecoilState(threadAddModal);
    const filePickerRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState({
        name: "",
        type: "",
        size: "",
        base64: "",
    });
    const [loading, setLoading] = useState(null);

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => submitForm(data);

    async function submitForm(formData: Inputs) {
        console.log(formData)
        if (loading) {
            return;
        }
        setLoading(true);
        const thread = {
            text: formData.text,
            uid: auth.currentUser.uid,
            attachment: selectedFile.base64,
        }

        await uploadThread(thread).then((response) => {
            setSelectedFile({
                name: "",
                type: "",
                size: "",
                base64: "",
            });
            reset();
            handleRefresh();
            SuccessToast("Thread pridaný");
            setOpen(false)
        }).catch((error) => {
            console.error(error)
            ErrorToast("Thread sa nepodarilo pridať\n" + error.response.data);
        }).finally(() => {
            setLoading(false);
        });
    }

    const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setSelectedFile({
                    base64: reader.result as string,
                    name: file.name,
                    size: file.size.toString(),
                    type: file.type,
                });
            };
        }
    }

    function handleRefresh() {
        if (refresh) {
            refresh();
        }
    }

    function concatText(text) {
        if (text.length > 30) {
            return text.substring(0, 30) + ".." + text.substring(text.lastIndexOf('.'));
        }
        return text;
    }

    useEffect(() => {
        if (errors.attachment) {
            ErrorToast(errors.attachment.message);
        }
    }, [errors.attachment]);

    useEffect(() => {
        if (errors.text) {
            ErrorToast(errors.text.message);
        }
    }, [errors.text]);

    return (<Transition.Root show={open} as={Fragment}>
        <Dialog
            as="div"
            className="fixed !z-[1000] inset-0 overflow-y-auto "
            onClose={setOpen}
        >
            <div
                className='flex items-center justify-center  sm:min-h-screen  text-center sm:block  sm:p-0'>
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
                    <div
                        className="sm:w-[471px] w-[90%]  p-3  bg-[#0f0f0f] border border-gray-500 rounded-lg absolute z-100 top-[50%] left-[50%] -translate-x-[50%] !-translate-y-[50%]">
                        <form>
                            <div
                                className="text-white transition-all
               flex flex-row w-full py-2">
                                <div className="min-h-full flex flex-col items-center !w-16 ">
                                    {auth?.currentUser?.photoURL ? (
                                        <img className="rounded-full h-[32px] w-[32px] object-contain    "
                                             src={auth?.currentUser?.photoURL} alt=""/>
                                    ) : (
                                        <div className="rounded-full h-[32px] w-[32px] object-contain  loader-2"></div>
                                    )}
                                    <div
                                        className="w-[1px] border-r-2 border-r-gray-400 border-opacity-30 my-2 min-h-[20px] h-full"></div>
                                    <div className="relative ">
                                        <img className="rounded-full h-4 object-contain"
                                             src={auth?.currentUser?.photoURL}
                                             alt=""/>
                                    </div>
                                </div>
                                <div
                                    className="w-full pl-3 min-h-[80px] h-[100%] flex flex-col items-start justify-between">
                                    <div className="flex flex-row items-center">
                                        <p className="font-bold text-[14px]">{auth?.currentUser?.displayName}</p>
                                        <CheckBadgeIcon className="h-5 text-blue-500 mx-2"/>
                                    </div>
                                    <RHFBasicTextArea
                                        name="text"
                                        control={control as any}
                                        label={"text"}
                                        rules={{
                                            required: true,
                                            minLength: {
                                                value: 1,
                                                message: "Text must be at least 1 character long",
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: "Maximálny počet znakov je 1000",
                                            },
                                        }}
                                    />
                                    <Controller
                                        control={control}
                                        name="attachment"
                                        rules={{
                                            required: false,
                                            validate: {
                                                size: (value) => !selectedFile?.size || parseInt(selectedFile?.size) <= 10000000 || "Maximálna veľkosť súboru je 10MB",
                                            }
                                        }}
                                        render={({ field: { onChange, ref } }) => (
                                            <input
                                                ref={filePickerRef}
                                                onChange={(e) => {
                                                    addImageToPost(e);
                                                    onChange(e);
                                                }}
                                                type="file"
                                                hidden
                                            />
                                        )}
                                    />

                                    {!selectedFile?.base64 &&
                                        <PaperClipIcon onClick={() => filePickerRef.current.click()}
                                                       className="h-5 text-blue-500 mx-2 mt-2 cursor-pointer"/>}
                                    {selectedFile?.base64 &&
                                        <div className="w-full text-left flex flex-row items-center text-sm space-x-2">
                                            {concatText(selectedFile?.name)}
                                            <XMarkIcon onClick={() => setSelectedFile({
                                                name: "",
                                                type: "",
                                                size: "",
                                                base64: "",
                                            })}
                                                       className="h-5 text-blue-500 ml-2  cursor-pointer"/>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className=" flex flex-row justify-end">
                                <button  onClick={handleSubmit(onSubmit)}
                                        className="bg-white focus:outline-0 hover:bg-gray-200 text-black font-bold text-[14px] px-4  py-1 rounded-xl ">
                                    Uverejniť
                                </button>
                            </div>
                        </form>
                    </div>
                </Transition.Child>
            </div>
        </Dialog>

    </Transition.Root>)
}

