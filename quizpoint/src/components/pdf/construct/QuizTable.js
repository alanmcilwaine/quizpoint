/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */

import { useState, useEffect } from "react"
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
/**======================
 **   Data Service Imports
 *========================**/
import { db } from "../../../services/firebase";
import { user } from '../../firebase/fb.user'
import { ref, onValue } from "firebase/database";
/**======================
 **   Icons from MUI Imports
 *========================**/
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import Heading from "../../construct/Heading";
import Spinner from "../../construct/Spinner";


export default function QuizTable({ quizId, type, students }) {
    const [loading, setLoading] = useState(true)
    // const [studentList, setStudentArray] = useState([])
    let studentList = []
    const [tableData, setTableData] = useState([])
    const [quizObject, setQuizObject] = useState({})
    let columns = [
        {
            Header: 'Completion Report',
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
    let columnsForPDF = [
        {
            Header: 'Completion Table',
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

    ]

    useEffect(() => {
        if (loading) {

            console.log(studentList)
            console.log(students)
            // let current quiz ID be the quizIdToView (i.e. abcef)
            let currentQuiz = quizId
            // all columns by default have student info, set up 1 postion in array

            if (type === 'completion') {
                // set up table data

                // student array contains all user ids to view
                let studentArray = studentList
                // setup path to quiz object
                let quizRef = ref(db, `/schools/hvhs/quizzes/${currentQuiz}`)
                // get quizReference first (always need most updated data)
                onValue(quizRef, (snapshot) => {
                    // if data does not exist, we need to error handle
                    if (snapshot.val() === null || snapshot.val() === undefined) {
                    } else {
                        setQuizObject(snapshot.val())
                        // for each student
                        async function computeStudents() {
                            for await (let [key, value] of Object.entries(students)) {
                                // set up path to that students object
                                let pathRef = ref(db, `/schools/hvhs/users/${key}/`);
                                // on read of user object, get the data (need most updated data)
                                onValue(pathRef, (snapshot) => {
                                    // if data does not exist, we need to error handle
                                    if (snapshot.val() === null || undefined) {
                                        return
                                    } else {
                                        // set up the users information
                                        let dataForUser = {
                                            name: snapshot.val().name,
                                            studentId: snapshot.val().studentID
                                        }

                                        if (snapshot.val().quizzes.turnedin[currentQuiz]) {
                                            console.log('turned in' + dataForUser.name)
                                            let route = snapshot.val().quizzes.turnedin[currentQuiz]
                                            if (route.details.progress === route.numofquestions) {
                                                dataForUser.completed = 'complete'
                                            } else {
                                                // they have not completed it
                                                dataForUser.completed = 'incomplete'
                                            }
                                            // set a reference to prevent me from writng it out all the time
                                            // for each question
                                            // finished here, push to table
                                            console.log(dataForUser)
                                            tableData.push(dataForUser)
                                        } else {
                                            console.log('turned in' + dataForUser.name)
                                            let route = snapshot.val().quizzes.active[currentQuiz]
                                            if (!route) {

                                            } else {
                                                if (route.details.progress === route.numofquestions) {
                                                    dataForUser.completed = 'complete'
                                                } else {
                                                    // they have not completed it
                                                    dataForUser.completed = 'incomplete'
                                                }
                                            }
                                            // set a reference to prevent me from writng it out all the time
                                            // for each question
                                            // finished here, push to table
                                            console.log(dataForUser)
                                            tableData.push(dataForUser)
                                        }



                                    }
                                })
                            }
                        }
                        computeStudents()
                        const holdYourHorses = setTimeout(function () {
                            console.log(tableData)
                            setLoading(false)

                        }, 5000)
                    }
                })

            }
        }
    }, [loading, tableData])

    /**==============================================
     **              GenerateTable
     *?  What does it do? Uses React-Table to generate a table
     *@param columns array of objects
     *@param data array of objects
     *@return a Material UI table
     *=============================================**/
    function GenerateTable({ columns, data }) {
        // Use following states and props for table
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

        // Render UI (Material Table)
        return (
            <Table {...getTableProps()}>
                <TableHead>
                    {/* for each header group */}
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // I.e Question 1, Student Name, etc
                                <TableCell {...column.getHeaderProps()}><b>{column.render('Header')}</b></TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {/* for each row */}
                    {rows.map((row, i) => {
                        // prepare the row
                        prepareRow(row)
                        return (
                            // for each row indivually (cell)
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    // if value doesn't exist, they probably haven't completed it
                                    if (cell.value === undefined) {
                                        // return Empty Box with a color of orange and a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <DoDisturbIcon style={{ color: 'red' }}></DoDisturbIcon>
                                        </Tooltip></TableCell>


                                    } else if (cell.value === 'complete') {
                                        // return a green checkbox with a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Quiz Completed">
                                            <CheckCircleOutlineIcon style={{ color: 'green' }}></CheckCircleOutlineIcon>
                                        </Tooltip></TableCell>
                                    }
                                    else if (cell.value === 'incomplete') {
                                        // return a red checkbox with a tooltip
                                        return <TableCell {...cell.getCellProps()}><Tooltip title="Not Completed">
                                            <DoDisturbIcon style={{ color: 'red' }}></DoDisturbIcon>
                                        </Tooltip></TableCell>
                                    } else {
                                        // return other data
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

    /**==============================================
    **              ReportTable
    *?  What does it do? Builds and pulls data for report table
    *@param props object
    *@return GenerateTable and GeneratePDFTable respectively.
    *=============================================**/
    function ReportTable(props) {
        console.log(tableData)
        // return components for reporting
        return (
            // paper for styling and nice looks
            <Paper elevation={3} className="paper-fix" style={{ "marginBottom": 20 }}>
                {/* Export buttons */}
                {/* <button className='generic-button sml' onClick={() => generatePDF()}>Export PDF</button>
                    <button className='generic-button sml' onClick={() => generateExcel()}>Export Excel</button> */}
                {/* Table for viewing */}
                <GenerateTable columns={columns} data={tableData} />
                {/* Table for behind the scenes */}
                {/* <GeneratePDFTable columns={columnsForPDF} data={tableData} /> */}

            </Paper>
        )
    }
    return (
        <>

            <div className='ml-2 mr-2 mt-2'>
                {console.log(quizObject)}
                <p className='text-xl font-bold	text-center'>{`${quizObject.title}`}</p>
                {loading ? <Spinner /> : <ReportTable />

                }
            </div>
            <hr></hr>

        </>
    )
}


