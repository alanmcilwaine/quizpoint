/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import { useNavigate } from 'react-router-dom'
import Heading from '../../components/construct/Heading'
import Banner from '../../components/feedback/Banner'
import { user } from '../../components/firebase/fb.user.js'

export default function Home() {
    const navigate = useNavigate()
    return (
        <>
            <Banner header="We are rebuilding!" text="We are currently in the progress of redesiging our site." />
            <Heading text={"Welcome, " + user.name + "."} />

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">

                        <div className="flex h-90 border-4 border-dashed border-gray-200 rounded-lg">
                            <span className="m-auto">
                                <h1 className="text-2xl text-center tracking-tight font-bold text-gray-900">What can we do today?</h1>
                                <div class="h-20 grid grid-cols-3 gap-4 content-center">
                                    <div>
                                        <button onClick={() => navigate('/tcs/students/all')}>View Students</button>
                                    </div>
                                    <div>
                                        <button onClick={() => navigate('/tcs/classes/')}>View a Class</button>
                                    </div>
                                    <div>
                                        <button onClick={() => navigate('/tcs/reporting/')}>View a Report</button>
                                    </div>

                                </div>

                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}