/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import Heading from '../../components/construct/Heading'
import Banner from '../../components/feedback/Banner'

export default function Home() {
    return (
        <>
            <Banner header="We are rebuilding!" text="We are currently in the progress of redesiging our site." />
            <Heading text="Welcome." />

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">

                        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96" />
                    </div>
                </div>
            </main>
        </>
    )
}