/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Link } from "react-router-dom";

import { getAuth, signOut } from "firebase/auth";
  import {app} from '../../firebase/firebase';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {

  //auth
  const auth = getAuth(app);
  //signout
  const signOutGoogle = () =>{
    
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
    

  }
  
  return (
    <Menu as="div" className="relative inline-block text-left">
      
        <div>
        
        <Menu.Button style={{backgroundImage:`url(${auth?.currentUser?.photoURL})`}} className="  justify-center  rounded-full w-8 h-8  border border-gray-300 shadow-sm px-4 py-2  text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black bg-cover bg-center bg-no-repeat">
          
          
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => ( 
              <Link 
              to="/Account"
              state={{ userId: auth.currentUser.uid }}
              >
                <a
                  
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Profil
                 
                </a></Link>
              )}
            </Menu.Item>
            
            
           
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    onClick={signOutGoogle}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full text-left px-4 py-2 text-sm'
                    )}
                  >
                    Odlásiť sa
                  </button>
                )}
              </Menu.Item>
            
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
