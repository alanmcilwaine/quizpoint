/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useState } from 'react'
import { SpeakerphoneIcon, XIcon } from '@heroicons/react/outline'

export default function Banner({ header, text, action }) {
    const [show, setShow] = useState(true)
    return (
        <>
            {
                show ?
                    <div className="bg-indigo-600">
                        < div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8" >
                            <div className="flex items-center justify-between flex-wrap">
                                <div className="w-0 flex-1 flex items-center">
                                    <span className="flex p-2 rounded-lg bg-indigo-800">
                                        <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="false" />
                                    </span>
                                    <p className="ml-3 font-medium text-white truncate">
                                        <span className="md:inline text-lg">{header} </span>
                                        <span className="hidden md:inline text-lg">{text}</span>
                                    </p>
                                </div>
                                {action ? <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
                                    <a
                                        href={action}
                                        className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
                                    >
                                        Click here
                                    </a>
                                </div> : null}

                                <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                                    <button
                                        type="button"
                                        className="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                                        onClick={() => setShow(false)}
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <p className="ml-3 font-medium text-white truncate">Dismiss</p>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div >
                    </div >
                    : null
            }
        </>
    )
}