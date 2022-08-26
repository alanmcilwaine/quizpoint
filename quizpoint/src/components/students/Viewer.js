/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useEffect, useState } from "react";
import { db } from "../../services/firebase";
import { dbFunctionsSync } from "../../services/firebase";
import { ref, onValue, set, update } from "firebase/database";
import QuizCards from "../cards/QuizCards";
import ClassCards from "../cards/ClassCards";
import { ForceEnrol, PromoteToTeacher, ForceResub } from "./Actions";
import History from "../reports/History";

export default function Viewer({ uid }) {
    const [student, setObject] = useState({});
    const [userClasses, setClasses] = useState([])
    const [userActiveQuiz, setActiveQuiz] = useState([])
    const [intialLoad, intialLoadSet] = useState(false)
    const [classes, setAllClass] = useState([])
    const [classOptions, setClassOptions] = useState([])
    useEffect(() => {

        if (uid === '') {
            document.title = 'Viewing all students | QuizPoint'
        } else {
            console.log(uid)
            setClasses([])
            setActiveQuiz([])

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
                        let data = snapshot.val()
                        document.title = `Viewing ${data.name} | QuizPoint`

                        Object.keys(data.classes).forEach(key => {
                            let classPath = ref(db, `/schools/hvhs/classes/${key}`)
                            onValue(classPath, (snapshot) => {
                                if (snapshot.val() === null) { } else {
                                    setClasses(prevClasses => [...prevClasses, snapshot.val()])
                                }
                            })
                        })
                        console.log(data.quizzes.active)
                        Object.keys(data.quizzes.active).forEach(key => {
                            setActiveQuiz(prevQuiz => [...prevQuiz, data.quizzes.active[key]])
                        })
                    }
                });
            }
            retrieveUserData()

        }
    }, [uid, intialLoad]);
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
                                <div id="studentInformation" className="inline-flex space-x-4 items-center justify-start" style={{ width: 1280, height: 56, }}>
                                    {student.picture ? <img className="w-20 h-20 rounded-lg" src={'http://www.gravatar.com/avatar'} alt="Profile Image" /> : <img className="w-20 h-20 rounded-lg" src={student.picture} alt="Profile" />}
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
                                <div className="flex h-90 border-4 border-dashed border-gray-200 rounded-lg">
                                    <span className="m-auto">
                                        <div class="h-20 grid grid-cols-4 gap-4 content-center">
                                            <div>
                                                <ForceEnrol student={student} />
                                            </div>
                                            <div>
                                                {console.log(userActiveQuiz)}
                                                <ForceResub student={student} active={userActiveQuiz} />
                                            </div>
                                            <div>
                                                <PromoteToTeacher student={student} />
                                            </div>
                                            <div>
                                                <History type={'student'} id={student.uid} />
                                            </div>

                                        </div>

                                    </span>
                                </div>
                                <div className="bg-gray-200" style={{ width: 474, height: 1, }} />

                                <div className="user-classcards">
                                    <div className="inline-flex flex-col space-y-1 items-start justify-start  py-2" style={{ width: 896, height: 88, }}>
                                        <p className="text-lg font-medium leading-normal text-gray-900" style={{ width: 848, }}>{student.name}'s classes</p>
                                        <p className="text-sm leading-tight text-gray-500" style={{ width: 848, }}>Classes the student has joined.</p>
                                    </div>
                                    <div className="classCards-row">
                                        {/* Mapped Class Cards */}
                                        {student.length < 1 ? <p>{student.name} is not enrolled in any classes</p> : userClasses.map((classData, index) => {

                                            // just some JSX!
                                            return (
                                                <>
                                                    <ClassCards classInfo={classData} />
                                                </>
                                            )
                                        })
                                        }

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
                                        {/* {userActiveQuiz.map((quizData, index) => {
                                            // just some JSX!
                                            console.log(quizData)
                                            if (quizData !== true) {
                                                return (
                                                    <></>
                                                    // <QuizCards quiz={quizData} user={student} status="assigned" page="ClassPage" graphType="bar" />
                                                )
                                            } else {
                                                return (
                                                    <p>No quizzes assigned</p>
                                                )
                                            }
                                        })
                                        } */}

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