import React, { useState, useEffect } from 'react';
import { bookAPI, adminAPI } from '../services/api';

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newCopies, setNewCopies] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    copiesAvailable: 1
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getAllBooks();
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Fetch books error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        image: selectedImage
      };
      
      await adminAPI.addBook(bookData);
      setFormData({
        title: '',
        author: '',
        category: '',
        isbn: '',
        copiesAvailable: 1
      });
      setSelectedImage(null);
      setImagePreview(null);
      setShowAddForm(false);
      fetchBooks(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.deleteBook(bookId);
        fetchBooks(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleUpdateCopies = async () => {
    try {
      await adminAPI.updateBookCopies(selectedBook._id, newCopies);
      setShowCopyModal(false);
      setSelectedBook(null);
      setNewCopies(0);
      fetchBooks(); // Refresh the list
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white dark:text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Book copies updated successfully!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book copies');
    }
  };

  const openCopyModal = (book) => {
    setSelectedBook(book);
    setNewCopies(book.copiesAvailable);
    setShowCopyModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
      isbn: '',
      copiesAvailable: 1
    });
    setSelectedImage(null);
    setImagePreview(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">Book Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary w-full sm:w-auto"
        >
          {showAddForm ? 'Cancel' : 'Add New Book'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {showAddForm && (
        <div className="card bg-white dark:bg-slate-800 shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="card-body">
            <h2 className="card-title text-black dark:text-white">Add New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text text-black dark:text-white">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-black dark:text-white">Author</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-black dark:text-white">Category</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-black dark:text-white">ISBN</span>
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-black dark:text-white">Copies Available</span>
                  </label>
                  <input
                    type="number"
                    name="copiesAvailable"
                    value={formData.copiesAvailable}
                    onChange={handleInputChange}
                    className="input input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-black dark:text-white">Book Cover Image</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <label className="label">
                    <span className="label-text text-black dark:text-white">Image Preview</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={imagePreview}
                      alt="Book cover preview"
                      className="w-32 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="btn btn-sm btn-outline"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book List/Table - Responsive */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        {/* Table for md+ screens, cards for small screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700">
                <th className="text-black dark:text-white">Cover</th>
                <th className="text-black dark:text-white">Title</th>
                <th className="text-black dark:text-white">Author</th>
                <th className="text-black dark:text-white">Category</th>
                <th className="text-black dark:text-white">ISBN</th>
                <th className="text-black dark:text-white">Copies</th>
                <th className="text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-200 dark:border-gray-700">
                  <td>
                    {book.image ? (
                      <img
                        src={`http://localhost:8080${book.image}`}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="text-black dark:text-white">{book.title}</td>
                  <td className="text-black dark:text-white">{book.author}</td>
                  <td className="text-black dark:text-white">{book.category}</td>
                  <td className="text-black dark:text-white">{book.isbn}</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-black dark:text-white">{book.copiesAvailable}</span>
                      <button
                        onClick={() => openCopyModal(book)}
                        className="btn btn-xs btn-outline"
                        title="Update copies"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openCopyModal(book)}
                        className="btn btn-info btn-sm"
                      >
                        Update Copies
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="btn btn-error btn-sm"
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
          {books.map((book) => (
            <div key={book._id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4 shadow-sm flex gap-3">
              <div className="flex-shrink-0">
                {book.image ? (
                  <img
                    src={`http://localhost:8080${book.image}`}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-black dark:text-white text-base mb-1">{book.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">by {book.author}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">Category: {book.category}</div>
                <div className="text-xs text-gray-500 dark:text-gray-300 mb-1">ISBN: {book.isbn}</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-info">{book.copiesAvailable} copies</span>
                  <button
                    onClick={() => openCopyModal(book)}
                    className="btn btn-xs btn-outline"
                    title="Update copies"
                  >
                    ✏️
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openCopyModal(book)}
                    className="btn btn-info btn-xs"
                  >
                    Update Copies
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="btn btn-error btn-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Update Modal */}
      {showCopyModal && selectedBook && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-4 text-black dark:text-white">Update Book Copies</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedBook.image ? (
                  <img
                    src={`http://localhost:8080${selectedBook.image}`}
                    alt={selectedBook.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-black dark:text-white">{selectedBook.title}</h4>
                  <p className="text-sm opacity-70 text-black dark:text-white">by {selectedBook.author || 'Unknown'}</p>
                  <p className="text-xs opacity-60 text-black dark:text-white">Current copies: {selectedBook.copiesAvailable}</p>
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text text-black dark:text-white">New Number of Copies</span>
                </label>
                <input
                  type="number"
                  value={newCopies}
                  onChange={(e) => setNewCopies(parseInt(e.target.value) || 0)}
                  className="input input-bordered w-full bg-white dark:bg-slate-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter the total number of copies available for this book
                </p>
              </div>
            </div>
            
            <div className="modal-action">
              <button
                onClick={() => setShowCopyModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCopies}
                className="btn btn-primary"
              >
                Update Copies
              </button>
            </div>
          </div>
        </div>
      )}

      {books.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found. Add your first book!</p>
        </div>
      )}
    </div>
  );
}

export default BookManagement; 