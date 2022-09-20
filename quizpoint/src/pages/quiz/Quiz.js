/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */


// Base imports from react
import axios from 'axios'

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom"
import { storage } from "../../services/firebase.js"
// user model
import { user } from '../../components/firebase/fb.user.js';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// firebase and db stuff
import { db } from '../../services/firebase'
import { ref, onValue, set, update, get, child, remove } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2';


// /**========================================================================
//  *                             Quiz Module
//  *========================================================================**/
export default function Quiz() {
    const [quiz, setQuiz] = useState(   )
    const [answers, setAnswers] = useState([])
    const [uploadAnswers, setUploadAnswers] = useState({ answers: {}, details: {}, score: {} })
    const [uploadURL, setuploadURL] = useState('')
    const [previousAnswers, setPreviousAnswers] = useState([])
    // 0 = loading 1 = loaded
    const [loadingStatus, setLoadingStatus] = useState(true)

    let { quizId } = useParams()
    let navigate = useNavigate()
    let path = {
        quiz: ref(db, `/schools/hvhs/quizzes/${quizId}`),
        activeUserQuiz: ref(db, `/schools/hvhs/users/${user.uid}/quizzes/active/${quizId}`),
    }


    // Loads Image from Firebase, without Async, images will inconsistently not load
    //NOTE: I DID NOT WRITE THIS PORTION OF CODE https://dev.to/diraskreact/react-async-image-loading-lka
    const AsyncImage = (props) => {
        const [loadedSrc, setLoadedSrc] = React.useState(null);
        React.useEffect(() => {
            setLoadedSrc(null);
            if (props.src) {
                const handleLoad = () => {
                    setLoadedSrc(props.src);
                };
                const image = new Image();
                image.addEventListener('load', handleLoad);
                image.src = props.src;
                return () => {
                    image.removeEventListener('load', handleLoad);
                };
            }
        }, [props.src]);
        if (loadedSrc === props.src) {
            return (
                <img {...props} className="object-cover h-60 w-52 pb-4"/>
            );
        }
        return null;
    };

    let handler = {
        handInQuiz: () => {
            get(path.activeUserQuiz).then((snapshot) => {
                if (snapshot.exists()) {
                    let quizSave = {};
                    quizSave[quizId] = snapshot.val();
                    console.log(quizSave)
                    update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/turnedin'), quizSave).then(() => {
                        // update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/turnedin/', { notEnrolled: false }))
                        remove(path.activeUserQuiz);
                    });
                    navigate('/Classes');
                } else {
                    console.log("Snapshot does not exist")
                }
            })
        },
        updateAnswer: (e, indexOfQuestion, indexOfAnswer, isImage) => {
            let isAnswerCorrect = "";
            //Check if answer inputted is correct 
            console.log(typeof quiz.questions[indexOfQuestion].answer)
            if (isImage) {
                answers.splice(indexOfQuestion, 1, {input: e, question: quiz.questions[indexOfQuestion].name, status: "correct"})
            }
            else {
                if (typeof quiz.questions[indexOfQuestion].answer === 'object') {
                    for (let i = 0; i < quiz.questions[indexOfQuestion].answer.length; i++) {
                        if (quiz.questions[indexOfQuestion].choices[indexOfAnswer] == quiz.questions[indexOfQuestion].answer[i].value) {
                            isAnswerCorrect = 'correct'
                            console.log(isAnswerCorrect)
                            i = quiz.questions[indexOfQuestion].answer.length;
                        } else {
                            isAnswerCorrect = 'incorrect'
                            console.log(isAnswerCorrect)
                        }
                    }
                } else {
                    if (quiz.questions[indexOfQuestion].choices[indexOfAnswer] == quiz.questions[indexOfQuestion].answer.value) {
                        isAnswerCorrect = 'correct'
                        console.log(isAnswerCorrect)
                    } else {
                        isAnswerCorrect = 'incorrect'
                        console.log(isAnswerCorrect)
                    }
                }
                answers.splice(indexOfQuestion, 1, {input: quiz.questions[indexOfQuestion].choices[indexOfAnswer], question: quiz.questions[indexOfQuestion].name, status: isAnswerCorrect})

            }
            //Tally correct and incorrect answers
            let correctTally = 0;
            let incorrectTally = 0;
            for (let i = 0; i < answers.length; i++) {
                if (answers[i].status === "correct") {
                    correctTally++;
                }
                if (answers[i].status === "incorrect") {
                    incorrectTally++;
                }
            }
            uploadAnswers.details = { code: quizId, name: quiz.title}
            uploadAnswers.answers = answers
            uploadAnswers.score = { total: quiz.questions.length, correct: correctTally, incorrect: incorrectTally }
            update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), uploadAnswers);
            console.log(answers)
            console.log(uploadAnswers)
        },
    }

    useEffect(() => {
        // grab quiz from db
        onValue(path.quiz, (snapshot) => {
            setQuiz(snapshot.val());
            for (let i=0; i< snapshot.val().questions.length; i++) {
                answers.push("Not Answered")
                previousAnswers.push("Not Answered")
            }
            get(path.activeUserQuiz).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log("snapshot does exist")
                    for (let i=0; i<snapshot.val().answers.length; i++) {
                        answers.splice(i, 1, snapshot.val().answers[i])
                        previousAnswers.splice(i, 1, snapshot.val().answers[i])
                    }
                    console.log(previousAnswers)
                    console.log(answers)
                } else {
                    console.log("Snapshot does not exist")
                    previousAnswers.splice(0, 1, "iuhieuhf8u32829y2hfu2h")
                }
                setLoadingStatus(false)
            })
        })


    }, [

    ])
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    // if quiz isn't loaded, show blank screen
    if (loadingStatus) return
    return (
        <div className="md:p-12 p-4">
            <h1 className="font-medium text-4xl text-center pb-2">{quiz.title} </h1>
            <h2 className="font-medium text-2xl text-center">{quiz.description}</h2>
            {quiz.questions.map((question, indexFirst) => {
                return (
                    <div className="flex md:justify-center">
                        <div className="bg-gray-50 md:border-4 md:border-dashed md:w-3/5 w-full my-8 md:p-8 min-h-[100px] rounded-lg">
                            <div className="  pb-8 flex flex-row justify-between">
                                <p className="text-3xl font-medium">{question.name}</p>
                                <p className="text-xl underline underline-offset-8 font-light">{(indexFirst + 1) + `/` + (quiz.questions.length)}</p>
                            </div>
                            {question.image !== undefined && 
                                <div>
                                    <AsyncImage src={question.image}/>
                                </div>
                            }
                            <div className="flex flex-col">
                                <form id="questionForm"></form>
                                {/* Format for older quizzes created in quizpoint */}
                                {console.log(question)}
                                {question.type === "multichoice" && 
                                    question.choices.map((choice, indexSecond) => {
                                        let randomId = choice + Math.random(10)
                                        return (
                                            <>
                                                <div className="relative peer-checked:bg-indigo-800 my-1">
                                                    <input value={choice} type="radio" name={indexFirst} id={randomId} className="hidden peer" onChange={(e) => {handler.updateAnswer(e, indexFirst, indexSecond, false)}}></input>
                                                    {choice == previousAnswers[indexFirst].input &&   
                                                        <label htmlFor={randomId} className="flex gap-4 p-4 text-lg font-medium rounded-lg cursor-pointer  peer-checked:bg-indigo-800 peer-checked:text-white border-dashed bg-neutral-300 peer-checked:border-0 transition delay-75">{choice}</label>
                                                    }
                                                    {choice != previousAnswers[indexFirst].input &&   
                                                        <label htmlFor={randomId} className="flex gap-4 p-4 text-lg font-medium rounded-lg cursor-pointer  peer-checked:bg-indigo-800 peer-checked:text-white border-dashed bg-neutral-200 peer-checked:border-0 transition delay-75">{choice}</label>
                                                    }
                                                </div>
                                            </>
                                        )
                                    })
                                }
                                {/* format for google forms */}
                                {question.inputtype === "multichoice" && 
                                    question.choices.map((choice, indexSecond) => {
                                        let randomId = choice + Math.random(10)
                                        return (
                                            <>
                                                <div className="relative peer-checked:bg-indigo-800 my-1">
                                                    <input value={choice} type="radio" name={indexFirst} id={randomId} className="hidden peer" onChange={(e) => {handler.updateAnswer(e, indexFirst, indexSecond, false)}}></input>
                                                    {choice == previousAnswers[indexFirst].input &&   
                                                        <label htmlFor={randomId} className="flex gap-4 p-4 text-lg font-medium rounded-lg cursor-pointer  peer-checked:bg-indigo-800 peer-checked:text-white border-dashed bg-neutral-300 peer-checked:border-0 transition delay-75">{choice}</label>
                                                    }
                                                    {choice != previousAnswers[indexFirst].input &&   
                                                        <label htmlFor={randomId} className="flex gap-4 p-4 text-lg font-medium rounded-lg cursor-pointer  peer-checked:bg-indigo-800 peer-checked:text-white border-dashed bg-neutral-200 peer-checked:border-0 transition delay-75">{choice}</label>
                                                    }
                                                </div>
                                            </>
                                        )
                                    })
                                }
                                {/* Images  */}
                                {question.type === "imageupload" && 
                                    <>
                                        <div>
                                            <input type="file" id="file" name="file" accept="image/*" onChange={(e) => {
                                                let file = e.target.files[0];
                                                let storagePath = 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId + '/' + indexFirst + '/QUIZPOINT_QUIZ_' + quizId + '_' + indexFirst;
                                                let storageRef = sRef(storage, storagePath);
                                                    uploadBytes(storageRef, file).then((snapshot) => {
                                                        console.log("Uploaded Image to " + storagePath);
                                                        getDownloadURL(sRef(storage, storagePath))
                                                        .then((url) => {
                                                            // `url` is the download URL
                                                            handler.updateAnswer(url, indexFirst, false, true)
                                                        })
                                                })
                                            }}/>
                                        </div>
                                    </>
                                }
                                {question.inputtype === "imageupload" &&
                                    <>
                                        <div>
                                            <input type="file" id="file" name="file" accept="image/*" onChange={(e) => {
                                                let file = e.target.files[0];
                                                let storagePath = 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId + '/' + indexFirst + '/QUIZPOINT_QUIZ_' + quizId + '_' + indexFirst;
                                                let storageRef = sRef(storage, storagePath);
                                                    uploadBytes(storageRef, file).then(() => {
                                                    console.log("Uploaded Image to " + storagePath);
                                                    getDownloadURL(sRef(storage, storagePath))
                                                    .then((url) => {
                                                        // `url` is the download URL
                                                        handler.updateAnswer(url, indexFirst, false, true)
                                                    })
                                                })
                                            }}/>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                )
            })}

            <div className="flex justify-center">
                <button className="" onClick={() => {handler.handInQuiz()}}>Hand In Quiz</button>
            </div>
        </div>
    )
}
// export default function Quiz() {
//     const [quiz, setQuiz] = useState()
//     const [currentQuestion, setCurrentQuestion] = useState(0)
//     const [loadingStatus, setLoadingStatus] = useState(true)
//     const [chosenAnswers, setChosenAnswers] = useState({ answers: {}, details: {}, score: {} })
//     const [correctAnswers, setCorrectAnswers] = useState()
//     let navigate = useNavigate();
//     let { quizId } = useParams()
//     let studentId = user.uid
//     let quizPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
//     let quizInStudentPath = ref(db, `schools/hvhs/users/${user.uid}/quizzes/active/${quizId}`);
//     let quizAnswersInStudentPath = ref(db, `schools/hvhs/users/${user.uid}/quizzes/active/${quizId}/answers`)
//     let studentPath = ref(db, `/schools/hvhs/quizzes/${quizId}`);
//     // `schools/users/${studentId}/quizzes/turnedin/${quizId}`
//     // Stepper Variables
//     // useEffect operates when the page loads. This finds the quiz in firebase and sets it to the state 'quiz'
//     useEffect(() => {
//         onValue(quizPath, (snapshot) => {
//             setQuiz(snapshot.val());
//             setLoadingStatus(false);
//             console.log("Quiz Id: " + quizId)
//             console.log("Quiz Path: " + quizPath)
//             console.log(snapshot.val())
//             setLoadingStatus(false)

