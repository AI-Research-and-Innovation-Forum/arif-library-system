# 📚 ARIF Library Management System

A full-stack library management web application built by the [AI Research and Innovation Forum (ARIF)](https://github.com/AI-Research-and-Innovation-Forum), designed to digitize and simplify library services for both students and administrators.

## 🔗 Live Website

🌐 [Visit the Live App](https://arif-library-management.netlify.app)

---

## 🚀 Features

- 📚 Book Request System: Students can browse and request books. Admins approve requests and issue the book physically.
- 👤 Role-Based Login: Secure authentication system for students and admins.
- 📄 Question Paper Upload/Download: Students can contribute and access previous year papers.
- ☁️ Cloudinary Integration: Efficient file storage and delivery for documents and images.
- 🌗 Light/Dark Theme Toggle: Switch between light and dark modes for a personalized experience.
- 🔍 Real-time Book Filtering: Quickly find books by title, author, or category.
- 📈 Admin Dashboard: View stats, manage books, users, and requests in one place.

---

## 🛠️ Tech Stack

**Frontend**:

- React.js
- Tailwind CSS
- Axios
- React Router DOM

**Backend**:

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary (for file upload)
- dotenv, morgan, cors

---

## 🧑‍💻 Contributors

Special thanks to our amazing contributors:

- [Soham Chaudhari](https://github.com/Soham156)
- [Vaibhav Chaudhari](https://github.com/VaibhavChaudhari07)

---

## 🧪 Running Locally

### 📁 Backend

```bash
cd server
npm install
npm run dev
```

Create a `.env` file in `/server` with:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 🌐 Frontend

```bash
cd client
npm install
npm start
```

---

## 📂 Folder Structure

```
ARIF-Library-System/
│
├── client/        # React Frontend
├── server/        # Node.js + Express Backend
├── README.md
```

---

## 📌 Notes

- Make sure MongoDB is running locally or use a MongoDB Atlas URL.
- Cloudinary is used for uploading book images and question papers.
- Contributions are welcome! Feel free to open issues or submit PRs.

---

## 📃 License

This project is licensed under the MIT License.

---

Made with ❤️ by the ARIF Community.
