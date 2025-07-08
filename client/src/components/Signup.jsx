import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Login from './Login'
import { useForm } from "react-hook-form"
import { authAPI } from '../services/api'

function Signup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        
        try {
            const response = await authAPI.register(data);
            const { token, _id, name, email, role } = response.data;
            
            // Store token and user data including role
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ _id, name, email, role }));
            
            // Redirect based on user role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openLoginModal = () => {
        // Navigate back to home and open login modal
        navigate('/');
        setTimeout(() => {
            document.getElementById("my_modal_3").showModal();
        }, 100);
    };

    return (
        <div className='flex h-screen items-center justify-center bg-white text-black dark:bg-slate-900 dark:text-white'>
            <div className="border p-8 rounded-lg bg-white text-black dark:bg-slate-800 dark:text-white shadow-xl">
                <div className="modl-box">
                    <form onSubmit={handleSubmit(onSubmit)} method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link>

                        <h3 className="font-bold text-lg">Sign up</h3>
                        
                        {error && (
                            <div className="alert alert-error mt-4">
                                <span>{error}</span>
                            </div>
                        )}
                        
                        <div className='mt-4 space-y-2'>
                            <span>Name</span>
                            <br />
                            <input type="text"
                                placeholder='Enter your Name' 
                                className='w-80 px-3 py-1 border rounded-md outline-none bg-white text-black dark:bg-slate-700 dark:text-white'
                                {...register("name", { required: true })} />
                            <br />
                            {errors.name && <span className='text-sm text-red-500'>This field is required</span>}
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
                                {...register("password", { required: true, minLength: 6 })} />
                            <br />
                            {errors.password && (
                                <span className='text-sm text-red-500'>
                                    {errors.password.type === 'required' ? 'This field is required' : 'Password must be at least 6 characters'}
                                </span>
                            )}
                        </div>
                        <div className='flex justify-around mt-4'>
                            <button 
                                type="submit"
                                disabled={loading}
                                className='bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-500 duration-200 disabled:opacity-50'
                            >
                                {loading ? 'Signing up...' : 'Sign up'}
                            </button>
                            <p>Have account
                                <button 
                                    type="button"
                                    className='underline text-blue-500 cursor-pointer' 
                                    onClick={openLoginModal}
                                >
                                    Login
                                </button> {""}
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
