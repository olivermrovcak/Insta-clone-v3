import React, { useState, useEffect } from 'react';


import {db  } from "../../firebase/firebase";
import {app} from '../../firebase/firebase';
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { addDoc, collection, query,getDocs, onSnapshot,orderBy, doc, getDoc } from 'firebase/firestore';
function Suggestions() {

    const auth = getAuth(app);

    const signOutGoogle = () =>{
        signOut(auth).then(() => {
          // Sign-out successful.
        }).catch((error) => {
          // An error happened.
        });
      }

    const [suggestions, setSuggestions] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            setAllUsers([])
            const p = query(collection(db, "users"));
            const querySnapshots = await getDocs(p);
            querySnapshots.forEach((doc) => {
              setAllUsers(allUsers => [...allUsers,doc.data()])
            });
        }
        getUsers()
      }, [])

  return (
    <div className='mt-4 ml-10'>
        <div className='flex justify-between text-sm mb-5'>
            <h3 className='font-semibold text-gray-400 text-[14px]'>Návrhy pre vás</h3>
            <button className='cursor-pointer text-white font-semibold text-[12px]'> Zobraziť všetky</button>
        </div>
        {allUsers?.map((profile,index) =>{
            return index < 5 ?
             <div key={index} className='flex items-center mt-3 justify-between text-white '>
                        <img className='w-10 h-10 rounded-full ' src={profile.photoUrl} alt="" />
                        <div className='flex-1 ml-4 '>
                        <Link
                            key={index}
                            className='flex-1'
                            to='/Account'
                            state={{ userId: profile.uid }}
                            >
                          <h2 className='font-semibold text-sm'>{profile.name}</h2>
                          </Link>
                        </div>
                        <button className='text-blue-400 text-[12px] font-semibold '>Sledovať</button>
                </div>
                : ""
        }
          )}
    </div>
  )
}

export default Suggestions;
