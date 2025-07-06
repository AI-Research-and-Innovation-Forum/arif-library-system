import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'
import { useForm } from "react-hook-form"

function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => console.log(data);
    return (
        <div className='flex h-screen items-center justify-center bg-white text-black dark:bg-slate-900 dark:text-white'>
            <div className="border p-8 rounded-lg bg-white text-black dark:bg-slate-800 dark:text-white shadow-xl">
                <div className="modl-box">
                    < form onSubmit={handleSubmit(onSubmit)} method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>

                        <h3 className="font-bold text-lg">Sign up</h3>
                        <div className='mt-4 space-y-2'>
                            <span>Name</span>
                            <br />
                            <input type="Text"
                                placeholder='Enter your Name' 
                                className='w-80 px-3 py-1 border rounded-md outline-none bg-white text-black dark:bg-slate-700 dark:text-white' />
                        </div>

                        <div className='mt-4 space-y-2'>
                            <span>Email</span>
                            <br />
                            <input type="email"
                                placeholder='Enter your Email' 
                                className='w-80 px-3 py-1 border rounded-md outline-none bg-white text-black dark:bg-slate-700 dark:text-white' 
                                {...register("email", { required: true })} />
                            <br />
                            {errors.email && <span className='text-sm text-red-500'>This field is required</span>}
                        </div>

                        <div className='mt-4 space-y-2'>
                            <span>Password</span>
                            <br />
                            <input type="password"
                                placeholder='Enter your Password' 
                                className='w-80 px-3 py-1 border rounded-md outline-none bg-white text-black dark:bg-slate-700 dark:text-white' 
                                {...register("password", { required: true })} />
                            <br />
                            {errors.password && <span className='text-sm text-red-500'>This field is required</span>}
                        </div>
                        <div className='flex justify-around mt-4'>
                            <button className='bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200'>Sign up</button>
                            <p>Have account
                                <button className='underline text-blue-500 cursor-pointer' onClick={() => document.getElementById("my_modal_3").showModal()}>Login</button> {""}
                                <Login />
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
