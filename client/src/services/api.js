import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getMyIssuedBooks: () => api.get('/users/my-issued-books'),
};

export const bookAPI = {
  getAllBooks: () => api.get('/books'),
  getBookById: (id) => api.get(`/books/${id}`),
  addBook: (bookData) => api.post('/books', bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

export const adminAPI = {
  addBook: (bookData) => {
    const formData = new FormData();
    
    formData.append('title', bookData.title);
    formData.append('author', bookData.author);
    formData.append('category', bookData.category);
    formData.append('isbn', bookData.isbn);
    formData.append('copiesAvailable', bookData.copiesAvailable);
    
    if (bookData.image) {
      formData.append('image', bookData.image);
    }
    
    return api.post('/admin/add-book', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteBook: (id) => api.delete(`/admin/delete-book/${id}`),
  updateBookCopies: (bookId, copiesAvailable) => api.put(`/admin/update-book-copies/${bookId}`, { copiesAvailable }),
  issueBook: (issueData) => api.post('/admin/issue-book', issueData),
  returnBook: (returnData) => api.post('/admin/return-book', returnData),
  getAllIssuedBooks: () => api.get('/admin/issued-books'),
  getAllUsers: () => api.get('/admin/users'),
  getUserWithIssues: (userId) => api.get(`/admin/users/${userId}`),
  getAllUsersWithIssues: () => api.get('/admin/users-with-issues'),
  getAllRequests: () => api.get('/admin/requests'),
  getPendingRequests: () => api.get('/admin/requests/pending'),
  approveRequest: (requestId) => api.put(`/admin/requests/${requestId}/approve`),
  rejectRequest: (requestId, reason) => api.put(`/admin/requests/${requestId}/reject`, { reason }),
  returnRequest: (requestId) => api.put(`/admin/requests/${requestId}/return`),
  deleteRequest: (requestId) => api.delete(`/admin/requests/${requestId}`),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
};

export const issueAPI = {
  requestBook: (bookId) => api.post('/issues/request', { bookId }),
  getMyRequests: () => api.get('/issues/my-requests'),
  approveRequest: (issueId) => api.post('/issues/approve', { issueId }),
  rejectRequest: (issueId, rejectionReason) => api.post('/issues/reject', { issueId, rejectionReason }),
  issueBookDirectly: (issueId) => api.post('/issues/issue-directly', { issueId }),
  returnBookDirectly: (issueId) => api.post('/issues/return-directly', { issueId }),
  getAllRequests: (params) => api.get('/issues/all', { params }),
  getRequestStats: () => api.get('/issues/stats'),
};

export const questionPaperAPI = {
  getAllQuestionPapers: (params) => api.get('/question-papers', { params }),
  getQuestionPaperById: (id) => api.get(`/question-papers/${id}`),
  uploadQuestionPaper: (formData) => api.post('/question-papers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  downloadQuestionPaper: (id) => api.get(`/question-papers/${id}/download`, {
    responseType: 'blob',
  }),
  updateQuestionPaper: (id, data) => api.put(`/question-papers/${id}`, data),
  deleteQuestionPaper: (id) => api.delete(`/question-papers/${id}`),
  getQuestionPaperStats: () => api.get('/question-papers/stats'),
};

export const questionPaperRequestAPI = {
  submitRequest: (formData) => api.post('/question-paper-requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getMyRequests: () => api.get('/question-paper-requests/my-requests'),
  getRequestById: (id) => api.get(`/question-paper-requests/my-requests/${id}`),
  deleteRequest: (id) => api.delete(`/question-paper-requests/my-requests/${id}`),
  getAllRequests: (params) => api.get('/question-paper-requests', { params }),
  getRequestStats: () => api.get('/question-paper-requests/stats'),
  approveRequest: (id, feedback) => api.put(`/question-paper-requests/${id}/approve`, { feedback }),
  rejectRequest: (id, feedback) => api.put(`/question-paper-requests/${id}/reject`, { feedback }),
  deleteRequestAdmin: (id) => api.delete(`/question-paper-requests/${id}`),
};

export default api; 