//         })
//     }, [])

//     function recordQuizResultInActive() {
//         console.log("recordQuizResultInActive(): Called ")
//         get(quizInStudentPath).then((snapshot) => {
//             if (snapshot.exists()) {
//                 let quizSave = {};
//                 quizSave[quizId] = snapshot.val();
//                 console.log(quizSave)
//                 let correctAnswers = 0;
//                 let wrongAnswers = 0;
//                 for (const key in quizSave[quizId].answers) {
//                     if (`${quizSave[quizId].answers[key].status}` === "correct") {
//                         correctAnswers++
//                     }
//                     if (`${quizSave[quizId].answers[key].status}` === "incorrect") {
//                         wrongAnswers++
//                     }
//                     quizSave[quizId].score = { correct: correctAnswers, incorrect: wrongAnswers, total: quiz.questions.length }
//                 }
//                 console.log("Saving Result")
//                 update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active'), quizSave)
//             }
//         })
//     }
//     let quizHandler = {
//         // When "Next" is clicked, cycle through to the next question
//         nextQuestion: () => {
//             console.log("quizHandler.nextQuestion(): Called");
//             // If last question
//             if (currentQuestion === (quiz.questions.length - 1)) {
//                 update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
//                 Swal.fire({
//                     title: 'Do you want to finish quiz?',
//                     showDenyButton: true,
//                     denyButtonText: "Back",
//                     confirmButtonText: "Finish",
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         console.log("quizHandler.nextQuestion(), User Finished Quiz")
//                         get(quizInStudentPath).then((snapshot) => {
//                             if (snapshot.exists()) {
//                                 let quizSave = {};
//                                 quizSave[quizId] = snapshot.val();
//                                 console.log(quizSave)
//                                 let correctAnswers = 0;
//                                 let wrongAnswers = 0;
//                                 for (const key in quizSave[quizId].answers) {
//                                     if (`${quizSave[quizId].answers[key].status}` === "correct") {
//                                         correctAnswers++
//                                     }
//                                     if (`${quizSave[quizId].answers[key].status}` === "incorrect") {
//                                         wrongAnswers++
//                                     }
//                                     quizSave[quizId].score = { correct: correctAnswers, incorrect: wrongAnswers, total: quiz.questions.length }
//                                 }
//                                 update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/turnedin'), quizSave).then(() => {
//                                     // update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/turnedin/', { notEnrolled: false }))
//                                     remove(quizInStudentPath);
//                                 });
//                                 navigate('/Classes');
//                             } else {
//                                 console.log("Snapshot does not exist")
//                             }
//                         })


