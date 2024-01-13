import {Routes, Route, BrowserRouter} from "react-router-dom";
import './index.css';
import React, {useState, useEffect} from "react";
import SignIn from "./components/SignIn/SignIn";
import Main from "./components/Main";
import AccountPage from "./components/Account/AccountPage";
import {app} from "./firebase/firebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import Feed from "./components/Feed/Feed";
import ThreadOverview from "./components/ThreadsFeed/ThreadOverview";
import ThreadsMain from "./components/ThreadsFeed/ThreadsMain";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {isUserAdmin} from "./firebase/apiCalls";
import {useRecoilState} from "recoil";
import {appState as appStateAtom} from "./atoms/appStateAtom";
import AdminPage from "./components/Admin/AdminPage";

function App() {

    const [appState, setAppState] = useRecoilState(appStateAtom);
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsUserSignedIn(true);
                isUserAdmin(user.uid).then((response) => {
                    console.log(response.data)
                    setAppState({...appState, isUserAdmin: response.data.isAdmin})
                }).catch((error) => {
                    console.log(error)
                });
            } else {
                setIsUserSignedIn(false);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="w-screen h-screen overflow-hidden z-0">
            <BrowserRouter>
                <Routes>
                    {isUserSignedIn ? (
                        <>
                            <Route path="/" element={<Main/>}>
                                {appState.isUserAdmin && (
                                    <Route path="admin" element={<AdminPage/>}/>
                                )}
                                <Route path="/posts" element={<Feed/>}>
                                    <Route path="following" element={<Feed/>}/>
                                    <Route path="forYou" element={<Feed/>}/>
                                </Route>
                            </Route>
                            <Route path="/threads" element={<ThreadsMain/>}>
                                <Route path=":threadId" element={<ThreadOverview/>}/>
                            </Route>
                            <Route path="Account" element={<AccountPage/>}/>
                        </>
                    ) : (
                        <Route path="/" element={<SignIn/>}/>
                    )}
                </Routes>
                <ToastContainer/>
            </BrowserRouter>
        </div>

    );
}

export default App;
