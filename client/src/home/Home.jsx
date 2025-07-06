import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Freebook from '../components/Freebook'
import QuestionPapersSection from '../components/QuestionPapersSection'
import Footer from '../components/Footer'

function Home() {
    return (
        <>
            <Navbar />
            <Banner />
            <Freebook />
            <QuestionPapersSection />
            <Footer />
        </>
    )
}

export default Home