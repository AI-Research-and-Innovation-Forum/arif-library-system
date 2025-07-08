import React from 'react'
import Cards from './Cards'
import { Link } from 'react-router-dom'
import list from "../../public/list.json"
function Course() {
    return (
        <div className='max-w-screen-2xl container mx-auto pt-5 md-px-20 md:pl-16 md:pr-4 md:pt-5'>
            <div className='mt-28 justify-center text-center  '>
                <h1 className='text-2xl font-semibold md:text-4xl  '>We are delighted to have you <span className='text-pink-500'>here :)</span></h1>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, rerum placeat saepe minus ullam, neque asperiores quia quos repellat incidunt nisi deserunt impedit numquam! Ex placeat dolorem vero iure corrupti aperiam illo, dignissimos sunt, nulla exercitationem incidunt quasi repudiandae eligendi esse pariatur perferendis voluptate impedit nobis ipsam optio ipsum. Sint molestias eius natus! Amet doloremque culpa itaque numquam obcaecati animi at nihil omnis suscipit!
                </p>
                <Link to="/">
                    <button className='bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-700 duration-700'>Back</button>
                </Link>

            </div>
            <div>
                <div className='mt-12 grid grid-cols-1 md:grid-cols-3 md:mb-12'>
                    {
                        list.map((item) => (
                            <Cards key={item.id} item={item} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Course
