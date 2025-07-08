# ARIF Library Management System

A full-stack library management system built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

- **User Authentication**: Register and login functionality
- **Book Management**: Add, view, and delete books (Admin only)
- **Book Issuing**: Issue and return books
- **Admin Dashboard**: View statistics and manage the library
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- DaisyUI

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ARIF-Library-Management
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=8080
MONGO_URL=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```

## Running the Application

### 1. Start the Backend Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:8080`

### 2. Start the Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book (Admin only)
- `GET /api/books/:id` - Get book by ID
- `DELETE /api/books/:id` - Delete book (Admin only)

### Admin
- `POST /api/admin/add-book` - Add book (Admin only)
- `DELETE /api/admin/delete-book/:id` - Delete book (Admin only)
- `POST /api/admin/issue-book` - Issue book to user
- `POST /api/admin/return-book` - Return book
- `GET /api/admin/issued-books` - Get all issued books

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/my-issued-books` - Get user's issued books

### Issues
- `POST /api/issues/issue` - Issue book
- `POST /api/issues/return` - Return book
- `GET /api/issues/mybooks` - Get user's books

## Project Structure

```
ARIF Library Management/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── admin/         # Admin components
│   │   ├── components/    # Reusable components
│   │   ├── services/      # API services
│   │   └── ...
│   └── ...
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   └── ...
└── README.md
```

## Usage

1. **Register/Login**: Users can register or login to access the system
2. **Browse Books**: View all available books in the library
3. **Admin Functions**: 
   - Add new books
   - Delete existing books
   - View dashboard statistics
   - Manage book issues and returns
4. **User Functions**:
   - View issued books
   - Request book returns

## Development

### Adding New Features
1. Create API endpoints in the backend
2. Add corresponding frontend components
3. Update the API service layer
4. Test the integration

### Environment Variables
Make sure to set up proper environment variables for production:
- Use a strong JWT secret
- Set up a production MongoDB connection
- Configure CORS settings appropriately

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License. 