/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import { user } from '../../firebase/fb.user'
import schoolBranding from '../../../media/schoollogo.png'

export default function Header({ media, title, comment, student, date }) {
    return (
        <>
            <div
                className="inline-flex space-x-4 items-center justify-start mb-10 mt-10 bg-white h-full w-210mm"
                style={{ height: 56 }}
            >

                <img
                    className=" ml-2 w-100mm h-20 rounded-lg"
                    src={schoolBranding}
                    alt="Media for PDF"
                />

                <div
                    className="inline-flex flex-col space-y-2 items-start justify-start"
                    style={{ height: 56 }}
                >
                    {student ?
                        <p
                            className="text-2xl font-bold leading-7 text-gray-900"
                            style={{ width: 951 }}
                        >
                            {student.name}
                        </p>
                        : <p
                            className="text-3xl font-bold leading-7 text-gray-900"
                            style={{ width: 800 }}
                        >
                            {title}
                        </p>}

                    <div className="flex space-x-1.5 items-center justify-start">
                        {student ?
                            <p className="text-lg font-medium leading-tight text-gray-500">
                                {" "}
                                {student.studentID}
                            </p>
                            : null}
                    </div>
                    <p className="text-lg font-medium leading-tight text-gray-500">
                        {user.name} generated report on {date}.
                    </p>

                </div>
            </div>


        </>
    );
}