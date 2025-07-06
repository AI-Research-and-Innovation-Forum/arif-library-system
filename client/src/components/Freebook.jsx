import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { bookAPI } from '../services/api';
import BookCard from './BookCard';
import Login from './Login';

function Freebook() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        fetchBooks();
        checkUserAuth();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await bookAPI.getAllBooks();
            // Filter books that are available (have copies)
            const availableBooks = response.data.filter(book => book.copiesAvailable > 0);
            setBooks(availableBooks);
        } catch (err) {
            console.error('Error fetching books:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkUserAuth = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const handleBorrowBook = async (bookId) => {
        // This will be handled by the parent component or through a modal
        console.log('Borrow book:', bookId);
    };

    // Custom card component for homepage
    const HomeBookCard = ({ book }) => {
        const getButtonText = () => {
            if (!user) return 'Login to Request';
            return 'Visit Books Page';
        };

        const getButtonAction = () => {
            if (!user) {
                return () => document.getElementById("my_modal_3").showModal();
            }
            return () => {}; // Will be handled by Link
        };

        const availability = book.copiesAvailable > 0 
            ? { text: 'Available', color: 'badge-success' }
            : { text: 'Not Available', color: 'badge-error' };

        return (
            <div className="card h-full bg-amber-100 text-black dark:bg-slate-800 dark:text-white shadow-xl hover:scale-105 duration-200 transition-transform">
                <figure className="h-48">
                    {book.image ? (
                        <img
                            src={`http://localhost:8080${book.image}`}
                            alt={book.title}
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl mb-2">📚</div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">No Image</p>
                            </div>
                        </div>
                    )}
                </figure>
                
                <div className="card-body flex flex-col">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="card-title text-lg line-clamp-2 flex-grow card-title-stable">
                                {book.title}
                            </h2>
                            <div className="badge badge-secondary ml-2 flex-shrink-0">{book.category || 'General'}</div>
                        </div>
                        
                        <p className="text-sm opacity-70">
                            <strong>Author:</strong> {book.author || 'Unknown'}
                        </p>
                        
                        {book.isbn && (
                            <p className="text-xs opacity-60 mb-2">
                                <strong>ISBN:</strong> {book.isbn}
                            </p>
                        )}
                    </div>
                    
                    <div className="card-actions justify-between items-center mt-4">
                        <div className="flex flex-col items-start">
                            <div className={`badge ${availability.color}`}>
                                {availability.text}
                            </div>
                            <p className="text-xs opacity-70 mt-1">
                                {book.copiesAvailable} cop{book.copiesAvailable !== 1 ? 'ies' : 'y'} available
                            </p>
                        </div>
                        
                        {user ? (
                            <Link to="/books" className="btn btn-sm btn-primary hover:bg-pink-500">
                                {getButtonText()}
                            </Link>
                        ) : (
                            <button
                                onClick={getButtonAction()}
                                className="btn btn-sm btn-primary hover:bg-pink-500"
                            >
                                {getButtonText()}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    var settings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false
                }
            }
        ]
    };

    if (loading) {
        return (
            <div className='max-w-screen-2xl container mx-auto md-px-20 md:pl-16 md:pr-4 md:mb-16 md:mt-16'>
                <div className="flex justify-center items-center h-32">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='max-w-screen-2xl container mx-auto md-px-20 md:pl-16 md:pr-4 md:mb-16 md:mt-16'>
                <div className="ml-2 mb-2.5">
                    <h1 className='font-semibold text-xl pb-2'>
                        Available Books 
                    </h1>
                    <p>Browse through our collection of books available for borrowing. Find your next favorite read!</p>
                </div>

                {books.length > 0 ? (
                    <div>
                        <Slider {...settings}>
                            {books.slice(0, 6).map((book) => (
                                <div key={book._id} className="px-2">
                                    <HomeBookCard book={book} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No books available at the moment.</p>
                    </div>
                )}
            </div>
            
            {/* Login Modal */}
            <Login onLoginSuccess={(userData) => {
                setUser(userData);
            }} />
        </>
    );
}

export default Freebook;