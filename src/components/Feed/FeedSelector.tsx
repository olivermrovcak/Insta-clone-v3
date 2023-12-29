import React from 'react'
import {useNavigate} from "react-router-dom";

function FeedSelector() {

    const path = window.location.pathname;
    const isForYou = path === "/posts/forYou";
    const navigate = useNavigate();

    function handleNavigate() {
        if (!isForYou) {
            navigate("/posts/forYou")
        } else {
            navigate("/posts/following")
        }
    }

    return (
        <>
            <div className="flex flex-row space-x-2 text-white mt-8 font-black">
                <h3 onClick={handleNavigate} className={`cursor-pointer ${!isForYou && " text-white text-opacity-25"}`}>Pre vás</h3>
                <h3 onClick={handleNavigate} className={`cursor-pointer ${isForYou && "text-opacity-25 text-white"}`}>Sledované</h3>
            </div>
            <div className="border border-0 border-b-[1px] w-full my-4 border-[#333333]"></div>
        </>
    )
}

export default FeedSelector
