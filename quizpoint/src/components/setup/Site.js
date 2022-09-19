/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "GIF"];

export default function Site({ page }) {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
        console.log(file)
        setFile(file);
    };
    return (
        <>

            <div className="shadow rounded-md w-3/5 h-3/5" >
                <div className="flex flex-col space-y-1 items-start justify-start px-6 py-5" style={{ width: 896, height: 76, }}>
                    <p className="text-3xl font-extrabold leading-9 text-gray-900" style={{ width: 848, }}>Site Setup</p>
                </div>
                <div className="flex flex-col items-start justify-start p-6 bg-white">
                    <div className="relative" style={{ width: 848, height: 406, }}>
                        <div className="inline-flex flex-col space-y-1 items-start justify-start absolute left-0 top-0">
                            <p className="text-sm font-medium leading-tight text-gray-700">School Name *</p>
                            <input className=" text-sm leading-tight px-3 py-2 bg-white shadow border rounded-md border-gray-300" placeholder=""></input>
                        </div>
                        <div className="inline-flex flex-col space-y-1 items-start justify-start absolute right-0 top-0" style={{ width: 412, height: 62, }}>
                            <p className="text-sm font-medium leading-tight text-gray-700">School Domain (e.g hvhs.school.nz) *</p>
                            <input className=" text-sm leading-tight px-3 py-2 bg-white shadow border rounded-md border-gray-300" placeholder=""></input>
                        </div>
                        <div className="inline-flex flex-col space-y-1 items-start justify-start absolute" />
                        <div className="inline-flex flex-col space-y-1 items-start justify-start absolute" style={{ width: 848, height: 72, left: 0, top: 62, }}>
                            <p className="text-sm font-medium leading-tight text-gray-700">School Logo</p>
                            <div className="inline-flex space-x-5 items-center justify-start">
                                <img className="w-1/3 h-full rounded-lg" src="https://via.placeholder.com/48x48" />
                                <div className="flex items-center justify-center px-3 py-2 bg-white shadow border rounded-md border-gray-300">
                                    <p className="text-sm font-medium leading-none text-gray-700">Upload</p>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex flex-col space-y-1 items-start justify-start absolute" style={{ height: 164, left: 0, top: 134, }}>
                            <p className="text-sm font-medium leading-tight text-gray-700">School Branding</p>

                        </div>
                        <div className="inline-flex items-center justify-center px-4 py-2 absolute bg-indigo-600 shadow rounded-md" style={{ left: 600, top: 313, }}>
                            <p className="text-sm font-medium leading-tight text-white">Update</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}