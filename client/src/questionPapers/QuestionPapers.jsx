import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import QuestionPaperCard from '../components/QuestionPaperCard';
import QuestionPaperUpload from '../components/QuestionPaperUpload';
import { questionPaperAPI } from '../services/api';

function QuestionPapers() {
    const [questionPapers, setQuestionPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [filters, setFilters] = useState({
        subject: '',
        year: '',
        semester: '',
        course: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    useEffect(() => {
        checkUserAuth();
        fetchQuestionPapers();
    }, [filters, pagination.currentPage]);

    const checkUserAuth = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const fetchQuestionPapers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.currentPage,
                limit: pagination.itemsPerPage,
                ...filters
            });

            const response = await questionPaperAPI.getAllQuestionPapers(params);
            setQuestionPapers(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching question papers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleUploadSuccess = () => {
        setShowUploadModal(false);
        fetchQuestionPapers();
    };

    const clearFilters = () => {
        setFilters({
            subject: '',
            year: '',
            semester: '',
            course: ''
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    return (
        <>
            <Navbar />
            
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Previous Year Question Papers
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Access a comprehensive collection of previous year question papers to help you prepare for your exams.
                        </p>
                    </div>

                    {/* Upload Button */}
                    {user && (
                        <div className="mb-6">
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="bg-pink-500 hover:bg-pink-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Upload Question Paper
                            </button>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-amber-100 dark:bg-slate-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={filters.subject}
                                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                                    placeholder="Search by subject..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-black dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Year
                                </label>
                                <select
                                    value={filters.year}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-black dark:text-white"
                                >
                                    <option value="">All Years</option>
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Semester
                                </label>
                                <select
                                    value={filters.semester}
                                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-black dark:text-white"
                                >
                                    <option value="">All Semesters</option>
                                    {semesters.map(sem => (
                                        <option key={sem} value={sem}>{sem} Semester</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Course
                                </label>
                                <input
                                    type="text"
                                    value={filters.course}
                                    onChange={(e) => handleFilterChange('course', e.target.value)}
                                    placeholder="Search by course..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-black dark:text-white"
                                />
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>

                    {/* Question Papers Grid */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="loading loading-spinner loading-lg"></div>
                        </div>
                    ) : questionPapers.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {questionPapers.map((paper) => (
                                    <QuestionPaperCard
                                        key={paper._id}
                                        paper={paper}
                                        user={user}
                                        onDownload={fetchQuestionPapers}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center">
                                    <div className="join">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="join-item btn btn-outline"
                                        >
                                            Previous
                                        </button>
                                        
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`join-item btn ${page === pagination.currentPage ? 'btn-active' : 'btn-outline'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="join-item btn btn-outline"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No question papers found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Try adjusting your filters or check back later for new uploads.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <QuestionPaperUpload
                    onClose={() => setShowUploadModal(false)}
                    onSuccess={handleUploadSuccess}
                />
            )}

            <Footer />
        </>
    );
}

export default QuestionPapers; 