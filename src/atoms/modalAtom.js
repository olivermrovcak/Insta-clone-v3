import {atom} from "recoil";

export const modalStateAdd = atom({
    key: 'modalStateAdd', default: false,
})

export const modalStateLikes = atom({
    key: 'modalStateLikes', default: false,
})

export const postId = atom({
    key: 'postId', default: "",
})

export const modalStateFollowing = atom({
    key: 'modalStateFollowing', default: false,
})

export const userIdForFollowing = atom({
    key: 'userIdForFollowing', default: "",
})

export const postDataForModal = atom({
    key: 'postDataForModal', default: {
        opened: false, id: ""
    },
})

export const postUpdateModal = atom({
    key: 'postUpdateModal', default: {
        opened: false, id: ""
    },
})

export const loadingState = atom({
    key: 'loadingState', default: false,
})

export const threadOverview = atom({
    key: 'threadOverview', default: {
        opened: false, id: "", uid: ""
    },
})

export const threadAddModal = atom({
    key: 'threadAddModal', default: false,
})

export const reportModal = atom({
    key: 'reportModal', default: {
        opened: false, id: "",type: ""
    },
})

export const searchBarOpened = atom({
    key: 'searchBarOpened', default: false,
})


