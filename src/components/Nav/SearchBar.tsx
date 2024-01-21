import {Input} from "@material-tailwind/react";
import React, {useEffect, useRef} from 'react'
import {useRecoilState} from "recoil";
import {searchBarOpened} from "../../atoms/modalAtom";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {db} from "../../firebase/firebase";
import {collection, getDocs, query, where} from "firebase/firestore";
import {Link} from "react-router-dom";

function SearchBar() {

    const [isSearchBarOpened,setIsSearchBarOpened] = useRecoilState(searchBarOpened);
    const [users, setUsers] = React.useState([])
    const [search, setSearch] = React.useState("")
    const searchBarRef = useRef(null);

    function getUsersByUsername(username) {
        if (!username) {
            setUsers([])
            return;
        }

        const q = query(collection(db, 'users'), where('name', '>=', username), where('name', '<=', username + '\uf8ff'));
        return getDocs(q)
            .then(querySnapshot => {
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push(doc.data());
                });
                console.log(users)
                setUsers(users)
            })
            .catch(error => {
                console.error("Error getting documents: ", error);
            });
    }

    useEffect(() => {
        getUsersByUsername(search)
        return () => {
            setUsers([])
        }
    }, [search]);

    useEffect(() => {
        function handleClickOutside(event) {
            const searchButton = document.getElementById('searchButton');
            if (searchBarRef.current && !searchBarRef.current.contains(event.target) &&
                searchButton && !searchButton.contains(event.target)) {
                setIsSearchBarOpened(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchBarRef, setIsSearchBarOpened]);

    return (
        <div ref={searchBarRef} className={`border border-gray-200 border-opacity-20 
            h-screen  absolute  top-0 pl-24 pr-4 pt-6
            transition-all duration-1000 bg-black rounded-xl 
            z-[1000]
            w-[100%]  md:w-[30%]
            ${isSearchBarOpened ? "left-0 " : "md:-left-[30%] -left-[100%] blur-sm"}`}>
            <h1 className="text-white text-3xl font-bold mb-4">Hľadať</h1>
            <Input icon={<MagnifyingGlassIcon className="text-gray-400"/>}
                   labelProps={{
                       className: "hidden",
                   }}
                   className="!bg-gray-800 border-none focus:ring-0 text-white "
                   onChange={(e) => setSearch(e.target.value)}
                   value={search}
                   placeholder={"Hľadať"}
                   onResize={undefined}
                   onResizeCapture={undefined} crossOrigin={undefined}
            />
            <ul className="text-white mt-2">
                {users?.map((user) => (
                    <Link
                        key={user?.uid}
                        className='flex-1'
                        to='/Account'
                        state={{userId: user?.uid}}
                    >
                        <li className="w-full flex flex-row p-2 space-x-2 items-center hover:bg-gray-200 hover:bg-opacity-20 transition-all rounded-lg cursor-pointer">
                            <img src={user?.photoUrl} alt="" className="rounded-full h-8 "/>
                            <p className="text-sm">{user?.name}</p>
                        </li>
                    </Link>

                ))}
            </ul>

        </div>
    )
}

export default SearchBar
