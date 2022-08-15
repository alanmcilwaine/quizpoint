/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { ref, onValue } from "firebase/database";
import { useState } from 'react';
import { db } from './firebase'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useTable } from 'react-table'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import SyncLoader from "react-spinners/SyncLoader";
import Backdrop from '@mui/material/Backdrop';
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined';
export default function ClassProgress(props) {
    let [color, setColor] = useState("#ffffff");
    const shouldFade = true
    const [feedback, setLoadingFeedback] = useState(false)
    const [loading, setLoading] = useState(true)
    let studentList = props.studentList
    let quizId = props.quizId
    const [studentsCompleted, setStudentsCompleted] = useState([])
    const [studentsNotCompleted, setStudentsInComplete] = useState([])

    function collateData() {
        setLoadingFeedback(true)
        studentsCompleted.length = 0
        studentsNotCompleted.length = 0
        try {
            for (let student in studentList) {
                console.log(studentList[student])
                const pathRef = ref(db, `schools/hvhs/users/${student}/`);
                // wait for data
                onValue(pathRef, (snapshot) => {
                    let studentDetails = {
                        name: snapshot.val().name,
                    }
                    let quizRef = snapshot.val().quizzes
                    if (quizRef.active[quizId]) {
                        studentDetails.completed = 'in complete'
                        studentDetails.turnedin = 'not turned in'
                        studentsNotCompleted.push(studentDetails)
                    } else if (quizRef.turnedin[quizId]) {
                        if (quizRef.turnedin[quizId].score.correct === quizRef.turnedin[quizId].score.total) {
                            studentDetails.completed = 'complete'
                            studentDetails.turnedin = 'turned in'
                            studentsCompleted.push(studentDetails)
                            setStudentsCompleted([...studentsCompleted, studentDetails])
                        } else {
                            studentDetails.completed = 'in complete'
                            studentDetails.turnedin = 'not turned in'
                            setStudentsInComplete([...studentsNotCompleted, studentDetails])
                            studentsNotCompleted.push(studentDetails)

                        }
                    } else {
                        studentDetails.completed = 'in complete'
                        console.log('else')
                        studentDetails.turnedin = 'not turned in'
                        setStudentsInComplete([...studentsNotCompleted, studentDetails])
                        studentsNotCompleted.push(studentDetails)
                    }
                    console.log(studentDetails)
                })

            }
        } finally {
            const myTimeout = setTimeout(function () {
                console.log(studentsCompleted)
                console.log(studentsNotCompleted)
                setLoading(false)
                setLoadingFeedback(false)

            }, 5000);
        }
    }

    let columns = [
        {
            Header: 'QuizPoint Completion Table',

            columns: [
                {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Status',
                    accessor: 'completed',
                },


            ],
        },
    ]

    function DisplayTable({ columns, data }) {
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

        // Render UI for table (Material UI)
        return (
            // set up table ID
            <Table id="" {...getTableProps()}>
                <TableHead>
                    {/* for each header group */}
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // I.e Question 1, Student Name, etc
                                <TableCell {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        // for each row
                        prepareRow(row)
                        // prepare the row
                        return (
                            // for each row indivually (cell)
                            <TableRow {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    // if cell doesn't exist
                                    if (cell.value === undefined) {
                                        // user hasn't completed
                                        return <TableCell {...cell.getCellProps()}></TableCell>

                                    } else if (cell.value === 'complete') {
                                        // user has completed and answered correctly
                                        return <TableCell {...cell.getCellProps()}>
                                            100%
                                        </TableCell>
                                    } else if (cell.value === 'in complete') {
                                        // user has completed and answered incorrectly
                                        return <TableCell {...cell.getCellProps()}>
                                            Not Completed
                                        </TableCell>
                                    }
                                    else if (cell.value === 'not turned in') {
                                        // user has completed quiz
                                        return <TableCell {...cell.getCellProps()}>
                                            Not Handed in
                                        </TableCell>
                                    }
                                    else if (cell.value === 'turned in') {
                                        // user has not completed quiz
                                        return <TableCell {...cell.getCellProps()}>
                                            Handed In
                                        </TableCell>
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


    return (
        <>
            <Button variant="contained" onClick={() => collateData()}>View</Button>
            <Dialog
                open={!loading}
                fullWidth={true}
                fullScreen

                maxWidth={'md'}
                onClose={() => setLoading(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <AppBar sx={{ position: 'relative' }} color={'transparent'}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setLoading(true)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>

                    </Toolbar>
                </AppBar>
                <DialogTitle id="alert-dialog-title">
                    {"Class Progress"}
                    <IconButton onClick={() => collateData()}><RotateLeftOutlinedIcon /></IconButton>
                </DialogTitle>
                <DialogContent>
                    <Tabs>
                        <TabList>
                            <Tab>Not Complete</Tab>
                            <Tab>Complete</Tab>
                        </TabList>

                        <TabPanel>
                            <DisplayTable columns={columns} data={studentsNotCompleted} />
                        </TabPanel>
                        <TabPanel>
                            <DisplayTable columns={columns} data={studentsCompleted} />
                        </TabPanel>
                    </Tabs>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog >
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={feedback}
            >
                {/* cool hash loader */}
                <h1>QuizPoint is crunching your data</h1>
                {/* cool hash loader */}
                <SyncLoader color={color} loading={feedback} size={5} speedMultiplier={0.5} />

            </Backdrop>
        </>
    )
}