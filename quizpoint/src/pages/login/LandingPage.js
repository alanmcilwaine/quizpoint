/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**======================
 **   React Imports
 *========================**/
import { useState, useEffect } from 'react';

/**======================
 **   Data Service/Auth model Imports
 *========================**/
import { newSignInModel, LoginFunction } from '../../services/Login'
import { useGoogleLogin } from '@react-oauth/google';

/**======================
 **   Image and media Imports
 *========================**/
import logo from '../../media/appicon-itt6.svg'
import googleButton from '../../media/googleButton.svg'
import schoolMedia from '../../media/background.jpg'
/**======================
 **   MUI Imports
 *========================**/
import Button from 'react-bootstrap/Button';
import Backdrop from '@mui/material/Backdrop';
import SyncLoader from "react-spinners/SyncLoader";
import pannelsInformal from "../../media/pannelsInformal.png";
/**======================
 **   Stylesheet Imports
 *========================**/

/**==============================================
 **              LandingPage
 *?  What does it do? UI for Landing Page
 *=============================================**/
export default function LandingPage() {
    // states
    let [color, setColor] = useState("#ffffff");
    // just a placeholder variable
    const shouldFade = true
    const [logInStarted, setLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    /**======================
     **   login -> useGoogleLogin
     *?   login with google
     *========================**/
    const login = useGoogleLogin({
        // if login success -> start login process
        onSuccess: tokenResponse => startLogin(tokenResponse),
        // scopes for permissons
        scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.photos.readonly https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos',

    });

    function triggerLogin() {
        setLoading(true)
        LoginFunction()
    }
    /**======================
     **   startLogin
     *?  start login process
     *========================**/
    function startLogin(_token) {
        setLoading(true)
        console.log(_token)
        // set state
        setLogin(true)
        // start process with session storage
        newSignInModel(_token.access_token)
    }

    // return JSX
    return (
        <div className="flex flex-row w-screen h-screen overflow-hidden">
            <div className="md:order-1 md:basis-3/5 bg-slate-50 flex w-screen flex-col justify-center items-center">
                <div className="md:h-2/5 md:w-2/3 h-3/5 w-4/5 flex gap-10 flex-column justify-center">
                    <div>
                        <div className="flex flex-row items-center mb-2">
                            <img className="w-20 h-20" src={logo} alt="Quizpoint Logo"/>
                            <div className="text-4xl font-medium relative after:absolute ml-4 after:bg-gray-200 after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">QuizPoint</div>
                        </div>
                        <h1 className="text-start font-medium text-3xl text-black py-2">Sign in to Hutt Valley High School</h1>
                        <p className="w-full">Have a problem? <a href="" className="underline underline-offset-8">Email us for support</a></p>
                    </div>
                    <button className="flex hover:shadow-lg md:w-96 max-w-lg" onClick={() => triggerLogin()}><img className="w-8 m-0 h-fit inline" src={googleButton} alt="Google Logo"/><p className="flex justify-center items-center w-full h-8">Sign In With Google</p></button>
                </div>
            </div>
            <div className="md:order-2 md:basis-2/5flex-col hidden md:block h-screen">
                <img className="h-screen ml-0 float-right" src={pannelsInformal} alt="School media"/>
                {/* <div className="flex flex-row items-center w-full h-full">
                    <img className="w-20 h-20 mx-3" src={logo}/>
                    <div className="text-4xl font-medium relative after:absolute after:bg-gray-200 after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">QuizPoint</div>
                </div> */}
            </div>
        </div>
    )
}