//                     } else if (result.isDenied) {
//                         console.log("Quiz Not Completed")
//                     }
//                 })
//             }else {
//                 setCurrentQuestion(currentQuestion + 1);
//                 return
//             }

//         },
//         //When "Back" is clicked, cycle through to the last question
//         lastQuestion: () => {
//             console.log("quizHandler.lastQuestion(): Called");
//             if (currentQuestion === 0) return
//             setCurrentQuestion(currentQuestion - 1);
//         },
//         recordAnswer: (answer, isImage) => {
//             console.log("quizHandler.recordAnswer(): Called");
//             if (isImage === true) {
//                 chosenAnswers.answers[currentQuestion] = {
//                     input: answer,
//                     question: quiz.questions[currentQuestion].name,
//                     status: "correct"
//                 }
//             } else if (isImage === false) {
//                 // Check if multiple answers to quiz
//                 if (Array.isArray(quiz.questions[currentQuestion].answer) === true) {
//                     // Checks if answer matches any of the multi choice
//                     for (let i = 0; i < quiz.questions[currentQuestion].answer.length; i++) {
//                         console.log("Answers: " + quiz.questions[currentQuestion].answer[i].value);
//                         if (quiz.questions[currentQuestion].answer[i].value == answer) {
//                             chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };
//                         } else if (quiz.questions[currentQuestion].answer[i].value != answer) {
//                             chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
//                         }
//                     }
//                     // If only one answer to quiz
//                 } else if (Array.isArray(quiz.questions[currentQuestion].answer) === false) {
//                     console.log("Answer is not in an array");
//                     // Correct Answer
//                     if (quiz.questions[currentQuestion].answer == answer) {
//                         chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "correct" };

