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
    const [passed, setPass] = useState(0)
    const [failed, setFail] = useState(0)
    useEffect(() => {
        if (loading) {
            console.log(course)
            let pathRef = ref(db, 'schools/hvhs/classes/' + course.code)
            onValue(pathRef, (snapshot) => {
                if (snapshot.val() === null) {
                    setStatement('Class was not found, an error has occured')
                } else {
                    console.log(snapshot.val())
                    async function compute() {
                        console.log('ran')

                        setList(snapshot.val().students);
                        console.log(studentList)
                        for (let [key, value] of Object.entries(snapshot.val().students)) {
                            studentList.push(key)
                        }

                        console.log(studentList)
                        let quiz
                        let quizzesAssignedToClass = snapshot.val().quizzes
                        for (var quizId in quizzesAssignedToClass) {

                        }
                        console.log(quizzesAssignedToClass)
                        for await (let [key, value] of Object.entries(quizzesAssignedToClass)) {
                            computeFurther(key);
                        }
                        setLoading(false)



                    }
                    compute()
                }

                function computeFurther(key) {
                    console.log(`${key}`);

                    loadStudentData(key);
                }

                async function loadStudentData(key) {
                    console.log('raner')
                    for await (const element of studentList) {
                        console.log('raner')
                        console.log(element);
                        let uid = element;
                        let pathRef = ref(db, `schools/hvhs/users/${uid}/quizzes/active/${key}`);
                        // eslint-disable-next-line no-loop-func
                        onValue(pathRef, (snapshot) => {
                            if (snapshot.val() === null) {
                                let turnedIn = ref(db, `schools/hvhs/users/${uid}/quizzes/turnedin/${key}`);
                                onValue(pathRef, (turnedInSnapShot) => {
                                    if (turnedInSnapShot.val() === null) {
                                        console.log(uid, 'no quiz was ever assigned, an error has occured for ' + uid);

                                    } else {
                                        console.log('Turnedin:', uid, turnedInSnapShot.val());

                                        if (turnedInSnapShot.val().score.correct === turnedInSnapShot.val().score.total) {
                                            setPass(passed + 1)
                                        } else {
                                            setFail(failed + 1)
                                        }
                                    }
                                });
                            } else {
                                console.log('Active: ', uid, snapshot.val());
                                if (snapshot.val().total === 0) {
                                    setFail(failed + 1)
                                } else {
                                    if (snapshot.val().score.correct === snapshot.val().score.total) {
                                        setPass(passed + 1)
                                    } else {
                                        setFail(failed + 1)
                                    }
                                }
                            }
                        });

                    }


                }
            })

        } else {
            console.log('Passed:', passed)
            console.log('Failed:', failed)
        }
    }, [loading, course, studentList, passed, failed])
    return (
        <>
            <p>Overall, {passed} have passed and {failed} have failed.</p>
        </>
    )
}