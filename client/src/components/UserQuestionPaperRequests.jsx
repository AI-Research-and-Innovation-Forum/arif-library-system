import React, { useState, useEffect } from 'react';
import { questionPaperRequestAPI } from '../services/api';

function UserQuestionPaperRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            setLoading(true);
            const response = await questionPaperRequestAPI.getMyRequests();
            setRequests(response.data.data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (requestId) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await questionPaperRequestAPI.deleteRequest(requestId);
                fetchMyRequests();
            } catch (error) {
                console.error('Error deleting request:', error);
                alert('Failed to delete request');
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'badge-warning', text: 'Pending Review' },
            approved: { color: 'badge-success', text: 'Approved' },
            rejected: { color: 'badge-error', text: 'Rejected' }
        };
        
        const config = statusConfig[status] || { color: 'badge-neutral', text: status };
        return <span className={`badge ${config.color}`}>{config.text}</span>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    My Question Paper Requests
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Track the status of your submitted question paper requests.
                </p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📄</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No requests found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        You haven't submitted any question paper requests yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request._id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                        {request.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {request.subject} • {request.semester} Semester • {request.year}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {request.course} • {formatFileSize(request.fileSize)}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    {getStatusBadge(request.status)}
                                </div>
                            </div>

                            {request.description && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        <strong>Description:</strong> {request.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        <strong>Submitted:</strong> {formatDate(request.createdAt)}
                                    </p>
                                </div>
                                {request.reviewedAt && (
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            <strong>Reviewed:</strong> {formatDate(request.reviewedAt)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {request.adminFeedback && (
                                <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <strong>Admin Feedback:</strong> {request.adminFeedback}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {request.reviewedBy && (
                                        <span>Reviewed by: {request.reviewedBy.name}</span>
                                    )}
                                </div>
                                
                                {request.status === 'pending' && (
                                    <button
                                        onClick={() => handleDelete(request._id)}
                                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                    >
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserQuestionPaperRequests; 