import React, { useState } from 'react';
import { questionPaperAPI } from '../services/api';

function QuestionPaperCard({ paper, user, onDownload }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!user) {
            // Show login modal or redirect to login
            document.getElementById("my_modal_3").showModal();
            return;
        }

        try {
            setDownloading(true);
            const response = await questionPaperAPI.downloadQuestionPaper(paper._id);
            
            // Create a blob from the response
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = `${paper.title}_${paper.year}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            // Refresh the list to update download count
            if (onDownload) onDownload();
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download the file. Please try again.');
        } finally {
            setDownloading(false);
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
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {paper.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {paper.subject}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <span className="badge badge-primary badge-sm">{paper.semester} Sem</span>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Year: {paper.year}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {paper.course}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatFileSize(paper.fileSize)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        {paper.downloads} download{paper.downloads !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Description */}
                {paper.description && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {paper.description}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded by {paper.uploadedBy?.name || 'Unknown'} on {formatDate(paper.createdAt)}
                    </div>
                    
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="btn btn-sm btn-primary hover:bg-blue-600 disabled:opacity-50"
                    >
                        {downloading ? (
                            <>
                                <div className="loading loading-spinner loading-xs"></div>
                                Downloading...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuestionPaperCard; 