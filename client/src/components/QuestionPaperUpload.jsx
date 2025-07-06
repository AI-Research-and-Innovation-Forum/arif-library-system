import React, { useState, useEffect } from 'react';
import { questionPaperRequestAPI, questionPaperAPI } from '../services/api';

function QuestionPaperUpload({ onClose, onSuccess, editingPaper }) {
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        year: new Date().getFullYear(),
        semester: '',
        course: '',
        description: ''
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    // Check if user is admin
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Initialize form data when editing
    useEffect(() => {
        if (editingPaper) {
            setFormData({
                title: editingPaper.title || '',
                subject: editingPaper.subject || '',
                year: editingPaper.year || new Date().getFullYear(),
                semester: editingPaper.semester || '',
                course: editingPaper.course || '',
                description: editingPaper.description || ''
            });
        }
    }, [editingPaper]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.semester) {
            newErrors.semester = 'Semester is required';
        }

        if (!formData.course.trim()) {
            newErrors.course = 'Course is required';
        }

        // Only require file for new uploads, not for editing
        if (!editingPaper && !file) {
            newErrors.file = 'Please select a file to upload';
        } else if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                newErrors.file = 'Please upload a PDF or image file (JPEG, PNG)';
            }

            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                newErrors.file = 'File size must be less than 10MB';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (errors.file) {
            setErrors(prev => ({
                ...prev,
                file: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setUploading(true);

            if (editingPaper) {
                // Update existing question paper (admin only)
                if (user?.role !== 'admin') {
                    alert('Only admins can edit question papers.');
                    return;
                }
                
                await questionPaperAPI.updateQuestionPaper(editingPaper._id, {
                    title: formData.title,
                    subject: formData.subject,
                    year: formData.year,
                    semester: formData.semester,
                    course: formData.course,
                    description: formData.description
                });
                
                alert('Question paper updated successfully!');
            } else {
                // New upload - check if user is admin
                if (user?.role === 'admin') {
                    // Admin can upload directly
                    const formDataToSend = new FormData();
                    formDataToSend.append('file', file);
                    formDataToSend.append('title', formData.title);
                    formDataToSend.append('subject', formData.subject);
                    formDataToSend.append('year', formData.year);
                    formDataToSend.append('semester', formData.semester);
                    formDataToSend.append('course', formData.course);
                    formDataToSend.append('description', formData.description);

                    await questionPaperAPI.uploadQuestionPaper(formDataToSend);
                    alert('Question paper uploaded successfully!');
                } else {
                    // Regular user submits request
                    const formDataToSend = new FormData();
                    formDataToSend.append('file', file);
                    formDataToSend.append('title', formData.title);
                    formDataToSend.append('subject', formData.subject);
                    formDataToSend.append('year', formData.year);
                    formDataToSend.append('semester', formData.semester);
                    formDataToSend.append('course', formData.course);
                    formDataToSend.append('description', formData.description);

                    await questionPaperRequestAPI.submitRequest(formDataToSend);
                    alert('Question paper request submitted successfully! It will be reviewed by admin and published once approved.');
                }
            }

            // Reset form
            setFormData({
                title: '',
                subject: '',
                year: new Date().getFullYear(),
                semester: '',
                course: '',
                description: ''
            });
            setFile(null);
            setErrors({});

            onSuccess();
        } catch (error) {
            console.error('Error processing question paper:', error);
            alert('Failed to process question paper. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const isAdmin = user?.role === 'admin';
    const isEditing = !!editingPaper;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isEditing ? 'Edit Question Paper' : (isAdmin ? 'Upload Question Paper' : 'Submit Question Paper Request')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Info Alert - Only show for regular users */}
                    {!isAdmin && !isEditing && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        Your question paper will be reviewed by admin before being published. You'll be notified once it's approved or rejected.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Admin Info Alert */}
                    {isAdmin && !isEditing && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        As an admin, your question paper will be published immediately without review.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Enter question paper title"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Subject and Semester */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Mathematics, Physics"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                                        errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                {errors.subject && (
                                    <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Semester *
                                </label>
                                <select
                                    name="semester"
                                    value={formData.semester}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                                        errors.semester ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                >
                                    <option value="">Select Semester</option>
                                    {semesters.map(sem => (
                                        <option key={sem} value={sem}>{sem} Semester</option>
                                    ))}
                                </select>
                                {errors.semester && (
                                    <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
                                )}
                            </div>
                        </div>

                        {/* Year and Course */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Year
                                </label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Course *
                                </label>
                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleInputChange}
                                    placeholder="e.g., B.Tech CSE, BCA"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${
                                        errors.course ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                {errors.course && (
                                    <p className="text-red-500 text-sm mt-1">{errors.course}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Optional description about the question paper"
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        {/* File Upload - Only show for new uploads */}
                        {!isEditing && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    File *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                            <span className="font-medium text-blue-600 hover:text-blue-500">
                                                Click to upload
                                            </span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            PDF, JPG, PNG up to 10MB
                                        </p>
                                    </label>
                                </div>
                                {file && (
                                    <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-700 rounded">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                )}
                                {errors.file && (
                                    <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                                )}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {uploading ? (
                                    <>
                                        <div className="loading loading-spinner loading-xs mr-2"></div>
                                        {isEditing ? 'Updating...' : 'Processing...'}
                                    </>
                                ) : (
                                    isEditing ? 'Update Question Paper' : (isAdmin ? 'Upload Question Paper' : 'Submit Request')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default QuestionPaperUpload; 