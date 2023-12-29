import React from 'react';
import {app} from '../../firebase/firebase';
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";

function SignIn() {

    const googleSignIn = () => {

        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result);
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // ...
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }

    return (
        <div className=''>
            <div className='flex flex-col items-center justify-center  py-2  px-14 text-center '>
                <img className='w-80 '
                     src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1600px-Instagram_logo.svg.png'/>
                <p className='text-xs italic'>CLONE</p>
                <div className='mt-40'>
                    <div className=''>
                        <button className='flex justify-around items-center p-3 border rounded-lg text-black'
                                onClick={googleSignIn}>
                            <span className='mr-3'>Prihlás sa s </span>
                            <img className='w-5 h-5  object-contain'
                                 src="https://firebasestorage.googleapis.com/v0/b/oliverminstaclone.appspot.com/o/posts%2FKNKeB0D93XMoe9JXsG9V%2Fimage?alt=media&token=6880fbd1-ad9e-481b-b2ed-b678e8518efb"
                                 alt=""/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SignIn;
