import React, { useState, useEffect } from 'react';
import { bookAPI, issueAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import Login from '../components/Login';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchBooks();
    checkUserAuth();
  }, []);

  const checkUserAuth = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAllBooks();
      setBooks(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(book => book.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBook = async (bookId) => {
    if (!user) {
      alert('Please login to request books');
      return;
    }

    if (user.role === 'admin') {
      alert('Administrators cannot request books. Please use a regular user account.');
      return;
    }

    try {
      // Create a book request
      const response = await issueAPI.requestBook(bookId);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white dark:text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Book requested successfully!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
      fetchBooks(); // Refresh to update availability
    } catch (err) {
      console.error('Error requesting book:', err);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white dark:text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorMessage.textContent = err.response?.data?.message || 'Failed to request book';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 3000);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64 pt-28">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28">
        <div className="max-w-screen-2xl container mx-auto px-4 md:px-20">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Browse Our <span className="text-pink-500">Book Collection</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
              Discover thousands of books across various genres. Find your next favorite read and request to borrow it.
            </p>
            {!user && (
              <div className="alert alert-warning max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>
                  <strong>Login Required:</strong> Please login to request and borrow books from our collection.
                </span>
              </div>
            )}
            {user && user.role === 'admin' && (
              <div className="alert alert-info max-w-2xl mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>
                  <strong>Admin Notice:</strong> Administrators cannot request books. Please use a regular user account for borrowing.
                </span>
              </div>
            )}
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full bg-white dark:bg-slate-800 text-black dark:text-white border-black dark:border-white"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="select select-bordered w-full bg-white dark:bg-slate-800 text-black dark:text-white border-black dark:border-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onRequest={handleRequestBook}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No books available at the moment.'
                }
              </p>
            </div>
          )}

        </div>
      </div>
      <Footer />
      
      {/* Login Modal */}
      <Login onLoginSuccess={(userData) => {
        // Update user state instead of reloading
        setUser(userData);
      }} />
    </>
  );
}

export default Books; 