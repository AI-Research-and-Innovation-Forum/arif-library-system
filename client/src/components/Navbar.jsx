import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';

function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const element = document.documentElement;

    // Check authentication status on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }
    }, []);

    const handleThemeSwitch = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
    };

    useEffect(() => {
        if (theme === "dark") {
            element.classList.add("dark");
            localStorage.setItem("theme", "dark");
            document.body.classList.add("dark");
        } else {
            element.classList.remove("dark");
            localStorage.setItem("theme", "light");
            document.body.classList.remove("dark");
        }
    }, [theme]);

    const [sticky, setSticky] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setSticky(true)
            } else {
                setSticky(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const navItems = (
        <>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/books'>Books</Link></li>
            <li><Link to='/question-papers'>Question Papers</Link></li>
            <li><Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}>Dashboard</Link></li>
        </>
    );

    return (
        <>
            <div className={`max-w-screen-2xl container mx-auto md:px-20 md:pl-16 md:pr-4 fixed top-0 left-0 right-0 z-50 ${
                sticky 
                ? "sticky-navbar shadow-md bg-amber-100 text-black dark:bg-slate-800 dark:text-white duration-300 transition-all ease-in-out" 
                : "bg-white text-black dark:bg-slate-900 dark:text-white"
            }`}>
                <div className="navbar">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-amber-100 dark:bg-slate-800 rounded-box z-1 mt-3 w-52 p-2 shadow">{navItems}</ul>
                        </div>
                        <Link to="/" className="text-2xl font-bold cursor-pointer">Library Management</Link>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">{navItems}</ul>
                    </div>
                    <div className="navbar-end">
                        <div className="flex items-center gap-4">
                            <button onClick={handleThemeSwitch} className="btn btn-ghost btn-circle border border-black dark:border-white hover:bg-pink-500">
                                {theme === "light" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                )}
                            </button>

                            {isAuthenticated ? (
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full bg-primary text-primary-content relative">
                                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white dark:bg-slate-800 rounded-box w-52 border border-gray-200 dark:border-gray-700">
                                        <li><span className="font-semibold text-black dark:text-white">{user?.name}</span></li>
                                        <li><span className="text-sm opacity-70 text-black dark:text-white">{user?.email}</span></li>
                                        <li><hr className="border-gray-200 dark:border-gray-700" /></li>
                                        <li><Link to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="text-black dark:text-white">Dashboard</Link></li>
                                        <li><a className="text-black dark:text-white">Profile</a></li>
                                        <li><a className="text-black dark:text-white">Settings</a></li>
                                        <li><hr className="border-gray-200 dark:border-gray-700" /></li>
                                        <li><a onClick={handleLogout} className="text-black dark:text-white">Logout</a></li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to="/signup"
                                        className="bg-white text-black border border-black dark:bg-slate-700 dark:text-white dark:border-gray-300 px-3 py-2 rounded-md hover:bg-pink-500 duration-300 cursor-pointer hidden sm:inline-block"
                                    >
                                        Signup
                                    </Link>
                                    <a 
                                        className="bg-black text-white dark:bg-white dark:text-black px-3 py-2 rounded-md hover:bg-pink-500 duration-300 cursor-pointer" 
                                        onClick={()=>document.getElementById("my_modal_3").showModal()}
                                    >
                                        Login
                                    </a>
                                    <Login onLoginSuccess={(userData) => {
                                        setUser(userData);
                                        setIsAuthenticated(true);
                                    }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar
