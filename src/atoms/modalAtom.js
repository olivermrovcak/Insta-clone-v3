import React from 'react';
import {atom } from "recoil";

export const modalStateAdd = atom({
    key: 'modalStateAdd',
    default: false,
})

export const modalStateLikes = atom({
    key: 'modalStateLikes',
    default: false,
    
})

export const postId = atom({
    key: 'postId',
    default: "",
    
})

export const modalStateFollowing = atom({
    key: 'modalStateFollowing',
    default: false,
    
})

export const userIdForFollowing = atom({
    key: 'userIdForFollowing',
    default: "",
    
})

export const postDataForModal = atom({
    key: 'postDataForModal',
    default: {
        opened: false,
        id: ""
    },

})
