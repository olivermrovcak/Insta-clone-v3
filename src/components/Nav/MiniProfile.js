import React from 'react';
import {getAuth, signOut} from "firebase/auth";
import {app} from '../../firebase/firebase';
import {useNavigate} from "react-router-dom";

function MiniProfile() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const signOutGoogle = () => {
        signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <div className='flex items-center justify-between mt-14 ml-10 text-white'>
            <img
                className='w-[44px] h-[44px] object-contain rounded-full    '
                src={auth?.currentUser?.photoURL}
                alt=""
            />
            <div className='flex-1 mx-4'>
                <h2 className='font-bold text-[14px]'>{auth?.currentUser?.displayName}</h2>
                <h3 className='text-sm text-gray-400'>{auth?.currentUser?.displayName}</h3>
            </div>
            <button onClick={signOutGoogle} className='text-blue-400 font-semibold text-[12px]'>Odhlásiť</button>
        </div>
    )
}

export default MiniProfile;
