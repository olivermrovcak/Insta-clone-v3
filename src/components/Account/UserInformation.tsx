import React from 'react'
import posts from "../Feed/Posts";

interface user {
    photoUrl: string,
    name: string
}

interface props {
    user: user,
    postsCount: number,
    followersCount: number,
    followingCount: number,
}

export default function UserInformation({user, postsCount, followersCount, followingCount}: props) {
    return (
            <div className=" flex flex-row space-x-8">
                <img src={user?.photoUrl} alt="" className='w-[150px] h-[150px] rounded-full mx-auto mt-10'/>
                <div className="w-full flex flex-col justify-center items-start space-y-3">
                    <div className="flex flex-row space-x-4">
                        <h5>{user?.name}</h5>
                        <button className="px-3 text-sm rounded-md bg-white bg-opacity-50 ">Upraviť profil
                        </button>
                        <button className="px-3 text-sm rounded-md bg-white bg-opacity-50 ">Zobraziť archív
                        </button>
                    </div>
                    <div className="flex flex-row space-x-4">
                        <h6>Príspevky: {postsCount}</h6>
                        <h6>Sledovatelia: {followersCount}</h6>
                        <h6>Sledované: {followingCount}</h6>
                    </div>
                    <div className="flex flex-row">
                        <h6>{user?.name}</h6>
                    </div>
                </div>
            </div>
    )
}
