/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */


import { useGoogleLogin } from '@react-oauth/google';
/**======================
 **   Image and media Imports
 *========================**/
import logo from './media/appicon-itt6.svg'
import googleButton from './media/googleButton.svg'
import schoolMedia from './media/background.png'

/**======================
 **   MUI Imports
 *========================**/
import Button from 'react-bootstrap/Button';


import './ReAuthPage.css'
export default function ReAuthenticateTeacher() {

    /**======================
     **   login -> useGoogleLogin
     *?   login with google
     *========================**/
    const login = useGoogleLogin({
        // if login success -> start login process
        onSuccess: tokenResponse => startLogin(tokenResponse),
        // scopes for permissons
        scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.announcements https://www.googleapis.com/auth/classroom.rosters.readonly',

    });

    /**======================
     **   startLogin
     *?  start login process
     *========================**/
    function startLogin(_token) {
        console.log(_token)
        // set state
        localStorage.setItem('authToken', _token.access_token)
        // start process with session storage
        window.location.reload()
    }

    return (
        <div className="flex flex-row w-screen h-screen overflow-y-hidden">
            <div className="md:order-1 md:basis-2/3 bg-slate-50 flex w-screen flex-col justify-center items-center">
                <div className="md:h-2/5 md:w-2/3 h-3/5 w-4/5 flex gap-10 flex-column justify-center">
                    <div>
                        <p className="text-start font-medium text-3xl text-black py-2">We need to confirm your identity.</p>
                        <p className="w-full">Have a problem with this? <a href="mailto:katie.long@hvhs.school.nz" className="underline underline-offset-8" alt="Support email">Email us for support</a></p>
                    </div>
                    <button className="flex hover:shadow-lg md:w-96 max-w-lg" onClick={() => login()}><img className="w-8 m-0 h-fit inline" src={googleButton} alt="Login Button" /><p className="flex justify-center items-center w-full h-8">Sign In With Google</p></button>
                </div>
            </div>
            <div className="md:order-2 md:basis-1/3 bg-slate-50 flex-col hidden md:block">
                <div className="flex flex-row items-center w-full h-full">
                    <img className="w-20 h-20 px-1" src={logo} alt="logo" />
                    <div className="text-4xl font-medium relative after:absolute after:bg-gray-200 after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300">QuizPoint</div>
                </div>
            </div>
        </div>)
}