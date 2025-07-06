import React, { useState } from 'react';

function BookCard({ book, onRequest, user }) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRequestClick = () => {
    if (!user) {
      document.getElementById("my_modal_3").showModal();
      return;
    }

    if (user.role === 'admin') {
      alert('Administrators cannot request books. Please use a regular user account.');
      return;
    }
    
    if (book.copiesAvailable <= 0) {
      alert('This book is currently not available for borrowing');
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmRequest = () => {
    onRequest(book._id);
    setShowConfirmation(false);
  };

  const cancelRequest = () => {
    setShowConfirmation(false);
  };

  const getAvailabilityStatus = () => {
    if (book.copiesAvailable > 0) {
      return { text: 'Available', color: 'badge-success' };
    } else {
      return { text: 'Not Available', color: 'badge-error' };
    }
  };

  const getRequestButtonText = () => {
    if (!user) return 'Login to Request';
    if (user.role === 'admin') return 'Admin - Cannot Request';
    if (book.copiesAvailable <= 0) return 'Not Available';
    return 'Request Book';
  };

  const getRequestButtonDisabled = () => {
    return !user || user.role === 'admin' || book.copiesAvailable <= 0;
  };

  const availability = getAvailabilityStatus();

  return (
    <>
      <div className="card bg-amber-50 text-black dark:bg-slate-800 dark:text-white shadow-xl hover:scale-105 duration-200 transition-transform">
        <figure className="h-48">
          {book.image ? (
            <img
              src={`http://localhost:8080${book.image}`}
              alt={book.title}
              className="w-full h-full object-cover"
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
        
        <div className="card-body">
          <h2 className="card-title text-lg">
            {book.title}
            <div className="badge badge-secondary">{book.category || 'General'}</div>
          </h2>
          
          <p className="text-sm opacity-70 mb-2">
            <strong>Author:</strong> {book.author || 'Unknown'}
          </p>
          
          {book.isbn && (
            <p className="text-xs opacity-60 mb-2">
              <strong>ISBN:</strong> {book.isbn}
            </p>
          )}
          
          <div className="card-actions justify-between items-center mt-4">
            <div className="flex flex-col items-start">
              <div className={`badge ${availability.color}`}>
                {availability.text}
              </div>
              <p className="text-xs opacity-70 mt-1">
                {book.copiesAvailable} cop{book.copiesAvailable !== 1 ? 'ies' : 'y'} available
              </p>
            </div>
            
            <button
              onClick={handleRequestClick}
              disabled={getRequestButtonDisabled()}
              className={`btn btn-sm ${
                getRequestButtonDisabled()
                  ? 'btn-disabled' 
                  : 'btn-primary hover:bg-pink-600'
              }`}
            >
              {getRequestButtonText()}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Book Request</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {book.image ? (
                  <img
                    src={`http://localhost:8080${book.image}`}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm opacity-70">by {book.author || 'Unknown'}</p>
                  <p className="text-xs opacity-60">{book.category || 'General'}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Request Process:</strong>
                </p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Submit a request for the book</li>
                  <li>• Wait for admin approval</li>
                  <li>• Contact librarian to collect your book</li>
                  <li>• You can borrow the book for up to 14 days</li>
                  <li>• Return the book to the librarian</li>
                </ul>
              </div>
              
              <p className="text-sm">
                Are you sure you want to request <strong>"{book.title}"</strong>?
              </p>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={cancelRequest}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={confirmRequest}
              >
                Request Book
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookCard; 