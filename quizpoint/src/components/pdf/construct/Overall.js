/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { get, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../../../services/firebase";

export default function Overall({ course }) {
    const [loading, setLoading] = useState(true)
    const [statement, setStatement] = useState('')
    const [studentList, setList] = useState([])
    useEffect(() => {
        if (loading) {
            console.log(course)
            let pathRef = ref(db, 'schools/hvhs/classes/' + course.code)
            onValue(pathRef, (snapshot) => {
                if (snapshot.val() === null) {
                    setStatement('Class was not found, an error has occured')
                } else {
                    console.log(snapshot.val())
                    function compute() {
                        console.log('ran')

                        setList(snapshot.val().students);
                        console.log(studentList)
                        for (let [key, value] of Object.entries(snapshot.val().students)) {
                            studentList.push(key)
                            console.log(studentList)
                        }
                        let quizzesAssignedToClass = snapshot.val().quizzes
                        for (let [key, value] of Object.entries(quizzesAssignedToClass)) {
                            console.log(`${key}`);
                            let passed = 0;
                            let failed = 0;
                            for (var index = 0; index < studentList; index++) {
                                console.log(studentList[index])
                                let uid = studentList[index]
                                let pathRef = ref(db, `schools/hvhs/users/${uid}/quizzes/active/${key}`)
                                // eslint-disable-next-line no-loop-func
                                onValue(pathRef, (snapshot) => {
                                    if (snapshot.val() === null) {
                                        let turnedIn = ref(db, `schools/hvhs/users/${uid}/quizzes/turnedin/${key}`)
                                        onValue(pathRef, (turnedInSnapShot) => {
                                            if (turnedInSnapShot.val() === null) {
                                                console.log('no quiz was ever assigned, an error has occured for ' + uid)
                                            } else {
                                                console.log(turnedInSnapShot.val())

                                            }
                                        })
                                    } else {
                                        console.log(snapshot.val())
                                    }
                                })

                            }
                        }
                        setLoading(false)


                    }
                    compute()
                }
            })

        } else {

        }
    }, [loading, course, studentList])
    return (
        <>
            <p>Overall, your class is passing.</p>
        </>
    )
}