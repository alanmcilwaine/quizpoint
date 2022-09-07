/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useState } from "react"
import Viewer from "../pdf/Viewer"

export default function Reports({ context, data }) {
    const [openViewer, setViewer] = useState(false)
    const [openDialog, setDialog] = useState(true)
    const REPORTOPTIONS = [
        { label: 'Completion', type: 'completion' },
        { label: 'Not Complete', type: 'notcomplete' },
    ]

    const [selectedOption, setSelectedOption] = useState(REPORTOPTIONS[0].type);


    function handleSelection() {
        console.log(selectedOption)
        setDialog(false)
        setViewer(true)
    }
    return (
        <>
            {openDialog ?
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-row min-h-screen justify-center items-center">
                    <div className="flex flex-col items-center justify-center bg-white shadow rounded-lg" style={{ width: 512, height: 194, }}>
                        <div className="inline-flex space-x-4 items-start justify-start px-6 pt-6 pb-4" style={{ width: 512, height: 132, }}>

                            <div className="inline-flex flex-col space-y-2 items-start justify-start" style={{ height: 92, }}>
                                <p className="text-lg font-medium leading-normal text-gray-900" style={{ width: 408, }}>Select a report to produce</p>
                                <p className="text-sm leading-tight text-gray-500" style={{ width: 408, }}>We will handle the rest</p>
                                <div className="relative w-full lg:max-w-sm">
                                    <select
                                        value={selectedOption}
                                        onChange={e => setSelectedOption(e.target.value)}
                                        className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                                    >
                                        {REPORTOPTIONS.map(option => <>
                                            <option value={option.type}>{option.label}</option>

                                        </>)}

                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex space-x-3 items-center justify-end px-6 py-1 mt-5 bg-violet-50" style={{ width: 512, height: 62, }}>
                            <div className="flex items-center justify-center px-4 py-2 bg-violet-200 shadow border rounded-md border-gray-300">
                                <p className="text-sm font-medium leading-tight text-gray-700" onClick={() => handleSelection()}>Select</p>
                            </div>
                            <p className="text-sm font-medium leading-tight text-gray-700 ml-2" onClick={() => setDialog(false)}>Cancel</p>
                        </div>
                    </div>
                </div>
                : null}
            {openViewer ?
                <Viewer type={context} context={selectedOption} state={openViewer} course={data}></Viewer>
                : null}
            <button onClick={() => setDialog(true)}>Reports</button>
        </>
    )
}