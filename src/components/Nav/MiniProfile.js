
import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import {app} from '../../firebase/firebase';

function MiniProfile() {
    const auth = getAuth(app);

    const signOutGoogle = () =>{
    
        signOut(auth).then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
        
    
      }

  return (
        <div className='flex items-center justify-between mt-14 ml-10'>
            <img
            className='w-16 h-16 object-contain rounded-full border p-[2px]   '
            src={auth?.currentUser?.photoURL}
            alt="" />

            <div className='flex-1 mx-4'>
                <h2 className='font-bold'>{auth?.currentUser?.displayName}</h2>
                <h3 className='text-sm text-gray-400'>Hello</h3>
            </div>

            <button onClick={signOutGoogle} className='text-blue-400 font-semibold text-sm'>Sign Out</button>

        </div>

  )
}

export default MiniProfile;
