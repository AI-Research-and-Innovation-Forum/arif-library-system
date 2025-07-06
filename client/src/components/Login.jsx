import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { authAPI } from '../services/api';

function Login({ onLoginSuccess }) {
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
            const response = await authAPI.login(data);
            const { token, _id, name, email, role } = response.data;
            
            // Store token and user data including role
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ _id, name, email, role }));
            
            // Call the success callback if provided
            if (onLoginSuccess) {
                onLoginSuccess({ _id, name, email, role });
            }
            
            // Close the modal
            document.getElementById("my_modal_3").close();
            
            // Redirect based on user role
            if (role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openSignupModal = () => {
        // Close login modal
        document.getElementById("my_modal_3").close();
        // Navigate to signup page
        navigate('/signup');
    };

    return (
        <div>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box bg-white text-black dark:bg-slate-800 dark:text-white">
                    <Link to={"/"}
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => document.getElementById("my_modal_3").close()}
                    >
                        ✕
                    </Link>
                    <h3 className="font-bold text-lg">Login</h3>
                    
                    {error && (
                        <div className="alert alert-error mt-4">
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            <button 
                                type="submit"
                                disabled={loading}
                                className='bg-pink-500 text-white rounded-md px-3 py-1 hover:bg-pink-700 duration-200 disabled:opacity-50'
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <p>Not registered
                                <button 
                                    type="button"
                                    onClick={openSignupModal}
                                    className='underline text-blue-500 cursor-pointer'
                                >
                                    Signup
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    )
}

export default Login;
