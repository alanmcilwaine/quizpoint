import Dropdown from '../construct/Dropdown'
import React, { useState } from 'react'
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function CreateQuizTable(props) {
    //Props: 
    // props.question -- list of questions
    // props.hasQuestion -- if the user hasn't made any questions yet
    const [updateDOM, setUpdateDOM] = useState()
    console.log("question:")
    console.log(props.question)
    function deleteRow(index) {
        props.question.splice(index, 1)
        setUpdateDOM(Math.random(1000))
    }
    if (!props.hasQuestion) {
        return(
            <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                    <table className="min-w-full border">
                        <thead className="bg-white border-b">
                            <tr>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                #
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Name:
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Answers:
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Correct Answer:
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-100 border-b">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black"></td>
                                    <td className="text-sm text-black px-6 py-4 whitespace-nowrap">
                                        
                                    </td>
                                    <td className="text-sm text-black px-6 py-4 whitespace-nowrap">
                                        
                                    </td>
                                    <td className="text-sm text-black px-6 py-4 whitespace-nowrap">
                                        
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
        )
    }
    return(
        <div className="flex flex-col">
            <div className="sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full sm:px-6 lg:px-8">
                <div className="">
                    <table className="min-w-full border">
                        <thead className="bg-white border-b">
                            <tr>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                #
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Name:
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Answers:
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Correct Answers:
                            </th>
                            <th scope="col" className="text-sm font-medium text-black px-6 py-4 text-left">
                                Edit: 
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.question.map((question, index) => {
                                return (
                                    <tr className="bg-gray-100 border-b" key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{index + 1}</td>
                                        <td className="text-sm text-black px-6 py-4 whitespace-nowrap">
                                            {console.log(props.question)}
                                            {props.question[index].name}
                                        </td>
                                        <td className="text-sm text-black px-6 py-4 whitespace-nowrap">
                                            <Dropdown question={question} type="choice"/>
                                        </td>
                                        <td className="text-sm text-black px-6 py-4 whitespace-nowrap">
                                            <Dropdown question={question} type="answer"/>
                                        </td>
                                        <td scope="col" className="text-red-600 px-6 py-4 text-left"><a onClick={() => {deleteRow(index)}}>Delete</a></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    )

}
export default CreateQuizTable;