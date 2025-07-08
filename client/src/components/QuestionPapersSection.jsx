import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { questionPaperAPI } from '../services/api';
import Login from './Login';

function QuestionPapersSection() {
    const [questionPapers, setQuestionPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchRecentQuestionPapers();
        checkUserAuth();
    }, []);

    const fetchRecentQuestionPapers = async () => {
        try {
            const response = await questionPaperAPI.getAllQuestionPapers({
                page: 1,
                limit: 6
            });
            setQuestionPapers(response.data.data);
        } catch (err) {
            console.error('Error fetching question papers:', err);
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

    // Custom card component for homepage
    const HomeQuestionPaperCard = ({ paper }) => {
        const getButtonText = () => {
            if (!user) return 'Login to Download';
            return 'Visit Question Papers';
        };

        const getButtonAction = () => {
            if (!user) {
                return () => document.getElementById("my_modal_3").showModal();
            }
            return () => {}; // Will be handled by Link
        };

        const formatFileSize = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        return (
            <div className="card bg-blue-50 text-black dark:bg-slate-800 dark:text-white shadow-xl hover:scale-105 duration-200 transition-transform">
                <div className="card-body">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                            <h2 className="card-title text-lg mb-1">
                                {paper.title}
                                <div className="badge badge-primary badge-sm">{paper.semester} Sem</div>
                            </h2>
                            <p className="text-sm opacity-70 mb-1">
                                <strong>Subject:</strong> {paper.subject}
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                        <p className="text-xs opacity-60">
                            <strong>Year:</strong> {paper.year}
                        </p>
                        <p className="text-xs opacity-60">
                            <strong>Course:</strong> {paper.course}
                        </p>
                        <p className="text-xs opacity-60">
                            <strong>Size:</strong> {formatFileSize(paper.fileSize)}
                        </p>
                        <p className="text-xs opacity-60">
                            <strong>Downloads:</strong> {paper.downloads}
                        </p>
                    </div>
                    
                    {paper.description && (
                        <p className="text-xs opacity-70 mb-3 line-clamp-2">
                            {paper.description}
                        </p>
                    )}
                    
                    <div className="card-actions justify-end">
                        {user ? (
                            <Link to="/question-papers" className="btn btn-sm btn-primary hover:bg-blue-600">
                                {getButtonText()}
                            </Link>
                        ) : (
                            <button
                                onClick={getButtonAction()}
                                className="btn btn-sm btn-primary hover:bg-blue-600"
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
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
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
                <div>
                    <h1 className='font-semibold text-xl pb-2'>
                        Recent Question Papers 
                    </h1>
                    <p>Access previous year question papers to help you prepare for your exams effectively.</p>
                </div>

                {questionPapers.length > 0 ? (
                    <div>
                        <Slider {...settings}>
                            {questionPapers.map((paper) => (
                                <div key={paper._id} className="px-2">
                                    <HomeQuestionPaperCard paper={paper} />
                                </div>
                            ))}
                        </Slider>
                        
                        <div className="text-center mt-6">
                            <Link 
                                to="/question-papers" 
                                className="btn btn-primary hover:bg-blue-600"
                            >
                                View All Question Papers
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No question papers available at the moment.</p>
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

export default QuestionPapersSection; 