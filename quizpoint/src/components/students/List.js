/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import React, { useState, useEffect } from 'react'
import Viewer from './Viewer';
import { ref, onValue, set, update } from "firebase/database";
import { db } from '../../services/firebase'
const rows = []

export default function List({ type, toSearch, uidArray }) {
    const [allStudents, setStudentList] = useState([])
    const [selectedUID, setSelectedUID] = useState('')
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (loading) {
            loadData()
            setLoading(false)


        }
        console.log(type)

    }, [allStudents, rows, loading])
    function loadData() {
        if (!type || type === undefined) {
            const pathRef = ref(db, `/schools/hvhs/users/`);
            // wait for data
            onValue(pathRef, (snapshot) => {
                // if there is no students, something definelty went wrong.
                if (snapshot === undefined) {
                    console.log('ERROR - NO DATA FOUND')

                    // if students do exist
                } else {
                    // set placeholder to object of students
                    const data = snapshot.val()
                    // for each student value

                    Object.keys(data).forEach(function (key) {
                        if (data[key].role === 'teacher') {

                        } else {
                            // console.log(data[key])
                            // push to placeholder array
                            rows.push({
                                id: key,
                                name: data[key].name,
                                studentID: data[key].studentID,
                                uid: data[key].uid
                            })
                            allStudents.push(data[key])
                        }
                    });
                    console.log(rows)
                }
            });
        } else {
            // console log
            console.log('loading all students data')
            //! this should check for each users role before pushing to array
            // where type = to class id
            const pathRef = ref(db, `/schools/hvhs/classes/${toSearch}/students`);
            // wait for data
            onValue(pathRef, (snapshot) => {
                // if there is no students, something definelty went wrong.
                if (snapshot === undefined) {
                    console.log('ERROR - NO DATA FOUND')

                    // if students do exist
                } else {
                    console.log(snapshot.val())
                    snapshot.forEach(function (childSnapshot) {
                        console.log(childSnapshot.key)
                        const pathRef = ref(db, `/schools/hvhs/users/${childSnapshot.key}`);
                        // wait for data
                        onValue(pathRef, (sn) => {
                            console.log(sn.val())
                            rows.push({
                                id: sn.key,
                                name: sn.val().name,
                                studentID: sn.val().studentID,
                                uid: sn.uid
                            })
                            allStudents.push(sn.val())

                        })

                    })
                }
            });
        }

    }
    const [search, setSearch] = useState(allStudents);
    const handleInputChange = (e) => {
        var dm = e.target.value;
        var str = dm.toLowerCase();
        var debug = allStudents.filter(x => x["name"].toLowerCase().includes(str));
        setSearch(debug);
    };

    return (
        <div className="">
            <div className="h-auto  ml-0 py-6   grid grid-cols-2 gap-0">

                <div className="flex flex-col max-w-lg">
                    <div className="-my-2 overflow-x-auto ">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                        </tr>
                                        <tr>
                                            <input type="text" onChange={handleInputChange} placeholder="Search for a student." className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />

                                        </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {search.map((row) => (
                                            <tr key={row.id}>
                                                <td className="px-6 py-4 whitespace-nowrap" onClick={() => setSelectedUID(row.uid)}>
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {row.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Viewer uid={selectedUID} />

            </div>




        </div>
    )

}