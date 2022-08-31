/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import GetHighRes from '../../services/Images'

export default function Header({ name, id, image, email, school }) {
    return (
        <>
            <div className="grid h-screen place-items-center shadow-lg">
                <div className="relative" style={{ width: 622, height: 304, }}>
                    <div className="relative absolute left-0 top-0 bg-white rounded-lg" style={{ width: 584, height: 304, }}>
                        <div className="inline-flex space-x-2 items-center justify-center py-2 px-4 absolute bg-indigo-600 shadow rounded-md" style={{ left: 252, top: 216, }}>
                            <p className="text-sm font-medium leading-tight text-white">Edit your profile</p>
                        </div>
                        <img className="w-48 h-52 absolute rounded-lg" style={{ left: 38, top: 39, }} src={GetHighRes(image, 'google')} alt="Profile Image" />
                        <p className="w-full h-9 absolute text-3xl font-bold leading-9 text-gray-900" style={{ left: 252, top: 39, }}>{name}</p>
                    </div>
                    <p className="w-96 h-5 absolute text-sm leading-tight underline text-gray-500" style={{ left: 252, top: 76, }}>{email}</p>
                    <p className="w-96 h-5 absolute text-sm leading-tight text-gray-500" style={{ left: 252, top: 107, }}>Attending {school}</p>
                </div>
            </div>
        </>
    )
}