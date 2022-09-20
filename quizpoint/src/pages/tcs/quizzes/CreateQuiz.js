/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
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
import React, { useState, useCallback } from 'react'
import Heading from '../../../components/construct/Heading'
import CreateQuizTable from '../../../components/quizzes/CreateQuizTable'
import { v4 } from 'uuid'
// database
import { db, storage } from '../../../services/firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
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
import Banner from "../../../components/feedback/Banner"
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
    const [image, setImage] = useState(null)
    const [quizName, setQuizName] = useState('')
    const [description, setDescription] = useState('')
    const [submittedAnswers, setSubmittedAnswers] = useState([])
    const [updateDOM, setUpdateDOM] = useState([])

    let { id } = useParams()

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handler = {
        submitQuestion: (e) => {
            e.preventDefault();
            let answerList = []
            console.log(submittedAnswers)
            console.log(submittedAnswers.length)
            for (let i = 0; i < submittedAnswers.length; i++) {
                console.log(i)
                if (submittedAnswers[i].correct) {
                    answerList.push(submittedAnswers[i].text)
                }
            }
            console.log(submittedAnswers[0].correct)
            console.log(answerList)

            if (image !== null) {
                let imageName = (image.name + v4())
                let imageRef = ref(storage, `/schools/hvhs/quizzes/${id}/${questions.length}/${imageName}`)
                handler.uploadImage(imageRef, answerList)
            } else {
                questions.push({ name: questionName, choices: submittedAnswers, type: "multichoice", answer: answerList})
            }                
            handler.resetQuestion()
            console.log("Questions:")
            console.log(questions)
        },
        submitAnswer: (e) => {
            e.preventDefault()
            submittedAnswers.push({ text: answers, correct: false })
            setAnswers('');
            console.log(submittedAnswers)
            return (
                <input type="text" id="disabled-input" aria-label="disabled input" class="mb-6 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value="Disabled input" disabled></input>
            )
            
        },
        submitQuiz: (e) => {
            let submitQuiz;
            e.preventDefault()
            console.log(e)
            console.log(description)
            questions.map((question, index) => {
                questions[index].choices.map((choice, newIndex) => {
                    questions[index].choices[newIndex] = choice.text

                })
                questions[index].answer.map((answer, newerIndex) => {
                    questions[index].answer[newerIndex] = { value: answer }
                })
            })
            console.log(questions)
            submitQuiz = { title: quizName, description: description, questions: questions }
            console.log(submitQuiz)
            set(dbRef(db, 'schools/hvhs/quizzes/' + id), submitQuiz);
            window.location.reload()
        },
        descriptionChange: (e) => {
            setDescription(e.target.value)
            console.log(description)
        },
        questionChange: (e) => {
            setQuestionName(e.target.value);
        },
        answerChange: (e) => {
            setAnswers(e.target.value);
        },
        quizChange: (e) => {
            setQuizName(e.target.value);
            console.log(quizName)
        },
        uploadImage: (imageRef, answerList) => {
            if (image === null) return;
            uploadBytes(imageRef, image).then(() => {
                setImage(null)
                getDownloadURL(ref(storage, imageRef))
                .then((url) => {
                    // `url` is the download URL
                    questions.push({ name: questionName, choices: submittedAnswers, type: "multichoice", answer: answerList, image: url})
                    setUpdateDOM(Math.random(10))
                })
                .catch((error) => {
                    questions.push({ name: questionName, choices: submittedAnswers, type: "multichoice", answer: answerList, image: "Error: Retry"})
                    console.log(error)
                })
            })
        },
        resetQuestion: (e) => {
            setAnswers('')
            setQuestionName('')
            setSubmittedAnswers([])
            setImage(null)
        },
        resetPage: (e) => {

        },
    }

    return (
        <>
            <Banner header="We are rebuilding!" text="We are currently in the progress of redesiging our site." />

            <Heading text={"Create Quiz"}></Heading>
            <div>
                <form id="quizForm" onSubmit={handler.submitQuiz}></form>
                <button form="quizForm" className="absolute left-72">Save Quiz</button>
                <div className="items-center flex flex-col mt-8">
                    <label className="block mb-2 p-2 text-md font-medium text-black">Quiz Name*</label>
                    <input form="quizForm" type="text" placeholder="e.g: Basic Facts Test" className=" border border-indigo-800 text-indigo-800 text-sm rounded-lg w-1/3 h-16 p-2.5" value={quizName} onChange={handler.quizChange} required></input>
                    <label className="block mb-2 p-2 text-md font-medium text-black">Quiz Description</label>
                    <input onChange={handler.descriptionChange} value={description} type="text" placeholder="e.g: Standard 91032 Level 3 NCEA Test" className=" border border-indigo-800 text-indigo-800 text-sm rounded-lg w-1/3 h-16 p-2.5 " required></input>
                </div>
                <div className="flex flex-row my-4 justify-center">
                    <div className="order-1 basis-1/5">
                        <form id="questionForm" onSubmit={handler.submitQuestion}></form>
                        {/* Question Name */}
                        <label className="block mb-2 p-2 text-md font-medium text-black">Question Name</label>
                        <input form="questionForm" type="text" placeholder="e.g: What is 5 + 5" value={questionName} onChange={handler.questionChange} className=" border text-sm rounded-lg w-4/5 h-16 p-2.5 " required></input>

                        {/* Insert Image */}
                        <input form="questionForm" className="cursor-pointer w-4/5 h-16 p-2.5 " type="file" id="addImage" accept="image/*" onChange={(e) => {setImage(e.target.files[0])}}></input>

                        {/* Answer Name */}
                        <label className="block mb-2 p-2 text-md font-medium text-black">Answers</label>
                        <form id="answerForm" onSubmit={handler.submitAnswer}></form>
                        
                        <div className="flex flex-row">
                            <input form="answerForm" type="text" placeholder="Add an answer" value={answers} onChange={handler.answerChange} name="answers" className="border border-indigo-800 text-indigo-800 text-sm rounded-tl-lg rounded-bl-lg w-3/5 h-16 p-2.5 " required></input>
                            {/* Addition Icon */}
                            <button form="answerForm" className="h-16 p-2.5 w-1/5 rounded-r-lg rounded-none shadow-none border flex justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="block w-6 h-6">
                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                            </svg>

                            </button>
                        </div>
                        {submittedAnswers.map((answer, index) => {
                            if (Object.keys(answer).length === 0) { return }
                            return (
                                <>
                                    <div className="flex flex-row" key={index}>
                                        <input disabled type="text" aria-label="disabled input" value={answer.text} name="answers" className="border border-indigo-800 text-indigo-800 text-sm rounded-none w-3/5 h-16 p-2.5 " required></input>
                                        <button onClick={() => { submittedAnswers.splice(index, 1); setUpdateDOM(Math.random(100)) }} className="h-16 p-2.5 w-1/5 rounded-none shadow-none border"><p className="text-3xl">-</p></button>
                                        <button onClick={() => { answer.correct = !answer.correct; setUpdateDOM(Math.random(100)) }} className={classNames(
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
                        {questions[0] === undefined ? <CreateQuizTable hasQuestion={false} /> : <CreateQuizTable hasQuestion={true} question={questions} />}
                        {console.log(questions)}
                        {/* {questions.map((question, index) => {
                            if (Object.keys(question).length === 0) { return }
                            console.log(question)
                            return <CreateQuizTable hasQuestion={true} question={questions}/>
                        })} */}
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