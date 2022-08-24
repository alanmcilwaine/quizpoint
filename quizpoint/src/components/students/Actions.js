/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import Swal from 'sweetalert2'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { ref, onValue, set, update } from "firebase/database";
import { db } from "../../services/firebase";
import { user } from '../../components/firebase/fb.user';
import { useState, useEffect } from 'react'
function PromoteToTeacher(props) {
    const [promoteDialog, setDialog] = useState(false)
    let student = props.student
    function fire() {
        console.log('fire')
        if (user.role === 'hod' || user.role === 'teacher') {
            let pathRef = ref(db, `/schools/hvhs/users/${student.uid}`)
            update(pathRef,
                { role: 'teacher' })
            setDialog(false)
            Swal.fire('Promoted!', '', 'success')
        }
    }
    function PromoteDialog() {
        return (
            <>
                {promoteDialog ?
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-row min-h-screen justify-center items-center">
                        <div className="flex flex-col items-start justify-start bg-white shadow rounded-lg" style={{ width: 512, height: 194, }}>
                            <div className="inline-flex space-x-4 items-start justify-start px-6 pt-6 pb-4" style={{ width: 512, height: 132, }}>
                                <div className="flex items-center justify-center w-10 h-10 p-2 bg-red-100 rounded-full">
                                    <img className="flex-1 h-full rounded-lg" src="https://via.placeholder.com/24x24" />
                                </div>
                                <div className="inline-flex flex-col space-y-2 items-start justify-start" style={{ width: 408, height: 92, }}>
                                    <p className="text-lg font-medium leading-normal text-gray-900" style={{ width: 408, }}>Promote this student, to a teacher.</p>
                                    <p className="text-sm leading-tight text-gray-500" style={{ width: 408, }}>Make sure you are promoting the correct user, however you can revert this action in the teacher viewer.</p>
                                </div>
                            </div>
                            <div className="inline-flex space-x-3 items-center justify-end px-6 py-1 mt-5 bg-gray-50" style={{ width: 512, height: 62, }}>
                                <div className="flex items-center justify-center px-4 py-2 bg-white shadow border rounded-md border-gray-300">
                                    <p className="text-sm font-medium leading-tight text-gray-700" onClick={() => setDialog(false)}>Cancel</p>
                                </div>
                                <div className="flex items-center justify-center px-4 py-2 bg-red-600 shadow rounded-md">
                                    <p className="text-sm font-medium leading-tight text-white" onClick={() => fire()}>Promote</p>
                                </div>

                            </div>
                        </div>
                    </div>

                    : null}
            </>
        )
    }
    return (
        <>
            <button onClick={() => fire()}>Promote to Teacher</button>
            <PromoteDialog />
        </>
    )

}

