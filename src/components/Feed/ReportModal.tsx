import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useRecoilState} from 'recoil';
import {reportModal} from '../../atoms/modalAtom';
import {Dialog, Transition} from "@headlessui/react"
import {getAuth} from "firebase/auth";
import {app} from '../../firebase/firebase';
import {XMarkIcon, ChevronRightIcon} from "@heroicons/react/24/solid";

export default function ReportModal() {
    const auth = getAuth(app as any);
    const [modalState, setModalState] = useRecoilState(reportModal);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        console.log(modalState)
    }, [modalState]);


    return (<Transition.Root show={modalState?.opened} as={Fragment}>
        <Dialog
            as="div"
            className="fixed z-1000 inset-0 overflow-y-auto "
            onClose={() => setModalState({opened: false, id: ""})}
        >
            <div
                className='flex items-center justify-center  sm:min-h-screen  text-center sm:block sm:p-0'>
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
                        className="sm:w-[471px] w-full  bg-[#262626]
                        rounded-lg absolute z-100 top-[50%] left-[50%] -translate-x-[50%] !-translate-y-[50%]">
                        <h1 className="text-white font-bold border-b border-gray-500 border-opacity-60 py-3 relative ">
                            Nahlásiť
                            <XMarkIcon className="w-5 text-white absolute right-2 top-[50%] -translate-y-[50%] cursor-pointer" onClick={() => setModalState({opened: false, id: ""})}/>
                        </h1>
                        <div className="p-5">
                            <h1 className="text-white font-bold text-left " >Prečo nahlasujete tento príspevok?</h1>
                            <ul className="text-white font-bold space-y-4 mt-2 text-left">
                                <li className="relative cursor-pointer">
                                    Je to spam
                                    <ChevronRightIcon className="w-5 text-white absolute right-2 top-[50%] -translate-y-[50%] cursor-pointer" onClick={() => setModalState({opened: false, id: ""})}/>
                                </li>
                                <li className="relative cursor-pointer">
                                    Nevhodný obsah
                                    <ChevronRightIcon className="w-5 text-white absolute right-2 top-[50%] -translate-y-[50%] cursor-pointer" onClick={() => setModalState({opened: false, id: ""})}/>
                                </li>
                                <li className="relative cursor-pointer">
                                    Porušenie autorských práv
                                    <ChevronRightIcon className="w-5 text-white absolute right-2 top-[50%] -translate-y-[50%] cursor-pointer" onClick={() => setModalState({opened: false, id: ""})}/>
                                </li>
                                <li className="relative cursor-pointer">
                                    Podvod alebo klamstvo
                                    <ChevronRightIcon className="w-5 text-white absolute right-2 top-[50%] -translate-y-[50%] cursor-pointer" onClick={() => setModalState({opened: false, id: ""})}/>
                                </li>
                            </ul>
                        </div>

                    </div>
                </Transition.Child>
            </div>
        </Dialog>

    </Transition.Root>)
}

