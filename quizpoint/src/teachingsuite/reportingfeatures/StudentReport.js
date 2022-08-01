/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

/*
* Copyright (c) 2022 QuizPoint
* All rights reserved.
*/

/**========================================================================
 * *                          StudentReport Module
 *========================================================================**/


/**======================
 **   React Imports
 *========================**/
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import logo from './logo.svg'
// jspdf
/**======================
 **   Data Service Imports
 *========================**/
import { db } from '../../services/firebase'
import { user } from '../../firebase/fb.user.js';
import { ref, onValue } from "firebase/database";
/**======================
 **   Data Handling Imports
 *========================**/
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { useTable } from 'react-table'
/**======================
 **   Material UI Imports
 *========================**/
import Backdrop from '@mui/material/Backdrop';
import TableToExcel from "@linways/table-to-excel";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';
/**======================
 **   Icons from MUI Imports
 *========================**/
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
/**======================
 **   Hash Loader Import
 *========================**/
import HashLoader from "react-spinners/HashLoader";

/**======================
 **   Stylesheet Imports
 *========================**/
import './StudentReport.css'
/**==============================================
 **              StudentReport()
*?  What does it do? The basis of indivual student reports
*=============================================**/
export default function StudentReport() {
    // states
    const [loading, setLoading] = useState(true)
    const [currentStudent, setStudentObject] = useState({})
    // id reference to uid
    let { id } = useParams()
    // classobject (in use case, one student)
    let studentInClass = [
        id
    ]

    // color for hash loaders
    let [color, setColor] = useState("#ffffff");
    // just a placeholder variable
    const shouldFade = true
    const [numOfQuest, setQuestNum] = useState(0)
    //use effect hook, no reference
    const [quizIdToView, setQzId] = useState('');
    const [quizToSelect, setSelect] = useState([])
    // variables for pdfs and excel documents
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    const handleChange = (event) => {
        setQzId(event.target.value);
        console.log(event.target.value)
    };

    useEffect(() => {
        if (loading) {

            document.title = 'Loading Data | QuizPoint'
            let pathRef = ref(db, `/schools/hvhs/users/${id}`);

            onValue(pathRef, (snapshot) => {
                console.log(snapshot.val())
                let quizReference = snapshot.val().quizzes.active
                let quizReferenceCompleted = snapshot.val().quizzes.turnedin
                setStudentObject(snapshot.val())
                console.log(quizReference)
                let optionArray = []

                if (quizReference === null) {
                    console.log(quizReferenceCompleted)
                    for (const property in quizReferenceCompleted) {
                        console.log(`${property}: ${quizReferenceCompleted[property].details.name}`);
                        optionArray.push({ name: quizReferenceCompleted[property].details.name, id: property, code: quizReferenceCompleted[property].details.code })
                    }

                    let quizSelect = optionArray.map((quiz, index) => {
                        return (
                            <MenuItem key={quiz.code + index} value={quiz.code}>{quiz.name}</MenuItem>
                        )
                    })
                    setSelect(quizSelect)
                    console.log(quizSelect)
                    setLoading(false)
                } else {
                    for (const property in quizReference) {
                        console.log(`${property}: ${quizReference[property].details.name}`);
                        optionArray.push({ name: quizReference[property].details.name, id: property, code: quizReference[property].details.code })
                    }
                    if (quizReferenceCompleted !== null) {
                        for (const property in quizReferenceCompleted) {
                            console.log(`${property}: ${quizReferenceCompleted[property].details.name}`);
                            optionArray.push({ name: quizReferenceCompleted[property].details.name, id: property, code: quizReferenceCompleted[property].details.code })
                        }
                    }
                    let quizSelect = optionArray.map((quiz, index) => {
                        return (
                            <MenuItem key={quiz.code + index} value={quiz.code}>{quiz.name}</MenuItem>
                        )
                    })
                    setSelect(quizSelect)
                    console.log(quizSelect)
                    setLoading(false)

                }




            })

        } else {
            document.title = `${currentStudent.name}'s Report | QuizPoint`
        }
    })
    function GenerateTable({ columns, data }) {
        // Use the state and functions returned from useTable to build your UI
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable({
            columns,
            data,
        })

        // Render the UI for your table
        return (
            <Table id="reportTable" {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    if (cell.value === undefined) {

                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <CheckBoxOutlineBlankOutlinedIcon style={{ color: 'orange' }}></CheckBoxOutlineBlankOutlinedIcon>
                                        </Tooltip></TableCell>

                                    } else if (cell.value === 'correct') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Correct">
                                            <CheckBoxOutlinedIcon style={{ color: 'green' }}></CheckBoxOutlinedIcon>
                                        </Tooltip></TableCell>
                                    } else if (cell.value === 'incorrect') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Incorrect">
                                            <IndeterminateCheckBoxOutlinedIcon style={{ color: 'red' }}></IndeterminateCheckBoxOutlinedIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'complete') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Quiz Completed">
                                            <CheckCircleOutlineIcon style={{ color: 'green' }}></CheckCircleOutlineIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'incomplete') {
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <DoDisturbIcon style={{ color: 'red' }}></DoDisturbIcon>
                                        </Tooltip></TableCell>
                                    } else {
                                        return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    }
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
    function GeneratePDFTable({ columns, data }) {
        // Use the state and functions returned from useTable to build your UI
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
        } = useTable({
            columns,
            data,
        })

        // Render the UI for your table
        return (
            <Table id="reportTableToExport" {...getTableProps()}>
                <TableHead>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            console.log(headerGroup.headers)
                            {headerGroup.headers.map(column => (
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    if (cell.value === undefined) {

                                        return <TableCell {...cell.getCellProps()}>Not Completed</TableCell>

                                    } else if (cell.value === 'correct') {
                                        return <TableCell {...cell.getCellProps()}>
                                            Correct
                                        </TableCell>
                                    } else if (cell.value === 'incorrect') {
                                        return <TableCell {...cell.getCellProps()}>
                                            Incorrect
                                        </TableCell>
                                    }
                                    else if (cell.value === 'complete') {
                                        return <TableCell {...cell.getCellProps()}>
                                            Quiz Completed
                                        </TableCell>
                                    }
                                    else if (cell.value === 'incomplete') {
                                        return <TableCell {...cell.getCellProps()}>
                                            Not Completed
                                        </TableCell>
                                    } else {
                                        return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                                    }
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }

    function ReportTable(props) {

        let currentQuiz = quizIdToView
        let columns = [
            {
                Header: 'Student Information',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'name',
                    },
                    {
                        Header: 'Student ID',
                        accessor: 'studentId',
                    },
                    {
                        Header: 'Completed',
                        accessor: 'completed',
                    },

                ],
            },
            {
                Header: 'Quiz',
                columns: [

                ],
            },
        ]
        if (props.type === 'single') {
            if (quizIdToView === '') { } else {

                let tableData = []
                let pathRef = ref(db, `/schools/hvhs/users/${id}/`);


                let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
                onValue(quizRef, (snapshot) => {
                    if (snapshot.val() === null || snapshot.val() === undefined) {
                    } else {
                        setQuestNum(snapshot.val().numofquestions)
                        console.log(numOfQuest)
                        for (var index = 0; index < numOfQuest; index++) {
                            columns[1].columns.push({
                                Header: `Question ${index + 1}`,
                                accessor: `question${index + 1}`,
                            })
                        }
                    }
                })

                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === null || undefined) {
                        return
                    } else {
                        console.log(snapshot.val())
                        let dataForUser = {
                            name: snapshot.val().name,
                            studentId: snapshot.val().studentID
                        }
                        if (snapshot.val().quizzes.turnedin[currentQuiz]) {
                            if (snapshot.val().quizzes.turnedin[currentQuiz].details.progress === snapshot.val().quizzes.turnedin[currentQuiz].numofquestions) {
                                dataForUser.completed = 'complete'
                            } else {
                                dataForUser.completed = 'incomplete'
                            }
                            console.log('Hello!' + currentQuiz)
                            let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                            console.log(quizReference)

                            for (var index = 0; index < snapshot.val().quizzes.turnedin[currentQuiz].answers.length; index++) {
                                console.log(snapshot.val().quizzes.turnedin[currentQuiz].answers[index])
                                if (snapshot.val().quizzes.turnedin[currentQuiz].answers[index] === undefined) {
                                    console.log(index)
                                } else {
                                    console.log(snapshot.val().quizzes.turnedin[currentQuiz].answers[index])
                                    dataForUser['question' + index] = snapshot.val().quizzes.turnedin[currentQuiz].answers[index].status

                                }
                            }
                            tableData.push(dataForUser)
                        } else {
                            if (snapshot.val().quizzes.active[currentQuiz].details.progress === snapshot.val().quizzes.active[currentQuiz].numofquestions) {
                                dataForUser.completed = 'complete'
                            } else {
                                dataForUser.completed = 'incomplete'
                            }
                            if (snapshot.val().quizzes.active[currentQuiz] === undefined || snapshot.val().quizzes.active[currentQuiz] === undefined) {
                                console.log('Hello!' + currentQuiz)
                                let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                                console.log(quizReference)
                                for (var index = 0; index < quizReference.length; index++) {
                                    if (quizReference[index] === undefined) {

                                    } else {
                                        console.log(quizReference[index])
                                        dataForUser['question' + index] = quizReference[index].status

                                    }
                                }
                                tableData.push(dataForUser)
                            } else {
                                let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                                if (quizReference === undefined) { } else {
                                    console.log(quizReference)
                                    for (var index = 0; index < quizReference.length; index++) {
                                        console.log(quizReference[index])

                                        if (quizReference[index] === undefined) {

                                        } else {
                                            console.log(quizReference[index])
                                            dataForUser['question' + index] = quizReference[index].status

                                        }
                                    }

                                }
                                tableData.push(dataForUser)
                            }
                        }
                    }
                })
                return (
                    <Paper elevation={3} className="paper-fix">
                        <button className="generic-button sml" onClick={() => generatePDF()}>Generate PDF</button>
                        <button className="generic-button sml" onClick={() => generateExcel()}>Generate Excel</button>
                        <GenerateTable columns={columns} data={tableData} />
                        <GeneratePDFTable columns={columns} data={tableData} />
                    </Paper>
                )
            }
        } else if (props.type === 'class') {
            let tableData = []

            let studentArray = props.students
            console.log(props)
            let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
            onValue(quizRef, (snapshot) => {
                if (snapshot.val() === null || snapshot.val() === undefined) {
                } else {
                    setQuestNum(snapshot.val().numofquestions)
                    console.log(numOfQuest)
                    for (var index = 0; index < numOfQuest; index++) {
                        columns[1].columns.push({
                            Header: `Question ${index + 1}`,
                            accessor: `question${index + 1}`,
                        })
                    }
                }
            })

            for (var index = 0; index < studentArray.length; index++) {
                console.log(studentArray[index])
                let pathRef = ref(db, `/schools/hvhs/users/${studentArray[index]}/`);
                onValue(pathRef, (snapshot) => {
                    if (snapshot.val() === null || undefined) {
                        return
                    } else {
                        console.log(snapshot.val())
                        let dataForUser = {
                            name: snapshot.val().name,
                            studentId: snapshot.val().studentID
                        }
                        if (snapshot.val().quizzes.active[currentQuiz].progress === snapshot.val().quizzes.active[currentQuiz].numofquestions) {
                            dataForUser.completed = 'complete'
                        } else {
                            dataForUser.completed = 'incomplete'
                        }
                        if (snapshot.val().quizzes.active[currentQuiz] === undefined || snapshot.val().quizzes.active[currentQuiz] === undefined) {
                            console.log('Hello!' + currentQuiz)
                            let quizReference = snapshot.val().quizzes.turnedin[currentQuiz].answers
                            console.log(quizReference)
                            for (var index = 0; index < quizReference.length; index++) {
                                if (quizReference[index] === undefined) {

                                } else {
                                    console.log(quizReference[index])
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            tableData.push(dataForUser)
                        } else {
                            let quizReference = snapshot.val().quizzes.active[currentQuiz].answers
                            console.log(quizReference)
                            for (var index = 0; index < quizReference.length; index++) {
                                if (quizReference[index] === undefined) {

                                } else {
                                    console.log(quizReference[index])
                                    dataForUser['question' + index] = quizReference[index].status

                                }
                            }
                            tableData.push(dataForUser)
                        }
                    }
                })
            }
            return (
                <Paper elevation={3} className="paper-fix">
                    <button onClick={() => generatePDF()}>Generate PDF</button>
                    <button onClick={() => generateExcel()}>Generate Excel</button>
                    <GenerateTable columns={columns} data={tableData} />
                    <GeneratePDFTable columns={columns} data={tableData} />

                </Paper>
            )
        }
    }

    // variables for pdfs and excel documents
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;

    function generatePDF() {
        if (numOfQuest > 10) {
            const doc = new jsPDF({
                orientation: 'landscape',
                format: 'a2'
            })
            autoTable(doc, { html: '#reportTableToExport' })

            doc.text(`QuizPoint | ${currentStudent.name} report for ${quizIdToView} `, 10, 10);
            doc.setFontSize(9);
            doc.text(`QuizPoint | Generated by ${user.name}`, 10, 280);

            let documentName = `${currentStudent.name} report for ${quizIdToView} - Generated ${today} `
            doc.save(documentName + '.pdf')
        } else {
            const doc = new jsPDF({
                orientation: 'landscape',
            })
            autoTable(doc, { html: '#reportTableToExport' })
            doc.addImage(logo, 'SVG', 10, 0, 50, 50);
            doc.text(`QuizPoint | ${currentStudent.name} report for ${quizIdToView} `, 10, 10);
            doc.setFontSize(9);
            doc.text(`QuizPoint | Generated by ${user.name}`, 10, 280);

            let documentName = `${currentStudent.name} report for ${quizIdToView} - Generated ${today} `
            doc.save(documentName + '.pdf')
        }


    }

    function generateExcel() {
        let spreadsheet = `${currentStudent.name}_report_${quizIdToView}_${today} `

        TableToExcel.convert(document.getElementById("reportTableToExport"), {
            name: spreadsheet + ".xlsx",
            sheet: {
                name: "Sheet 1"
            }
        });
    }
    // if loading
    if (loading) {
        return (
            // loading banner
            <div className="loading">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={shouldFade}
                >
                    <HashLoader color={color} loading={loading} size={70} />

                </Backdrop>
            </div>
        )
    } else {

        return (
            <div className='student-report'>
                <div className="student-report-studentinfo">
                    <div className="banner-details">
                        {/* Banner 1 - Details */}
                        <h5><InfoOutlinedIcon></InfoOutlinedIcon> Personal Details</h5>
                    </div>
                    <div className="user-content">
                        <div className="user-content-left">
                            {/* User Profile Picture */}
                            <Tooltip title="Image taken from students google account">
                                {/* On image hover, message displayed */}
                                <Avatar alt='User profile' sx={{ width: 100, height: 100, margin: 0 }}
                                    src={currentStudent.picture} />

                            </Tooltip>
                        </div>
                        <div className="user-content-right">
                            {/* Basic Student information */}
                            <p>Name: {currentStudent.name}</p>
                            <p>Student ID: {currentStudent.studentID}</p>
                            {/* when you click on link, it will send email */}
                            <p>Email: <a href={'mailto:' + currentStudent.email}>{currentStudent.email}</a></p>
                        </div>
                    </div>
                </div>
                <div className='student-report-container'>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Quiz</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={quizIdToView}
                                label="Quiz"
                                onChange={handleChange}
                            >
                                {quizToSelect}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <div className='student-report-table'>

                    <ReportTable type={'single'} students={studentInClass}></ReportTable>
                </div>
            </div>
        )
    }
}