/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import logo from '../../../media/appicon-itt6.svg'
import schoolBranding from '../../../media/schoollogo.png'

export default function Footer() {

    return (
        <>
            <div className="relative" >
                <div className="inline-flex items-start justify-center bg-gray-200" style={{ width: '250mm', }}>
                    <div className="flex items-center justify-between px-1 py-6" style={{ height: 100, }}>
                        <div className="inline-flex flex-col items-start justify-start" style={{ height: 80, }}>
                            <p className="text-lg font-extrabold leading-10 text-gray-900">Hutt Valley High School</p>
                            <p className="text-lg font-extrabold leading-10 text-indigo-600">Generated with QuizPoint </p>
                        </div>
                        <div className="flex  items-start justify-start" />
                    </div>
                </div>
                <div className="w-20 h-36 absolute" style={{ left: '20%', top: -20, }}>
                    <img className="flex-1 h-full rounded-lg" src={logo} alt="QuizPointLogo" />
                </div>
            </div>
        </>
    )
}