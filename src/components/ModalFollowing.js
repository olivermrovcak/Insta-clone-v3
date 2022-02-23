import React, { Fragment, useRef, useState,useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { modalStateFollowing, userIdForFollowing } from '../atoms/modalAtom';
import { Dialog, Transition } from "@headlessui/react"


import {db  } from "../firebase/firebase";
import { getAuth} from "firebase/auth";
import {app} from '../firebase/firebase';
import { addDoc, collection, query,getDocs, onSnapshot,orderBy, doc, getDoc } from 'firebase/firestore';



function ModalFollowing() {

  
    
    const auth = getAuth(app);
    const [openWindow, setOpenWindow] = useRecoilState(modalStateFollowing);
    const [userId, setUserId] = useRecoilState(userIdForFollowing)
    

    const [whoFollowed, setWhoFollowed] = useState([])
    
 
    //zisti koho pouzivatel sleduje 
   
      useEffect(() => {
        
          setWhoFollowed([])

        const getWhoUserFollowing = async () =>{
          if(userId){

            const p = query(collection(db, "users",  userId.toString(),"following"));
  
        const querySnapshot = await getDocs(p);
        querySnapshot.forEach((doc) => {
          
          const q = query(collection(db, "users"));

          const querySnapshots = getDocs(q).then((querySnapshots) => {
            querySnapshots.forEach((docs) => {
              if(doc.id === docs.id){

                
                setWhoFollowed(whoFollowed => [...whoFollowed, docs.data()])

              
              }

              
              
            });
          })
     
          

            
        });
          }
        



      

        
        }
        getWhoUserFollowing()

      

      }, [userId])
      

    




  return (

   <Transition.Root show={openWindow} as={Fragment}>
       <Dialog 
       as="div"
       className="fixed z-10 inset-0 overflow-y-auto"
       onClose={setOpenWindow}
       >
           <div className='flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
                <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave="ease-in duration-200"
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
                
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50
                     transition-opacity"  />
                    
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
                enterTo='opacity-40 translate-y-0 sm:scale-100'
                leave="ease-in duration-200"
                leaveFrom='opacity-100 translate-y-0 sm:scale-95'
                leaveTo='opacity-0'
                
                >
                    <div className='inline-block align-bottom bg-white 
                    rounded-lg px-4 pt-4 pb-4 text-left overflow-hidden shadow-xl
                    transform transition-all sm:my-7 sm:align-middle max-h-[200px]
                    w-[100vw] md:max-w-xl sm:p-6 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
                        <div>
                              
                               
                                  
                                   {whoFollowed.map((user, index) => (
                                      
                                      <div key={index} className='w-full mb-3 flex flex-row items-center justify-start'>
                                      <img 
                                      className='w-10 h-10 rounded-full mr-5 '
                                      src={user.photoUrl}
                                      />
                                      <p className='flex-1'>{user.name}</p>
                                      {user.uid === auth.currentUser.uid ? "" : <button className='bg-blue-500 hover:bg-blue-600 text-white  py-1 px-4 rounded'>sledovať</button>}
                                      
                                  </div>

                                   ))}
                                
                            
                        </div>
                    </div>
                    </Transition.Child>
           </div>
       </Dialog>

   </Transition.Root>
  )
}

export default ModalFollowing;
