import React from 'react';

interface StoryProps {
    key:  number,
    img : string,
    userName: string,
}

export default function Story({img, userName}:StoryProps) {
    return (
        <div>
            <div
                className="flex justify-center items-center  w-[65px] h-[65px] rounded-full p-[2px] bg-gradient-to-l from-pink-500 via-red-500 to-yellow-500 ">
                <div className="bg-black w-full h-full rounded-full p-[3px]">
                    <img
                        className=' rounded-full object-contain cursor-pointer  '
                        src={img}
                        alt="profile pic"/>
                </div>

            </div>

            <p className='text-xs w-14 truncate text-center text-white pt-2'>{userName}</p>
        </div>
    )
}


