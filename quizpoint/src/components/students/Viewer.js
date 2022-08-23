/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { dbFunctionsSync } from "../../services/firebase";
import { ref, onValue, set, update } from "firebase/database";
export default function Viewer({ uid }) {
    const [student, setObject] = useState({});
    useEffect(() => {
        if (uid === '') {

        } else {
            console.log(uid)
            function retrieveUserData() {
                let pathRef = ref(db, `/schools/hvhs/users/${uid}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === undefined) {
                        console.log("ERROR - NO DATA FOUND");
                        // if students do exist
                    } else {
                        console.log(snapshot.val())
                        setObject(snapshot.val())
                    }
                });
            }
            retrieveUserData()
        }
    }, [uid]);
    return (
        <>
            <div>
                <div>
                    <div className=''>
                        {student.name === undefined ? <h1 className='text-xl font-medium	'>Start by searching for a student</h1> :
                            <div className='max-w-3xl  ml-0 border-gray-200'>
                                <div className='banner-details'>
                                </div>
                                <div className="user-page-actions">

                                </div>
                                <div className="inline-flex space-x-4 items-center justify-start" style={{ width: 1280, height: 56, }}>
                                    <img className="w-20 h-20 rounded-lg" src={student.picture} alt="Profile" />
                                    <div className="inline-flex flex-col space-y-2 items-start justify-start" style={{ width: 951, height: 56, }}>
                                        <p className="text-2xl font-bold leading-7 text-gray-900" style={{ width: 951, }}>{student.name}</p>
                                        <div className="inline-flex space-x-6 items-center justify-start" style={{ width: 951, height: 20, }}>
                                            <div className="flex space-x-1.5 items-center justify-start">
                                                <p className="text-sm font-medium leading-tight text-gray-500"> {student.studentID}</p>
                                            </div>
                                            <div className="flex space-x-1.5 items-center justify-start">
                                                <div className="relative w-1/4 h-full" />
                                                <p className="text-sm font-medium leading-tight text-gray-500"><a href={'mailto:' + student.email}>{student.email}</a></p>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="flex space-x-3 items-center justify-end">
                                        <div className="flex space-x-2 items-center justify-center py-2 px-4 bg-white shadow border rounded-md border-gray-300">
                                            <img className="w-5 h-full rounded-lg" src="https://via.placeholder.com/20x20" alt="Icon" />
                                            <p className="text-sm font-medium leading-tight text-gray-700">Edit</p>
                                        </div>
                                        <div className="flex space-x-2 items-center justify-center py-2 px-4 bg-white shadow border rounded-md border-gray-300">
                                            <img className="w-5 h-full rounded-lg" src="https://via.placeholder.com/20x20" alt="Icon" />
                                            <p className="text-sm font-medium leading-tight text-gray-700">View</p>
                                        </div>
                                        <div className="flex space-x-2 items-center justify-center py-2 px-4 bg-indigo-600 shadow rounded-md">
                                            <img className="w-1/4 h-full rounded-lg" src="https://via.placeholder.com/20x20" alt="Icon" />
                                            <p className="text-sm font-medium leading-tight text-white">Publish</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-200" style={{ width: 474, height: 1, }} />

                                <div className="user-classcards">
                                    <div className="inline-flex flex-col space-y-1 items-start justify-start  py-2" style={{ width: 896, height: 88, }}>
                                        <p className="text-lg font-medium leading-normal text-gray-900" style={{ width: 848, }}>{student.name}'s classes</p>
                                        <p className="text-sm leading-tight text-gray-500" style={{ width: 848, }}>Classes the student has joined.</p>
                                    </div>
                                    <div className="classCards-row">
                                        {/* Mapped Class Cards */}

                                    </div>
                                </div>
                                <div className="bg-gray-200" style={{ width: 474, height: 1, }} />

                                <div className="user-quizhistory">
                                    <div className="inline-flex flex-col space-y-1 items-start justify-start  py-2" style={{ width: 896, height: 88, }}>
                                        <p className="text-lg font-medium leading-normal text-gray-900" style={{ width: 848, }}>{student.name}'s quizzes</p>
                                        <p className="text-sm leading-tight text-gray-500" style={{ width: 848, }}>Quizzes the student is currently completing.</p>
                                    </div>
                                    {/* Quiz Section */}
                                    <div className="classCards-row">
                                        {/* Mapped Quiz Active Cards */}

                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}