function ForceEnrol(props) {
    const [classDialog, setClassDialog] = useState(false)
    const [selectedOption, setOption] = useState('')
    const [intialLoad, intialLoadSet] = useState(false)
    const [classes, setAllClass] = useState([])
    const [classOptions, setClassOptions] = useState([])
    let student = props.student
    useEffect(() => {
        if (intialLoad) {

        } else {
            // then load classes
            const pathRef2 = ref(db, `/schools/hvhs/classes/`);
            // wait for data
            onValue(pathRef2, (snapshot) => {
                // for each class
                snapshot.forEach(childSnapshot => {
                    // add class to class array
                    setAllClass(prevClasses => [...prevClasses, childSnapshot.val()])
                    // create an option
                    let newClass = {
                        label: childSnapshot.val().className,
                        value: childSnapshot.key
                    }
                    // add option to class options
                    classOptions.push(newClass)
                })
                intialLoadSet(true)
            })
        }
    })

    function action() {
        setClassDialog(false)
        if (selectedOption === '') {

        } else {
            console.log(selectedOption)
            // need to read class to get current quizzes
            let classRef = ref(db, `/schools/hvhs/classes/${selectedOption}`)
            let selectedStudentUID = student.uid
            onValue(classRef, (snapshot) => {
                if (snapshot.val() === null) {
                    console.error('Something happened here')
                } else {
                    let quizObject = snapshot.val().quizzes
                    // assign to class first
                    let pathRef = ref(db, `/schools/hvhs/classes/${selectedOption}/students`)
                    update(pathRef, {
                        [selectedStudentUID]: selectedStudentUID
                    })
                    // assign to user
                    let pathRef2 = ref(db, `/schools/hvhs/users/${selectedStudentUID}/classes/${selectedOption}/`)
                    update(pathRef2, {
                        classCode: selectedOption
                    })
                    setClassDialog(false)
                    // sweet alert out!
                    Swal.fire({
                        title: 'Class assigned!',
                        text: "We just need to tidy up, please let us refresh the page",
                        icon: 'info',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'All good'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log('complete')
                            window.location.reload()
                        }
                    })
                }
            })
        }
    }
    function ClassSelector() {
        return (
            <>
                {classDialog ?
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-row min-h-screen justify-center items-center">
                        <div className="flex flex-col items-center justify-center bg-white shadow rounded-lg" style={{ width: 512, height: 194, }}>
                            <div className="inline-flex space-x-4 items-start justify-start px-6 pt-6 pb-4" style={{ width: 512, height: 132, }}>

                                <div className="inline-flex flex-col space-y-2 items-start justify-start" style={{ height: 92, }}>
                                    <p className="text-lg font-medium leading-normal text-gray-900" style={{ width: 408, }}>Assign student to a class.</p>
                                    <p className="text-sm leading-tight text-gray-500" style={{ width: 408, }}>Select a class, we will handle the rest.</p>
                                    <Autocomplete
                                        onChange={(event, newValue) => {
                                            setOption(newValue.value)
                                            action()
                                        }}
                                        style={{ width: 408 }}
                                        getOptionLabel={option => option.label}
                                        disablePortal
                                        options={classOptions}
                                        renderInput={(params) => <TextField {...params} label="Class" />}
                                    />
                                </div>
                            </div>
                            <div className="inline-flex space-x-3 items-center justify-end px-6 py-1 mt-5 bg-gray-50" style={{ width: 512, height: 62, }}>
                                <div className="flex items-center justify-center px-4 py-2 bg-white shadow border rounded-md border-gray-300">
                                    <p className="text-sm font-medium leading-tight text-gray-700" onClick={() => setClassDialog(false)}>Cancel</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    : null}
            </>
        )
    }
    return (
        <>
            <ClassSelector />

            <button onClick={() => setClassDialog(true)}>Force enroll in a class</button>
        </>
    )

}

function ForceResub(props) {
    let newUserQuizRef = props.active
    let userLoaded = props.student
    function action() {
        console.log('started')
        try {
            for (var index = 0; index < newUserQuizRef.length; index++) {

                newUserQuizRef[index].answers = null
                newUserQuizRef[index].score = {
                    total: 0,
                    incorrect: 0,
                    correct: 0
                }
                if (!newUserQuizRef[index].details) {

                } else {
                    newUserQuizRef[index].details.progress = 0
                    let pathRef = ref(db, `/schools/hvhs/users/${userLoaded.uid}/quizzes/active/${newUserQuizRef[index].details.code}`)
                    let turnedInRef = ref(db, `/schools/hvhs/users/${userLoaded.uid}/quizzes/turnedin/`)
                    update(pathRef, newUserQuizRef[index])
                    update(turnedInRef, {})
                }

            }
        } finally {
            const completionCallback = setTimeout(function () {
                console.log('Completed resubmission')


            }, 0)
        }
    }
    return (
        <>
            <button onClick={() => action()}>Force Resubmisson</button>
        </>
    )
}

export {
    PromoteToTeacher,
    ForceEnrol,
    ForceResub
}