//                         // Wrong Answer
//                     } else if (quiz.questions[currentQuestion].answer != answer) {
//                         chosenAnswers.answers[currentQuestion] = { input: answer, question: quiz.questions[currentQuestion].name, status: "incorrect" };
//                     }
//                 }
//             }
//             chosenAnswers.details = { code: quizId, name: quiz.title }
//             console.log("Uploading Results...")
//             update(ref(db, 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId), chosenAnswers);
//             recordQuizResultInActive();
//             quizHandler.nextQuestion()
//         },

//         generateImage: () => {
//             console.log("quizHandler.generateImage(): Called");

//             if (quiz.questions[currentQuestion].image) {
//                 return <img alt="Quiz Question Image" src={quiz.questions[currentQuestion].image}></img>
//             }
//         }
//     }

//     //If the website is still "loading..." don't display anything
//     if (loadingStatus === true) return
//     function CheckImage(path) {
//         axios
//             .get(path)
//             .then(() => {
//                 return true;
//             })
//             .catch(() => {
//                 return false;
//             });
//     }
//     //HTML
//     return (
//         <div className="quizPage">
//             <div className="quizTitle">
//                 <p>{quiz.title}</p>
//             </div>
//             <div className="quizContainer">
//                 <div className="quizQuestionTitle">
//                     <p>{quiz.questions[currentQuestion].name}</p>
//                     <p className="quizQuestionCounter">{currentQuestion + 1} / {quiz.questions.length}</p>
//                 </div>
//                 <div className="quizContent">
//                     <div className="quizQuestionImage">{quizHandler.generateImage()}</div>
//                     <div className="quizButtons">
//                         {quiz.questions[currentQuestion].inputtype != "imageupload" &&
//                             <div className="quizQuestionAnswers">
//                                 {/* If there are four or less buttons */}
//                                 {quiz.questions[currentQuestion].choices.length <= 4 &&
//                                     <div className="largeButtonGroup">
//                                             {quiz.questions[currentQuestion].choices.map(answer => {
//                                                 return <Button variant="contained" className="quizAnswerButtons" style={{ textTransform: "none" }} onClick={() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
//                                             })}
//                                     </div>
//                                 }
//                                 {/* If there are more than four buttons (Needed to fit neatly onto page) */}
//                                 {quiz.questions[currentQuestion].choices.length > 4 &&
//                                     <div className="largeButtonGroup hasMoreThanFourButtons">
//                                             {quiz.questions[currentQuestion].choices.map(answer => {
//                                                 return <Button variant="contained" className="quizAnswerButtons" style={{ textTransform: "none" }} onClick={() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
//                                             })}
//                                     </div>
//                                 }
//                                 {/* If there are more than four buttons on a small screen */}
//                                 <div className="smallButtonGroupLarge">
//                                     {quiz.questions[currentQuestion].choices.length > 4 &&
//                                         quiz.questions[currentQuestion].choices.map(answer => {
//                                             return <Button variant="contained" className="quizAnswerButtons" style={{ textTransform: "none" }} onClick={() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
//                                         })
//                                     }
//                                 </div>
//                                 {/* If there are less than or equal to 4 buttons on a small screen */}
//                                 <div className="smallButtonGroup">
//                                     {quiz.questions[currentQuestion].choices.length <= 4 &&
//                                         quiz.questions[currentQuestion].choices.map(answer => {
//                                             return <Button variant="contained" className="quizAnswerButtons" style={{ textTransform: "none" }} onClick={() => quizHandler.recordAnswer(answer, false)} key={answer}><p>{answer}</p></Button>
//                                         })
//                                     }
//                                 </div>
//                             </div>
//                         }
//                         {quiz.questions[currentQuestion].inputtype === "imageupload" &&
//                             <div className="quizImageUpload">
//                                 <input type="file" id="file" name="file" accept="image/*" onChange={(e) => {
//                                     let file = e.target.files[0];
//                                     let storagePath = 'schools/hvhs/users/' + user.uid + '/quizzes/active/' + quizId + '/' + currentQuestion + '/QUIZPOINT_QUIZ_' + quizId + '_' + currentQuestion;
//                                     let storageRef = sRef(storage, storagePath);
//                                     uploadBytes(storageRef, file).then((snapshot) => {
//                                         console.log("Uploaded Image to " + storagePath);
//                                     })
//                                     quizHandler.recordAnswer(storagePath, true);
//                                 }} />
//                             </div>
//                         }
//                         <div className="quizNavigationButtons">
//                             <Button variant="outlined" style={{ textTransform: "none" }} onClick={quizHandler.lastQuestion}>Back</Button>
//                             <Button variant="contained" color="success" style={{ textTransform: "none" }} onClick={quizHandler.nextQuestion}>Next</Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }