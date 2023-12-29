import {Routes, Route, useNavigate} from "react-router-dom";
import './index.css';
import {useState, useEffect} from "react";
import SignIn from "./components/SignIn/SignIn";
import Main from "./components/Main";
import AccoutPage from "./components/Account/AccountPage";
import {app} from './firebase/firebase';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import Feed from "./components/Feed/Feed";
import ThreadOverview from "./components/ThreadsFeed/ThreadOverview";
import ThreadsMain from "./components/ThreadsFeed/ThreadsMain";

function App() {

    const [isUserSignedIn, setIsUserSignedIn] = useState(false);
    const auth = getAuth(app);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsUserSignedIn(true);
            } else {
                setIsUserSignedIn(false);
            }
        });
        return onAuthStateChanged
    }, []);

    return (
            <Routes>
                {isUserSignedIn ? (
                    <>
                        <Route path="/" element={<Main/>}>
                            <Route path="/posts" element={<Feed/>}>
                                <Route path="following" element={<Feed />}/>
                                <Route path="forYou" element={<Feed/>}/>
                            </Route>
                        </Route>
                        <Route path="/threads" element={<ThreadsMain/>}>
                            <Route path=":threadId" element={<ThreadOverview/>}/>
                        </Route>
                        <Route path="Account" element={<AccoutPage/>}/>
                    </>
                ) : (
                    <Route path="/" element={<SignIn/>}/>
                )}
            </Routes>
    );

}

export default App;
