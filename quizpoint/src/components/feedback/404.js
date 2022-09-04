/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/**======================
 **  Stylesheet Imports
 *========================**/
import './errorpage.css'
/**======================
 **   Media service Imports
 *========================**/
import logo from '../../media/appicon-itt6.svg'

/**======================
 **   Image and media Imports
 *========================**/
import googleButton from '../../media/googleButton.svg'
import schoolMedia from '../../media/background.jpg'
import pannelsInformal from "../../media/pannelsInformal.png";
/**======================
 **   Bootstrap? Imports
 *! Needs to be refactored to MUI
 *========================**/
import { Image, Button } from 'react-bootstrap'
/**========================================================================
 **                           errorPageNotFound
 *?  What does it do? Shows error page when not found
 *@return JSX, html rendered content
 *========================================================================**/
const errorPageNotFound = () => {
    // return JSX
    // return JSX
    return (
        <div className="flex flex-row w-screen h-screen overflow-hidden">
            <div className="md:order-1 md:basis-3/5 bg-slate-50 flex w-screen flex-col justify-center items-center overflow-y-hidden">
                <div className="md:h-2/5 md:w-2/3 h-full w-4/5 flex gap-10 flex-column justify-center">
                    <div>
                        <div className="flex flex-row items-center mb-2">
                            <img className="w-20 h-20" src={logo} alt='QuizPoint icon' />
                        </div>
                        <p className="text-start font-medium text-3xl text-black py-2">404 - Something went wrong</p>
                        <p className="w-full">We couldn't find the page you wanted. <a href="/" className="underline underline-offset-8">Go home</a></p>
                    </div>
                </div>
            </div>
            <div className="md:order-2 md:basis-2/5flex-col hidden md:block h-screen">
                <img className="h-screen ml-0 float-right" src={pannelsInformal} alt='School media' />

            </div>
        </div>
    )
}

// export page
export default errorPageNotFound

