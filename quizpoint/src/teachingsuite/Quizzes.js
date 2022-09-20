/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
// import statements
import { user } from '../components/firebase/fb.user.js';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
// import { db, ref } from '../services/firebase.js';
// database
import { db } from '../services/firebase'

// components from libs
import { ref, onValue } from "firebase/database";
// import './ClassHome.css'
import './Quizzes.css'
// material ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
// Material UI for Styled Components
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Fab from '@mui/material/Fab';

/**========================================================================
 **                           Generate Push ID
 *?  What does it do? Generates push ids for firebase records (i.e quizzes, classes, users, etc.)
 *@return type
 *@credit mikelehen https://gist.github.com/mikelehen/3596a30bd69384624c11
 *========================================================================**/
let generatePushID = (function () {
    var PUSH_CHARS =
        "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
    var lastPushTime = 0;
    var lastRandChars = [];

    return function () {
        var now = new Date().getTime();
        var duplicateTime = now === lastPushTime;
        lastPushTime = now;

        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error("We should have converted the entire timestamp.");

        var id = timeStampChars.join("");

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        } else {
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if (id.length != 20) throw new Error("Length should be 20.");

        let returnVal = 'QUIZ_' + id
        return returnVal;
    };
})();


export default function Quizzes() {
    const [allQuizzes, setQuizzes] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const shouldFade = true;

    useEffect(() => {
        if (!loading) {
            document.title = 'Loading Quizzes | QuizPoint'
            let pathRef = ref(db, `/schools/hvhs/quizzes/`);
            onValue(pathRef, (snapshot) => {
                if (snapshot === undefined || snapshot === null) {
                    console.log("invalid class code")
                } else {
                    snapshot.forEach(childSnapshot => {
                        if (childSnapshot.cache) {
                            return;
                        } else {
                            let quiztoPush = childSnapshot.val()
                            quiztoPush.code = childSnapshot.key
                            allQuizzes.push(quiztoPush)
                        }
                    })
                    setLoading(true)

                    console.log(allQuizzes)

                }
            })
        } else {
            document.title = 'Quizzes | QuizPoint'
        }
    })
    if (!loading) {
        return (
            <div className="loading-container">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        )
    } else {
        let quizCards = allQuizzes.map((quizData, index) => {
            console.log(quizData)
            if (quizData.title === undefined) {
                return null
            } else {
                // just some JSX!
                return (
                    <div className="bg-slate-100 shadow-md w-[21rem] h-[23rem] rounded-lg border-slate-300 border">
                        <div className="w-auto h-20 rounded-t-lg">
                            <div className="flex bg-indigo-800 rounded-t-lg shadow-md justify-center items-center min-h-[5rem] text-white text-center font-medium text-lg border-b-[1px]">{quizData.title}</div>
                        </div>
                        <div className="h-auto">
                            <div className="flex justify-center items-center min-h-[10rem]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="block w-24 h-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>

                            </div>
                            <div className="flex h-20 pt-2 align-middle justify-center items-center rounded-b-lg ">
                                <button className="overflow-hidden bg-indigo-700 before:bg-primary-100 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500"><p className="relative z-0 text-white transition ease-in-out duration-500">Edit to be added soon</p></button>
                            </div>
                        </div>
                    </div>
                )
            }

        })
        return (
            <div className='flex justify-center flex-col items-center'>
                <div className="quiz-header py-8">
                    <h2>Quizzes created by your school</h2>
                    <button className="generic-button sml" onClick={() => navigate('/tcs/quizzes/create/' + generatePushID())} >Create Quiz</button>
                    <button className="generic-button sml" onClick={() => navigate('/tcs/quizzes/import/')}>Import Quiz</button>
                </div>
                <div className="justify-center grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quizCards}
                </div>

            </div>
        )
    }

}

