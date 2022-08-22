/*
 * Copyright (c) 2022 Bounce developed by alanmcilwaine and maxwebbnz
 * All rights reserved.
 */
import Banner from "../../components/feedback/Banner"
import Heading from "../../components/construct/Heading"
import List from "../../components/students/List"
import Viewer from "../../components/students/Viewer"
export default function Students() {
    return (
        <>
            <Banner header="We are rebuilding!" text="We are currently in the progress of redesiging our site." />
            <Heading text="Your Students." />
            <main>
                <List type={false} toSearch={'-N9TC-_HibKBLINg-iLl'} />
            </main>
        </>
    )
}