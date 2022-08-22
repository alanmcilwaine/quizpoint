/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { Fragment } from 'react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'


export default function Heading({ text }) {
    return (
        <>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl tracking-tight font-bold text-gray-900">{text}</h1>
                </div>
            </header>

        </>
    )
}