import React, {useState, useEffect,useRef} from 'react';
import {
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    
    PlusSmIcon
  } from "@heroicons/react/outline";

  import {
    HomeIcon
  } from "@heroicons/react/solid";
  
  import { Link } from "react-router-dom";
  import { useRecoilState } from 'recoil';
  import { modalStateAdd } from "../atoms/modalAtom";
  import DropdownHeader from './DropdownHeader';


  import {db  } from "../firebase/firebase";
  import { getAuth } from "firebase/auth";
  import {app} from '../firebase/firebase';
  import {  collection, query,getDocs} from 'firebase/firestore';
import SearchBar from './SearchBar';
function Header() {

  const ref = useRef()
  
  const [allUsers, setAllUsers] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)

    
  useEffect(() => {

    const getAllUsers = async () =>{
  
          
      setAllUsers([]);
    const p = query(collection(db, "users"));

    const querySnapshots = await getDocs(p);
    querySnapshots.forEach((doc) => {
      
      setAllUsers(allUsers => [...allUsers,doc.data()])
       
    });

  }
      getAllUsers()

  }, [db])

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
  
  
  
  const [openAddPostWindow, setOpenAddPostWindow] = useRecoilState(modalStateAdd);
  
  const auth = getAuth(app);

  return (
     <header className='shadow-sm border-b bg-white sticky top-0 z-50 p-2'>
         <div className='flex justify-between max-w-4xl mx-auto'>
         
            <div  className='relative   w-28 cursor-pointer my-auto '>
              <Link to="/">
                <img className='object-contain' src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1600px-Instagram_logo.svg.png'/>
              </Link>
            </div>
         

          
           
          
        {/*HLADAT */}
       <SearchBar/>
        
        {/*right */}

        <div className='flex items-center justify-end space-x-4'>
        <Link to="/">
        <HomeIcon  className='navBtn'/>
        </Link>
      <div className='relative navBtn'>
                <PaperAirplaneIcon className='navBtn rotate-45 '/>
                
      </div>
              <div className='border-2 border-black  items-center justify-center rounded-lg  cursor-pointer hover:scale-125 
                  transition-all  ease-out'>
                <PlusSmIcon 
                onClick={() => setOpenAddPostWindow(true)} 
                className=' h-5 
                  '/>                
              </div>
              
              <UserGroupIcon className='navBtn'/>
              <HeartIcon className='navBtn'/>
              

              
              <DropdownHeader/>
              
        

          
          
         
        
      </div>



         </div>


     </header>
  );
}

export default Header;
