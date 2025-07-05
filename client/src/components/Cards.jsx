import React from 'react'

function Cards({item}) {
    return (
        <>
            <div className='mt-4 my-3 p-3'>
                <div className="card bg-amber-50 text-black dark:bg-slate-800 dark:text-white w-96 shadow-xl hover:scale-105 duration-200">
                    <figure>
                        <img
                            src="https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg?ga=GA1.1.2108759454.1742840828&semt=ais_keywords_boost"
                            alt="Shoes" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            {item.name}
                            <div className="badge badge-secondary">{item.category}</div>
                        </h2>
                        <p>{item.title}</p>
                        <div className="card-actions justify-between">
                            <div className="badge badge-outline text-black border-black dark:text-gray-300 dark:border-gray-300">${item.price}</div>
                            <div className="badge border-2 border-black bg-white text-black hover:bg-pink-600 hover:text-white dark:border-gray-300 dark:text-gray-300 dark:hover:bg-pink-600 cursor-pointer px-2 py-1 rounded-full duration-200">Borrow</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cards