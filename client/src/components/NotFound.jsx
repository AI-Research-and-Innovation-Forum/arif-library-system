import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          {/* 404 Icon */}
          <div className="text-8xl mb-6">🔍</div>
          
          {/* 404 Text */}
          <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            404
          </h1>
          
          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="btn btn-primary btn-lg"
            >
              🏠 Return to Home
            </Link>
            <Link 
              to="/books" 
              className="btn btn-outline btn-lg"
            >
              📚 Browse Books
            </Link>
          </div>
          
          {/* Additional Help */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try navigating using the menu above, or contact support if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound; 