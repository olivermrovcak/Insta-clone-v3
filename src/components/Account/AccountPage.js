import React, {useEffect, useState} from 'react';
import Header from '../Nav/Header';
import { useLocation } from 'react-router-dom'
import {
CogIcon,
ChevronDownIcon,
UserIcon,
CheckIcon
} from "@heroicons/react/outline";
import { doc, getDoc, collection, setDoc, getDocs, query,deleteDoc , where} from 'firebase/firestore';

import { Snapshot } from 'recoil';


import { useRecoilState } from 'recoil';
import { modalStateFollowing, userIdForFollowing } from '../../atoms/modalAtom';

import { db } from '../../firebase/firebase';
import {app} from '../../firebase/firebase';
import { getAuth,  onAuthStateChanged } from "firebase/auth";
import ModalFollowing from './ModalFollowing';




function AccountPage() {

  
  

    const auth = getAuth(app);
    
    const  userId  = useLocation().state;

    const [user , setUser] = useState();
   
    const [hasFollowed, setHasFollowed] = useState(false);

    const [following, setFollowing] = useState(0);

    const [followers, setFollowers] = useState(0);

    const [posts, setPosts] = useState([])

    const [postsCount, setPostsCount] = useState(0)

    const [followedUsersIds, setFollowedUsersIds] = useRecoilState(userIdForFollowing)

    const [openFollowingWindow, setOpenFollowingWindow] = useRecoilState(modalStateFollowing)
   
    //nastavi user podla uid pouzivatela na ktoreho prihlaseny pouzivatel klikol
    useEffect(() => {
      
      const getADocument = async () => {

        const ref = doc(db, "users", userId?.userId?.toString())
        const docSnap = await getDoc(ref)

        if(docSnap.exists()){
          
          setUser(docSnap.data())
          
        }
        

    }

    getADocument()


    }, [db,userId]);


    //zisti ci prihlaseny pouzivatel sleduje pouzivatela na ktoreho profil klikol
    useEffect(() => {
        
       
      const data = async () =>{

        const q = query(collection(db, "users", auth?.currentUser?.uid,"following"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            
           if(doc.id === userId?.userId){
                setHasFollowed(true);
                
      
            }
            
        });
       
        
       

      }

      data()
    
    }, [userId,db])
    
    //zisti kolko ludi pouzivatel sleduje 
    useEffect(() => {
        
       
      const data = async () =>{

       setFollowing(0)

        const p = query(collection(db, "users",  userId?.userId?.toString(),"following"));
  
        const querySnapshots = await getDocs(p);
        querySnapshots.forEach((doc) => {

          //nastavi pocet ludi ktorych dany pouzivatel sleduje
          setFollowing(following => (following + 1))

            
        });
       
        
       

      }

      data()
    
    }, [userId,db])


    //zisti kolko ludi pouzivatela sleduje 
    useEffect(() => {
        
       setFollowers(0)
      const getUsersFollowers = async () => {
        const r = query(collection(db, "users"));
        
      const querySnapshot = await getDocs(r);
      querySnapshot.forEach((doc) => {
        
        const q = query(collection(db, "users",doc.id.toString(),"following"));

          const querySnapshots = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((docs) => {
              if(docs.id === userId.userId){
                
                setFollowers(followers => (followers + 1))
              }
              
              
            });
          })

      });

      }

      getUsersFollowers()
    
    }, [userId])


    //nacita prispevky ktore pouzivatel uverejnil
    useEffect(() => {

      setPostsCount(0)
      setPosts([])
      const getUsersPosts = async () => {
        const r = query(collection(db, "posts"), where("uid", "==", userId.userId.toString()));
        
      const querySnapshot = await getDocs(r);
      querySnapshot.forEach((doc) => {

        setPostsCount(postsCount => (postsCount + 1))
        setPosts(posts => [...posts, doc.data()])
        
      });

      
      }
      getUsersPosts()
    }, [userId])
    
   

    //follow unfollow
    const follow = async () =>{

     
        if(hasFollowed){

          await deleteDoc(doc(db, 'users',  auth?.currentUser?.uid?.toString(), 'following', userId?.userId?.toString()))
            setHasFollowed(false)
          
        } else {

            await setDoc(doc(db, 'users', auth?.currentUser?.uid?.toString(), 'following', userId?.userId?.toString()),{
                        username: auth.currentUser.displayName
                    })
                    setHasFollowed(true)
        }
        
        
        

    }

    //render headeru podla uzivatela
    const headerRender = () => {
        if(userId.userId === auth.currentUser.uid){

          return (
            <div className='flex flex-col md:space-y-0  space-y-3 md:flex-row '>
                        <div className='flex '>
                          <p className='text-xl mr-5 '>{auth?.currentUser?.displayName}</p>
                          <CogIcon className='w-7 h-7 cursor-pointer mr-5'/>
                        </div>
                        
                      <div className='border rounded-md max-w-[13rem] min-w-[7rem] cursor-pointer text-center p-1'>
                          <p className='font-semibold text-sm '>Upravit profil</p>
                      </div>
                          
                      
                      </div>
          )
        } else if(hasFollowed) {

          return (  
            
            <>
              <div className='flex mb-5 md:mb-2'>
                          <p className='text-xl mr-5 '>{user?.name}</p>
                          
              </div>
            <div className='flex '>
              
              <button
              onClick={follow}
              className='bg-white flex items-center justify-center hover:bg-slate-200 mr-[10px] border text-white font-regular text-sm py-1 px-4 rounded-md min-w-[210px]'>
                <UserIcon className='w-4 h-4 stroke-black'/>
                <CheckIcon className='w-4 h-4 stroke-black'/>
              </button>
              <button className='w-[35px] bg-blue-500 hover:bg-blue-700  text-white font-regular text-sm py-1 px-auto rounded-md '>
                <ChevronDownIcon className='w-4 h-4 mx-auto'/>
              </button>
             </div>
             </>
          )

        }

        return (
          <div>
              <div className='flex '>
                <button
                onClick={follow}
                className='bg-blue-500 hover:bg-blue-700 mr-[10px] text-white font-regular text-sm py-1 px-4 rounded-md min-w-[210px]'>
                  Sledovať
                </button>
                <button className='w-[35px] bg-blue-500 hover:bg-blue-700  text-white font-regular text-sm py-1 px-auto rounded-md '>
                  <ChevronDownIcon className='w-4 h-4 mx-auto'/>
                </button>
             </div>         
          </div>
        )

    }
   


  return (
      <div>
        <ModalFollowing/>
          <Header/>
          <div className='max-w-4xl mx-auto md:space-y-6  grid-cols-1 grid  gap-2'>
                  {/*header*/}
                  <div className=' p-3 flex '>
                      <div className='mr-10 md:mr-24'>
                          <img 
                            src={user?.photoUrl}
                          className='md:h-36 md:w-36  w-20 rounded-full object-contain border'
                          />
                      </div>

                      <div className='flex flex-col justify-around md:justify-around'>
                      <div className='flex flex-col justify-around'>
                        
                     
                          {headerRender()}
                     
                      </div>
                            
                            
                           



                          <div className='hidden md:flex justify-start space-x-8 flex-row'>
                              <p>Prispevky <span  className='font-semibold cursor-pointer'>({postsCount})</span></p>
                              <p>Sledujuci  <span className='font-semibold'>({followers})</span></p>
                              <p className='cursor-pointer' onClick={() => {setOpenFollowingWindow(true);setFollowedUsersIds(userId.userId)}} >Sledujem <span className='font-semibold'>({following})</span></p>
                          </div>

                      <div className='text-semibold hidden md:block'>
                          <p>{user?.name}</p>
                      </div>
                   </div>
                      
                     
                  </div>
                  {/*BIO*/}
                  <div className=' md:hidden pl-3 text-sm font-semibold'>{user?.name}</div>
                  {/*STORIES*/}
                  <div className=' md:border-b p-3 flex md:space-x-12  space-x-3 overflow-x-scroll scrollbar-thin'>
                    <div className='w-24 flex flex-col items-center  text-center cursor-pointer'>
                       <img 
                    className='md:w-24 md:h-24 w-16 h-16 rounded-full p-[2px] border'
                    src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/1600px-HD_transparent_picture.png?20200606142532'
                    
                    ></img>
                    <p className='text-sm'>Story</p>
                    </div>

                    
                   {/*FOLLOWERS etc*/}
                  </div>
                  <div className=' p-3 md:hidden flex items-center justify-around border'>
                    <div className='text-center'>
                        <p className='text-gray-400 text-sm'>Príspevky</p>
                        <p className='text-sm'><span  className='text-gray-300 cursor-pointer'>(</span>{postsCount}<span className='text-gray-300'>)</span> </p>
                    </div>

                    <div className='text-center'>
                        <p className='text-gray-400 text-sm'>Sledujúci</p>
                        <p className='text-sm'><span  className='text-gray-300 cursor-pointer'>(</span>{followers}<span className='text-gray-300'>)</span> </p>
                    </div>

                    <div className='text-center'>
                        <p className='text-gray-400 text-sm'>Sledujem</p>
                        <p onClick={() => {setOpenFollowingWindow(true);setFollowedUsersIds(userId.userId)}} className='text-sm cursor-pointer'><span  className='text-gray-300 cursor-pointer'>(</span>{following}<span className='text-gray-300'>)</span> </p>
                    </div>
                  
                  </div>

                  {/*POSTS GRID*/}
                  <div className=' p-1 grid grid-cols-3 gap-1 md:gap-4 '>
                      {/*POST*/}

                      {posts.map((post, index) => (
                        
                        <div key={index} className='border-black hover:bg-zinc-500 relative hover:bg-opacity-50 bg-cover w-full h-72 '>
                          
                        <img
                        className='object-cover w-full h-full cursor-pointer  '
                        src={post.image}
                        />
                        <div className='h-full w-full absolute left-0 top-0  hover:bg-zinc-500 opacity-50 transition-all'></div>
                        
                      </div>

                      ))}
                      
                      
                      

                  </div>
                
          </div> 
      </div>
  )
}

export default AccountPage;
