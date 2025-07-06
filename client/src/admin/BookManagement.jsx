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
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Book Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
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
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Add New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Author</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">ISBN</span>
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Copies Available</span>
                  </label>
                  <input
                    type="number"
                    name="copiesAvailable"
                    value={formData.copiesAvailable}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Book Cover Image</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input file-input-bordered w-full"
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
                    <span className="label-text">Image Preview</span>
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

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th>Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>
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
                </td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.isbn}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{book.copiesAvailable}</span>
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

      {/* Copy Update Modal */}
      {showCopyModal && selectedBook && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Update Book Copies</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedBook.image ? (
                  <img
                    src={`http://localhost:8080${selectedBook.image}`}
                    alt={selectedBook.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{selectedBook.title}</h4>
                  <p className="text-sm opacity-70">by {selectedBook.author || 'Unknown'}</p>
                  <p className="text-xs opacity-60">Current copies: {selectedBook.copiesAvailable}</p>
                </div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">New Number of Copies</span>
                </label>
                <input
                  type="number"
                  value={newCopies}
                  onChange={(e) => setNewCopies(parseInt(e.target.value) || 0)}
                  className="input input-bordered w-full"
                  min="0"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the total number of copies available for this book
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> This will set the total number of copies available for borrowing.
                </p>
              </div>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost" 
                onClick={() => {
                  setShowCopyModal(false);
                  setSelectedBook(null);
                  setNewCopies(0);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleUpdateCopies}
                disabled={newCopies < 0}
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