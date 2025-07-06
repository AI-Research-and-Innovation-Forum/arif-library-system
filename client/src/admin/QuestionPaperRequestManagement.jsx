import React, { useState, useEffect } from 'react';
import { questionPaperRequestAPI } from '../services/api';

function QuestionPaperRequestManagement() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
    const [feedback, setFeedback] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    useEffect(() => {
        fetchRequests();
    }, [filters, pagination.currentPage]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.currentPage,
                limit: pagination.itemsPerPage,
                ...filters
            });

            const response = await questionPaperRequestAPI.getAllRequests(params);
            setRequests(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching requests:', error);
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

    const handleAction = (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        setFeedback('');
        setShowActionModal(true);
    };

    const handleSubmitAction = async () => {
        try {
            if (actionType === 'approve') {
                await questionPaperRequestAPI.approveRequest(selectedRequest._id, feedback);
                alert('Request approved successfully!');
            } else if (actionType === 'reject') {
                if (!feedback.trim()) {
                    alert('Please provide feedback when rejecting a request.');
                    return;
                }
                await questionPaperRequestAPI.rejectRequest(selectedRequest._id, feedback);
                alert('Request rejected successfully!');
            }
            
            setShowActionModal(false);
            setSelectedRequest(null);
            setActionType('');
            setFeedback('');
            fetchRequests();
        } catch (error) {
            console.error('Error processing request:', error);
            alert('Failed to process request. Please try again.');
        }
    };

    const handleDelete = async (requestId) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await questionPaperRequestAPI.deleteRequestAdmin(requestId);
                fetchRequests();
            } catch (error) {
                console.error('Error deleting request:', error);
                alert('Failed to delete request');
            }
        }
    };

    const clearFilters = () => {
        setFilters({ status: '' });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
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
            pending: { color: 'badge-warning', text: 'Pending' },
            approved: { color: 'badge-success', text: 'Approved' },
            rejected: { color: 'badge-error', text: 'Rejected' }
        };
        
        const config = statusConfig[status] || { color: 'badge-neutral', text: status };
        return <span className={`badge ${config.color}`}>{config.text}</span>;
    };

    return (
        <div className="p-2 sm:p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                        Question Paper Requests
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Review and manage question paper upload requests from users.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <div className="max-w-xs w-full mx-auto">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="select select-bordered w-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600 max-w-xs"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={clearFilters}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Requests Table - Responsive */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden">
                    {/* Table for md+ screens, cards for small screens */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Request Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Uploaded By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {requests.map((request) => (
                                    <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {request.title}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-300">
                                                {request.subject} • {request.semester} Sem • {request.year}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-300">
                                                {request.course} • {formatFileSize(request.fileSize)}
                                            </div>
                                            {request.description && (
                                                <div className="text-xs text-gray-400 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {request.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div>{request.uploadedBy?.name || 'Unknown'}</div>
                                            <div className="text-gray-500 dark:text-gray-300 text-xs">
                                                {request.uploadedBy?.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(request.status)}
                                            {request.adminFeedback && (
                                                <div className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                                                    {request.adminFeedback}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(request, 'approve')}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(request, 'reject')}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(request._id)}
                                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Card/List layout for small screens */}
                    <div className="md:hidden flex flex-col gap-4 p-2">
                        {requests.map((request) => (
                            <div key={request._id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="font-semibold text-black dark:text-white text-base">{request.title}</div>
                                    <div className="flex gap-2">
                                        {request.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(request, 'approve')}
                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request, 'reject')}
                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-xs"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDelete(request._id)}
                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                                    {request.subject} • {request.semester} Sem • {request.year}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                                    {request.course} • {formatFileSize(request.fileSize)}
                                </div>
                                {request.description && (
                                    <div className="text-xs text-gray-400 dark:text-gray-400 mt-1 line-clamp-2">
                                        {request.description}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 text-xs mb-1 mt-2">
                                    <span>{getStatusBadge(request.status)}</span>
                                    <span className="text-gray-700 dark:text-gray-200">{formatDate(request.createdAt)}</span>
                                </div>
                                {request.adminFeedback && (
                                    <div className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                                        {request.adminFeedback}
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 dark:text-gray-300">
                                    Uploaded by: {request.uploadedBy?.name || 'Unknown'} ({request.uploadedBy?.email})
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white dark:bg-slate-800 px-2 sm:px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-700 gap-2">
                            <div className="flex-1 flex justify-between w-full sm:w-auto sm:hidden">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 w-1/2"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 w-1/2"
                                >
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full sm:w-auto">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                        Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
                                        <span className="font-medium">
                                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                                        </span> of{' '}
                                        <span className="font-medium">{pagination.totalItems}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={pagination.currentPage === 1}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    page === pagination.currentPage
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={pagination.currentPage === pagination.totalPages}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Modal */}
            {showActionModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
                            </h3>
                            <div className="mb-4">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    <strong>Title:</strong> {selectedRequest.title}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    <strong>Subject:</strong> {selectedRequest.subject}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                    <strong>Course:</strong> {selectedRequest.course}
                                </p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {actionType === 'approve' ? 'Optional Feedback' : 'Feedback (Required)'}
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder={actionType === 'approve' ? 'Optional feedback for the user...' : 'Please provide a reason for rejection...'}
                                    rows="3"
                                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white text-xs sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowActionModal(false);
                                        setSelectedRequest(null);
                                        setActionType('');
                                        setFeedback('');
                                    }}
                                    className="px-3 sm:px-4 py-1 sm:py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-xs sm:text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitAction}
                                    className={`px-3 sm:px-4 py-1 sm:py-2 text-white rounded-md transition-colors text-xs sm:text-sm ${
                                        actionType === 'approve' 
                                            ? 'bg-green-600 hover:bg-green-700' 
                                            : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionPaperRequestManagement; 