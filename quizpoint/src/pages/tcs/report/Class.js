/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useState, useEffect } from "react";
import Header from "../../../components/classes/Header";
import { useParams } from 'react-router-dom'
// database
import { db } from '../../../services/firebase'
import { getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { set, onValue } from "firebase/database";
import { ref } from "firebase/database";
import QuizTable from "../../../components/reports/Table";
export default function Class() {
    const [data, setData] = useState(null)
    // states
    const [loading, setLoading] = useState(true)
    const [classObject, setClassObject] = useState({})
    const [quizzes, setQuizzes] = useState([])
    const [selectedQuiz, setSelectedQuiz] = useState('')
    // id reference to uid
    let { id } = useParams()
    // color for hash loaders

    // variables for pdfs and excel documents
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;


    /**==============================================
     **              useEffect
     *?  What does it do? Runs a hook everytime loading state changes
     *@return JSX
     *=============================================**/
    useEffect(() => {
        // if program is still loading
        if (loading) {
            // set title to loading
            document.title = 'Loading Data | QuizPoint'
            // set path to read
            let pathRef = ref(db, `/schools/hvhs/classes/${id}`);
            // on value change
            onValue(pathRef, (snapshot) => {
                // for each student in class

                // all quizzes active in the class
                let quizReference = snapshot.val().quizzes
                // set class object up
                setData(snapshot.val())
                for (const property in quizReference) {
                    // push to the option array
                    quizzes.push({ name: quizReference[property].name, id: property, code: quizReference[property].code })
                }
                // option array => dropdown
                // for each property in the quizReference object
                // for (const property in quizReference) {
                //     // push to the option array
                //     optionArray.push({ name: quizReference[property].name, id: property, code: quizReference[property].code })
                // }
                // // for each quiz in the option array, map a option
                // let quizSelect = optionArray.map((quiz, index) => {
                //     // e.g Health and Safety quiz with the key of abcef1 and a value of abcef

                //     return (
                //         <MenuItem key={quiz.code + index} src={quiz.name} value={quiz.code}>{quiz.name}</MenuItem>
                //     )
                // })
                // set the select box up
                // setSelect(quizSelect)
                // finished loading
                setLoading(false)
            })

        } else {
            // set title to class name
            document.title = `${classObject.className}'s Report | QuizPoint`
        }
    }, [loading, selectedQuiz])

    return (
        <>
            {data ? <Header classObject={data} /> : null}
            <div className="h-auto  ml-0 py-6   grid grid-cols-2 gap-0">

                <div className="flex flex-col max-w-lg">
                    <div className="-my-2 overflow-x-auto ">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quizzes
                                            </th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <input type="text" placeholder="Search for a quiz assigned." className="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" />


                                            </td>

                                        </tr>
                                    </thead>
                                    {quizzes ?
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {quizzes.map((row) => (
                                                <tr key={row.id} onClick={() => setSelectedQuiz(row.code)}>
                                                    <td className="px-6 py-4 whitespace-nowrap" >
                                                        <div className="flex items-center">
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {row.name} - {row.code}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody> : null}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedQuiz ? <QuizTable quizId={selectedQuiz} type={'completion'} students={data.students}></QuizTable> : null}

            </div>
        </>
    )
}