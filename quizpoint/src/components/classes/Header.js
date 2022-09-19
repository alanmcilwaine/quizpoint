/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
export default function Header({ classObject }) {
    return (

        <>
            <div className="inline-flex space-x-4 items-center justify-start h-1/4 shadow w-full" style={{}}>
                <div className="inline-flex flex-col space-y-2 items-start justify-start bg-white  w-screen" >
                    <div className="ml-7 mr-7 mt-3 mb-3">
                        <p className="text-2xl font-bold leading-7 text-gray-900" style={{ width: 1158, }}>{classObject.className}</p>
                        <div className="inline-flex space-x-6 items-center justify-start" style={{ width: 1158 }}>
                            <div className="flex space-x-1.5 items-center justify-start">

                                <p className="text-sm font-medium leading-tight text-gray-500">Taught by {classObject.classCreator}</p>
                            </div>
                            <div className="flex space-x-1.5 items-center justify-start">
                                <div className="relative w-1/6 h-full" />
                                <p className="text-sm font-medium leading-tight text-gray-500">hvhs.school.nz</p>
                            </div>
                            <div className="flex space-x-1.5 items-center justify-start">
                                <p className="text-sm font-medium leading-tight text-gray-500">Generated 8/09/2022</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}