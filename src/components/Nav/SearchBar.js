import {SearchIcon,
   
  } from "@heroicons/react/outline";


import React, {useState, useEffect,useRef} from 'react';
import { Link } from "react-router-dom";
import {db  } from "../../firebase/firebase";
import {app} from '../../firebase/firebase';

import { addDoc, collection, query,getDocs, onSnapshot,orderBy, doc, getDoc } from 'firebase/firestore';

function SearchBar() {


    const [searchTerm, setSearchTerm] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const ref = useRef();


    useEffect(() => {
        const checkIfClickedOutside = e => {
          // If the menu is open and the clicked target is not within the menu,
          // then close the menu
          if (searchOpen && ref.current && !ref.current.contains(e.target)) {
            setSearchOpen(false)
          }
        }
    
        document.addEventListener("mousedown", checkIfClickedOutside)
    
        return () => {
          // Cleanup the event listener
          document.removeEventListener("mousedown", checkIfClickedOutside)
        }
      }, [searchOpen])
      


    //fetch users
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
    <div className='max-w-xs hidden md:inline-block '>
    <div className='flex mt-1 relative  rounded-md ' ref={ref}>
      <div className='absolute inset-y-0 pl-3 flex items-center pointer-events-none'>
        <SearchIcon className='h-5 w-5  text-gray-500'/>
      </div>
         
      <input 
      className='bg-gray-100 block w-full pl-10 sm:text-sm 
      rounded-md focus:ring-0 focus:border border-white' 
      type="text"   placeholder='Hladat'
      onChange={(e) => {
        setSearchTerm(e.target.value)
      }}
      onClick={() => setSearchOpen(oldState => !oldState)}
      
      />

      {searchOpen && 
      <div  className='w-[150%]  absolute bg-white rounded-md shadow-xl top-[130%] left-[50%]  transition duration-150 ease-out -translate-x-[50%]'>
            <div className='border-1 searchPolygon absolute w-7 h-3 bg-white shadow-xl left-[50%] -top-1 -translate-x-[50%] -translate-y-[50%]'></div>
                <div className='w-full  flex p-3 flex-row justify-between'> 
                  <p className='font-semibold text-sm '>Nedávne</p>
                  <p className='font-semibold text-blue-400 text-sm'>Vymazať všetky</p>
                </div>
            <ul className='w-full '>
                
                {allUsers && allUsers.filter((user) => {
                  if(searchTerm == "") {
                    return user
                  } else if (user.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return user
                  }
                  
                }).map((user, index) => {

                  return index < 5 ?
                  
                  (<Link
                      key={index}
                      className='flex-1'
                      to='/Account'
                      state={{ userId: user.uid }}
                      >
                      
                      
                      <li  className='px-3 py-6 h-10  hover:bg-gray-50  flex  items-center'> 
                      
                      <img
                        className=' w-9 h-9 mr-3 rounded-full'
                        src={user.photoUrl}
                      />

                      <p className='text-sm'>{user.name}</p>
                      </li>
                      </Link>) : ( "")


                }
                    
                    
                      
                      

                      
                      
                      
                    
                  
                 )}
             

              
                     
              
            </ul>
      </div>}
    </div>
  </div>
  )
}

export default SearchBar