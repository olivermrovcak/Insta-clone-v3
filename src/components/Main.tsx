import React from 'react';
import Header from './Nav/Header';
import ModalLikes from './Feed/ModalLikes';
import {Outlet} from 'react-router';
import ModalUpload from "./Nav/ModalUpload";
import {useRecoilState} from "recoil";
import {loadingState} from "../atoms/modalAtom";
import {LinearProgress} from "@mui/material";

function Main() {

    const [isLoading,] = useRecoilState(loadingState)

    return (
        <div className='bg-black h-screen overflow-y-scroll scrollbar-hide flex items-start !relative '>
            {isLoading && <LinearProgress className="!fixed !top-0 !w-screen !z-[1000] rainbow-linear-progress" color="inherit"/>}
            <Header/>
            <Outlet/>
            <ModalLikes/>
            <ModalUpload/>
        </div>
    );
}

export default Main;
