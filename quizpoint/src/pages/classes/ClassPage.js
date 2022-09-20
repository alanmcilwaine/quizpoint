/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */


import { useParams, useNavigate } from "react-router-dom"
import { user } from '../../components/firebase/fb.user.js'
import React, { useState, useEffect } from 'react'
// database
import { db } from '../../services/firebase'
import { alert } from '../../services/Alert'
// components from libs
import { ref, onValue } from "firebase/database";
// compenets from ui
import Viewer from '../../components/pdf/Viewer'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import AssignQuiz from "../../teachingsuite/AssignQuiz"
import GenerateInvite from "../../teachingsuite/GenerateInvite";
// responsive design
import { useMediaQuery } from 'react-responsive';
// quiz doughnut chart
import QuizPerformance from '../../components/classes/QuizPerformance';
import { Doughnut } from 'react-chartjs-2';
import InviteQR from "../../services/InviteQR"
import ClassProgress from "../../components/reports/ClassProgress"
import QuizCards from "../../components/cards/QuizCards"
import Heading from "../../components/construct/Heading"
import Reports from "../../components/reports/Reports.js"
// array for
export default function ClassPage() {
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const navigate = useNavigate()
    const [loading, dataComplete] = useState(false)
    const [classObject, setClass] = useState()
    const [quizCards, addQuizCard] = useState([])
    const [quizTurnedCards, addQuizTurnedInCard] = useState([])
    const [quizActive, setQuizActive] = useState([])
    const [quizTurnedIn, setQuizTurnedIn] = useState([])
    const [currentNum, setCurrentNum] = useState(0)
    const [toBeat, setToBeat] = useState(0)
    const [shouldFade, fadeEnabled] = useState(true)
    // const []
    let classArray = []
    let { classId } = useParams()


    console.log(classId)
    useEffect(() => {
        if (loading === true) {
            document.title = classObject.className + ' | QuizPoint'

        } else {
            document.title = 'Loading Class | QuizPoint'

            function loadData() {
                console.log("loading class data")
                const pathRef = ref(db, `/schools/hvhs/classes/${classId}`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    // if there is no students, something definelty went wrong.
                    if (snapshot.val() === null) {
                        console.log('ERROR - NO DATA FOUND')
                        alert.error('Class not found', 'No data found for this class, probably does not exist')
                        fadeEnabled(false)
                        // if students do exist
                    } else {
                        // set placeholder to object of students
                        const data = snapshot.val()
                        setClass(data)
                        if (data.quizzes === false) {
                            let plceholderArrary = [{ error: 'No quizzes avaliable' }]
                            addQuizCard(plceholderArrary.map((qz) =>
                                <div>
                                    <p>{qz.error}</p>
                                </div>
                            ))
                            dataComplete(true)

                        } else {
                            Object.keys(data.quizzes).forEach((key) => {
                                if (data.quizzes[key].name === undefined) {
                                    // skip
                                } else {
                                    console.log(key)
                                    if (user.quizzes.turnedin[key] === undefined) {
                                        let quiz = data.quizzes[key]
                                        quizActive.push(quiz)
                                    } else {
                                        let quiz = data.quizzes[key]
                                        quizTurnedIn.push(quiz)
                                    }

                                }

                            })

                            if (!data.students) {
                                addQuizTurnedInCard(quizTurnedIn.map((qz) =>
                                    <>
                                        {console.log(qz)}
                                        {console.log("adding new quiz")}
                                        {/* if (user.quizzes.turnedin[qz.code].score === undefined) {
                                //             update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
                                
                            } */}
                                        <QuizCards quiz={qz} user={user} status="completed" page="ClassPage" graphType="doughnut" />
                                    </>
                                ))

                                addQuizCard(quizActive.map((qz) =>
                                    <>
                                        {console.log(user.quizzes)}
                                        {console.log("adding new quiz")}
                                        <QuizCards quiz={qz} user={user} status="assigned" page="ClassPage" graphType="bar" />
                                    </>
                                    // <div className="quiz-card">
                                    //     <Card sx={{ width: 280, height: 310 }}>
                                    //         <CardContent>
                                    //             <Typography variant="h6">
                                    //                 {qz.name}
                                    //             </Typography>
                                    //         </CardContent>
                                    //         <CardActions>
                                    //             <QuizPerformance correct={0} incorrect={0} total={1} />
                                    //             {user.role  === 'teacher' ? <p>An error occured</p> : null}
                                    //             <Button size="small" onClick={() => navigate(`/quiz/${qz.code}`)}><p class="start-quiz-button">Start Quiz</p></Button>
                                    //         </CardActions>
                                    //     </Card>
                                    // </div>
                                ))
                            } else {
                                addQuizTurnedInCard(quizTurnedIn.map((qz) =>
                                <>
                                    <div className="bg-slate-100 shadow-md w-[21rem] h-[23rem] rounded-lg border-slate-300 border">
                                        <div className="w-auto h-20 rounded-t-lg">
                                            <div className="flex bg-indigo-800 rounded-t-lg shadow-md  px-2 justify-center text-center items-center min-h-[5rem] text-white font-medium text-lg border-b-[1px]">{qz.name}</div>
                                        </div>
                                        <div className="h-auto">
                                            <div className="flex justify-center items-center min-h-[10rem]">
                                            <QuizPerformance correct={user.quizzes.turnedin[qz.code].score.correct} incorrect={user.quizzes.turnedin[qz.code].score.incorrect} total={user.quizzes.turnedin[qz.code].score.total} />
                                            </div>
                                            <div className="flex h-20 pt-2 align-middle justify-center items-center rounded-b-lg ">
                                                {user.role === 'teacher' ? <ClassProgress quizId={qz.code} studentList={data.students}></ClassProgress> : null}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="quiz-card">
                                        <Card sx={{ width: 280, height: 310 }}>
                                            <CardContent>
                                                <Typography variant="h6">
                                                    {qz.name}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <QuizPerformance correct={user.quizzes.turnedin[qz.code].score.correct} incorrect={user.quizzes.turnedin[qz.code].score.incorrect} total={user.quizzes.turnedin[qz.code].score.total} />
                                                {user.role === 'teacher' ? <ClassProgress quizId={qz.code} studentList={data.students}></ClassProgress> : null}

                                            </CardActions>
                                        </Card>
                                    </div> */}
                                </>
                                ))

                                addQuizCard(quizActive.map((qz) =>
                                    <QuizCards quiz={qz} user={user} status="assigned" page="ClassPage" graphType="bar" />
                                ))

                            }

                            // for each student value
                            console.log(data)

                            console.log(quizActive)
                            dataComplete(true)

                        }



                        // finished loading, we can show page now
                    }
                })

            }
            loadData()


        }
    }, [loading])

    if (loading === true) {

        function returnTeacherActions() {
            console.log(user)
            if (user.role === 'teacher' || user.role === 'hod') {
                console.log(classObject)
                for (var studentID in classObject.students) {
                    classArray.push(studentID)
                }
                return (
                    <div className="flex basis-1/6 w-3/5 pb-4 flex-row bg-white justify-center rounded-b-lg mb-4">
                        <AssignQuiz classList={classArray} classId={classId}></AssignQuiz>
                        <button onClick={() => { navigate('/tcs/students/' + classId) }} ><p>View Students</p></button>
                        <Reports context={'class'} data={classObject} />

                        <GenerateInvite classObject={classObject} classId={classId}></GenerateInvite>
                        <InviteQR classObject={classObject}></InviteQR>
                    </div>
                    /* <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <AssignQuiz classList={classArray} classId={classId}></AssignQuiz>
                        <Button onClick={() => { navigate('/tcs/reports/class/' + classId) }} ><p>View Report</p></Button>
                        <Button onClick={() => { navigate('/tcs/students/' + classId) }} ><p>View Students</p></Button>

                        <GenerateInvite classObject={classObject} classId={classId}></GenerateInvite>
                        <InviteQR classObject={classObject}></InviteQR>
                    </ButtonGroup> */
                )
            } else if (user.role === undefined) {
                return
            }
        }
        console.log(quizCards)
        return (
            <Fade in={shouldFade}>
                <div className="class-page">
                    <div className="flex w-full h-56 justify-center flex-col items-center ">
                        <div className="w-3/5 basis-5/6 flex md:bg-white justify-center lg:shadow flex-col lg:mb-0 mb-4 items-center rounded-t-lg mt-4">
                            <p className="text-5xl md:text-4xl tracking-tight font-bold text-gray-900">{classObject.className}</p>
                        </div>
                        {isTabletOrMobile ? null : returnTeacherActions()}

                        {/* <h1>{classObject.className}</h1> */}
                    </div>
                    <div className="class-body">

                        <div className="quizassigned">
                            <Heading text={"Assigned"} />
                            <div className="flex justify-center">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                                    {quizCards}
                                </div>
                            </div>
                        </div>
                        <div className="quizcompleted">
                            <Heading text={"Completed"} />
                            <div className="flex justify-center">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                                    {quizTurnedCards}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <PDF type={'class'} course={classObject} /> */}
                </div>
            </Fade>
        )

    } else {
        return (
            <div>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div >
        );

    }
}