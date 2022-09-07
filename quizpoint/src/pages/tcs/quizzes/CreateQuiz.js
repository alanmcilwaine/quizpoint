// /*
//  * Copyright (c) 2022 QuizPoint
//  * All rights reserved.
//  */

// /**========================================================================
//  * ?  CreateQuiz Component
//  *========================================================================**/
// // Styles
// import './CreateQuiz.css'

// React and Firebase loads
import { useParams, useNavigate } from "react-router-dom"
import React, { useState } from 'react'
import Heading from '../../../components/construct/Heading'
import CreateQuizTable from '../../../components/quizzes/CreateQuizTable'
// database
import { db } from '../../../services/firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { set } from "firebase/database";
import { ref as dbRef } from "firebase/database";
import Compressor from 'compressorjs';

// material ui
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ReactTagInput from "@pathofdev/react-tag-input";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
// tag inputs
import "@pathofdev/react-tag-input/build/index.css";
// const Input = styled('input')({
//     display: 'none',
// });

// /**========================================================================
//  **                           Create Quiz
//  *?  What does it do? Component for creating a quiz
//  *========================================================================**/
function CreateQuiz(props) {
    const [answers, setAnswers] = useState('')
    const [questions, setQuestions] = useState([])
    const [questionName, setQuestionName] = useState('')
    const [submittedAnswers, setSubmittedAnswers] = useState([])
    const [updateDOM, setUpdateDOM] = useState([])
    let submitAnswers = []

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handler = {
        submitQuestion: (e) => {
            e.preventDefault();
            questions.push({title: questionName, choices: submittedAnswers})
            handler.reset()
            console.log("Questions:")
            console.log(questions)
        },
        submitAnswer: (e) => {
            e.preventDefault()
            submittedAnswers.push({ text: answers, correct: false})
            setAnswers('');
            return (
                <input type="text" id="disabled-input" aria-label="disabled input" class="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value="Disabled input" disabled></input>
            )
        },
        questionChange: (e) => {
            setQuestionName(e.target.value);
        },
        answerChange: (e) => {
            setAnswers(e.target.value);
        },
        reset: (e) => {
            setAnswers('')
            setQuestionName('')
            setSubmittedAnswers([])
        }
    }

    return (
        <>
            <Heading text={"Create Quiz"}></Heading>
            <div>
                <button className="absolute left-72">Save Quiz</button>
                <div className="items-center flex flex-col mt-8">
                    <label className="block mb-2 p-2 text-md font-medium text-black">Quiz Name</label>
                    <input type="text" placeholder="Basic facts test" className=" border border-indigo-800 text-indigo-800 text-sm rounded-lg w-1/3 h-16 p-2.5 " required></input>
                    <label className="block mb-2 p-2 text-md font-medium text-black">Quiz Description</label>
                    <input type="text" placeholder="..." className=" border border-indigo-800 text-indigo-800 text-sm rounded-lg w-1/3 h-16 p-2.5 " required></input>
                </div>
                <div className="flex flex-row my-4 justify-center">
                    <div className="order-1 basis-1/5">
                            <form id="questionForm" onSubmit={handler.submitQuestion}></form>
                            <label className="block mb-2 p-2 text-md font-medium text-black">Question Name</label>
                            <input type="text" placeholder="What is the meaning of life..?" value={questionName} onChange={handler.questionChange} className=" border border-indigo-800 text-indigo-800 text-sm rounded-lg w-4/5 h-16 p-2.5 " required></input>
                            <label className="block mb-2 p-2 text-md font-medium text-black">Answers</label>
                            <form id="answerForm" onSubmit={handler.submitAnswer}></form>
                            <div className="flex flex-row">
                                <input type="text" placeholder="Add an answer" value={answers} onChange={handler.answerChange} name="answers" className="border border-indigo-800 text-indigo-800 text-sm rounded-tl-lg rounded-bl-lg w-3/5 h-16 p-2.5 " required></input>
                                <button form="answerForm" className="h-16 p-2.5 w-1/5 rounded-r-lg rounded-none shadow-none border"><p className="flex justify-center items-center text-3xl">+</p></button>
                            </div>
                            {submittedAnswers.map((answer, index) => {
                                if (Object.keys(answer).length === 0) { return }
                                return (
                                    <>
                                        <div className="flex flex-row" id={index}>
                                            <input disabled type="text" aria-label="disabled input" value={answer.text} name="answers" className="border border-indigo-800 text-indigo-800 text-sm rounded-none w-3/5 h-16 p-2.5 " required></input>
                                            <button onClick={() => {submittedAnswers.splice(index, 1); setUpdateDOM(Math.random(100)) }} className="h-16 p-2.5 w-1/5 rounded-none shadow-none border"><p className="text-3xl">-</p></button>
                                            <button onClick={() => {answer.correct = !answer.correct; setUpdateDOM(Math.random(100)) }} className={classNames(
                                                answer.correct ? 'bg-green-500' : 'bg-red-500', "h-16 p-2.5 w-1/5 rounded-none shadow-none border",
                                            )}></button>
                                        </div>
                                    </>

                                )
                            })}
                            <button className="my-8" form="questionForm">Add Question</button>
                    </div>
                    <div className="order-2 basis-3/5">
                        <label className="block mb-2 p-2 text-md font-medium text-black">Questions</label>
                        <CreateQuizTable question={questions}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateQuiz;
// export default function CreateQuiz() {
//     // create ref to quiz id
//     let { id } = useParams()
//     // navigate for navigating off
//     const navigate = useNavigate();
//     // base table data (quesiton data)
//     let tableData = [{
//         name: "",
//         type: "multichoice",
//         choices: [""],
//         image: '',
//         uploadState: false
//     }]

//     // states for use in program
//     const [tableRows, addTableRow] = useState(tableData)
//     const [quizName, setQuizName] = useState("")
//     const [quizDesc, setQuizDesc] = useState("")
//     const [shouldFade, setFade] = useState(true)
//     const [currentQuestion, setCurrentQuestionNum] = useState(1)

//     const [tags, setTags] = React.useState([])
//     const [options, updateOptions] = useState()
//     const [open, setOpen] = React.useState(false);

//     //! Below code has stopped working properly since dialog was added
//     // // if quiz is being edited, prevent accidental reloads
//     // window.onbeforeunload = function () {
//     //     return "You are currently creating a class, reloading will loose all of your progress.";
//     // }

//     /**======================
//      **   updateCurrentQuesitonName
//      *? Called each time input is changed for name of question
// =     *========================**/
//     function updateCurrentQuestionName(e) {
//         tableRows[currentQuestion - 1].name = e.target.value
//     }

//     /**======================
//  **   updateCurrentQuesitonType
//  *? Called each time input is changed for type of question
// =     *========================**/
//     function updateCurrentQuestionType(e) {
//         tableRows[currentQuestion - 1].type = e.target.value
//     }
//     /**======================
//  **   updateCurrentQuestionAnswer
//  *? Called each time input is changed for answer of question
// =     *========================**/
//     function updateCurrentQuestionAnswer(e) {
//         tableRows[currentQuestion - 1].answer = e.target.value
//         console.log(tableRows)
//     }

//     /**======================
//  **   updateQuizName
//  *? Called each time input is changed for name of quiz
// =     *========================**/
//     function updateQuizName(e) {
//         setQuizName(e.target.value)
//     }

//     /**======================
//  **   updateQuizDesc
//  *? Called each time input is changed for description of question
// =     *========================**/
//     function updateQuizDesc(e) {
//         setQuizDesc(e.target.value)

//     }

//     /**==============================================
//      **              handleChange
//      *?  What does it do? Handles image uploading for question
//      *@called from: Upload Button
//      *=============================================**/
//     function handleChange(e) {
//         // set image reference for backup purposes
//         tableRows[currentQuestion - 1].image = e.target.value
//         // image is being uploaded
//         tableRows[currentQuestion - 1].uploadState = true
//         // references
//         let file = e.target.files[0]
//         /**==============================================
//          **              Compressor
//          *?  What does it do? compresses quiz question media to 60% of quaility (40% decrease to save space)
//          *=============================================**/
//         new Compressor(file, {
//             quality: 0.6,
//             // The compression process is asynchronous,
//             // which means you have to access the `result` in the `success` hook function.
//             success(result) {
//                 console.log(result)
//                 // The third parameter is required for server
//                 // reference to firebase lib
//                 const storage = getStorage();
//                 // create reference to new image
//                 const storageRef = ref(storage, "QUIZPOINT_QUIZ_IMAGES_" + id + currentQuestion);
//                 // metadata so image is uploaded properly
//                 const metadata = {
//                     contentType: 'image/jpeg',
//                 };

//                 //? code from firebase examples
//                 // 'file' comes from the Blob or File API
//                 const uploadTask = uploadBytesResumable(storageRef, result, metadata);

//                 // Listen for state changes, errors, and completion of the upload.
//                 uploadTask.on('state_changed',
//                     (snapshot) => {
//                         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//                         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                         console.log('Upload is ' + progress + '% done');
//                         switch (snapshot.state) {
//                             case 'paused':
//                                 console.log('Upload is paused');
//                                 break;
//                             case 'running':
//                                 console.log('Upload is running');
//                                 break;
//                         }
//                     },
//                     (error) => {
//                         // A full list of error codes is available at
//                         // https://firebase.google.com/docs/storage/web/handle-errors
//                         switch (error.code) {
//                             case 'storage/unauthorized':
//                                 // User doesn't have permission to access the object
//                                 break;
//                             case 'storage/canceled':
//                                 // User canceled the upload
//                                 break;

//                             // ...

//                             case 'storage/unknown':
//                                 // Unknown error occurred, inspect error.serverResponse
//                                 break;
//                         }
//                     },
//                     () => {
//                         // Upload completed successfully, now we can get the download URL
//                         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                             // set image url to question
//                             tableRows[currentQuestion - 1].image = downloadURL
//                         });
//                     }
//                 );
//                 // Send the compressed image file to server with XMLHttpRequest.

//             },
//             error(err) {
//                 console.log(err.message);
//             },
//         });


//     }

//     /**==============================================
//      **              updateCurrentQuestionOptions
//      *?  What does it do? Takes all options inputted into the tag, and adds it
//      *=============================================**/
//     function updateCurrentQuestionOptions(items) {
//         // for each option
//         for (var index = 0; index < items.length; index++) {
//             // if option is empty
//             if (items[index] === "") {
//                 // remove it
//                 items.splice(index, 1)
//             }
//         }

//         // set options to the choices avaliable on the question
//         tableRows[currentQuestion - 1].choices = items
//         // for each option, map it to the select options for answer selecting
//         let optionSelect = items.map((item, index) => {
//             return (
//                 // JSX for each option
//                 <MenuItem value={item}>{item}</MenuItem>
//             )
//         })
//         // set state for options
//         updateOptions(optionSelect)
//         // update tags for visualisation
//         setTags(items)
//     }
//     /**==============================================
//      **              addRow()
//      *?  What does it do? Handles new row generation when a question is added
//      *=============================================**/
//     function addRow() {
//         // add new position into array with base values
//         addTableRow([...tableRows, {
//             name: "",
//             type: "multichoice",
//             choices: [""],
//             image: ''
//         }])
//         // incremeint question num by 1
//         setCurrentQuestionNum(currentQuestion + 1)
//     }

//     /**==============================================
//      **              saveQuizToDb()
//      *?  What does it do? Saves quiz object to firebase and cleans up...
//      *=============================================**/
//     function saveQuizToDb() {
//         // set object in firebase
//         set(dbRef(db, 'schools/hvhs/quizzes/' + id), {
//             title: quizName,
//             description: quizDesc,
//             questions: tableRows

//         });
//         // echo to console
//         console.log("Saved Quiz Successfully")
//         setOpen(true)

//     }

//     // for each table row, add some JSX In
//     const tableRow = tableRows.map((row, index) => {
//         return (
//             // JSX for each row
//             <Fade in={shouldFade}>
//                 <tr>
//                     <td>{index + 1}</td>

//                     <td>
//                         <TextField
//                             id="outlined-required"
//                             margin="dense"
//                             label="Question Name"
//                             placeholder={row.name}
//                             onChange={updateCurrentQuestionName}
//                         />
//                     </td>
//                     <td>
//                         <label htmlFor="contained-button-file">
//                             <Input accept="image/*" id="contained-button-file" multiple type="file" onChange={handleChange} />
//                             <Button variant="contained" component="span">
//                                 Upload Image                        </Button>
//                         </label>
//                     </td>
//                     <td>
//                         <FormControl fullWidth>
//                             <Select
//                                 margin="dense"
//                                 labelId="answer-type"
//                                 id="answer-type"
//                                 label="Type"
//                                 defaultValue=""
//                                 onSelect={updateCurrentQuestionType}
//                             >
//                                 <MenuItem value='multichoice'>Multi Choice</MenuItem>
//                                 <MenuItem value='imageupload'>Image Upload</MenuItem>
//                             </Select>
//                         </FormControl>
//                     </td>
//                     <td>
//                         <ReactTagInput
//                             tags={row.choices}
//                             onChange={(newTags) => updateCurrentQuestionOptions(newTags)}
//                         />
//                     </td>
//                     <td>
//                         <FormControl fullWidth>
//                             <Select
//                                 margin="dense"
//                                 labelId="answer-type"
//                                 id="answer-type"
//                                 defaultValue=""
//                                 placeholder={row.answer}
//                                 label="Answer"
//                                 onChange={updateCurrentQuestionAnswer}
//                             >
//                                 {options}
//                                 <MenuItem value={'multichoice'}>Select One</MenuItem>

//                             </Select>
//                         </FormControl>
//                     </td>
//                 </tr>
//             </Fade>
//         )
//     })

//     // dialog open and closing handler
//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//         navigate('/tcs/quizzes')
//     };
//     // return JSX for Virtual DOM
//     return (
//         <div className='createquiz-container'>
//             <div className='createquiz-header'>
//                 <h2>Create a Quiz</h2>
//             </div>
//             <div className='createquiz-body'>
//                 <div className='createquiz-basicinfo'>
//                     <h4>Basic Information</h4>
//                     <TextField
//                         required
//                         id="outlined-required"
//                         label="Quiz Title"
//                         onChange={updateQuizName} //whenever the text field change, you save the value in state
//                         margin="dense"
//                     />
//                     <TextField
//                         id="outlined-required"
//                         margin="dense"
//                         label="Quiz Description"
//                         onChange={updateQuizDesc} //whenever the text field change, you save the value in state
//                     />
//                 </div>
//                 <div className='createquiz-questions'>
//                     <button onClick={addRow}>New Question</button>
//                     <table className='createquiz-table'>
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Name</th>
//                                 <th>Upload Image</th>
//                                 <th>Question Type</th>
//                                 <th>Options</th>
//                                 <th>Answer</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {tableRow}
//                         </tbody>
//                     </table>
//                 </div>
//                 <button onClick={saveQuizToDb}>Save Quiz</button>
//             </div>
//             {/* Dialog for completing quiz */}
//             <Dialog
//                 open={open}
//                 onClose={handleClose}
//                 aria-labelledby="alert-dialog-title"
//                 aria-describedby="alert-dialog-description"
//             >
//                 <DialogTitle id="alert-dialog-title">
//                     {quizName} has been created!
//                 </DialogTitle>
//                 <DialogContent>
//                     <DialogContentText id="alert-dialog-description">
//                         You can now view your quiz in the quiz list.
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} autoFocus>
//                         Agree
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     )
// }

// // end of file :D