# 📚 Library Management System

A full-stack **Library Management System** built with Node.js, Express, MongoDB, and a modern React frontend (Vite). This system allows administrators to manage books, users, and records efficiently with real-time operations, secure authentication, and email notifications.
A Library Management System (LMS) is a software application designed to manage the activities of a library. It helps in automating the process of managing books, users, and other library resources. The system is typically used by library staff (such as librarians) to track books, maintain records of users, manage book loans, and manage various library activities like adding, removing, or editing books in the library's catalog.

In this specific Library Management System, we focus on features that help manage users (students, teachers, and admins), books, and the flow of information between these entities.
---

## 🚀 Features

- 📖 Manage books: Add, update, delete
- 👤 Manage users: Admin, Student, Teacher
- 🔐 Role-based login with JWT authentication
- 📬 Email notifications when new users are created
- 🧠 Dashboard with statistics
- 🔄 Issue and return books with due date tracking
- 🖼️ Upload profile pictures

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS (or your UI stack)
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Email Service**: Nodemailer
- **Authentication**: JWT, Bcrypt

---

## ⚙️ Software Requirements

Ensure the following software is installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Chrome Browser](https://www.google.com/chrome/)
- [VS Code (optional)](https://code.visualstudio.com/)

---

3. **Install Backend Dependencies**:
- Open terminal/command prompt in the `backend` folder.
- Run the following command to install the necessary packages:
  ```bash
  npm install
  ```

4. **Start the Backend Server**:
- Run the backend server with the following command:
  ```bash
  npm run dev
  ```
- This will start the backend server (usually on `http://localhost:5000`).

### Frontend Setup

1. **Open the Frontend Folder**:
- Now, navigate to the `frontend` folder.

2. **Install Frontend Dependencies**:
- Open terminal/command prompt in the `frontend` folder.
- Run the following command to install the necessary frontend packages:
  ```bash
  npm install
  ```

3. **Start the Frontend Server**:
- Run the following command to start the frontend server:
  ```bash
  npm run dev
  ```
- This will start the frontend application (usually on `http://localhost:5173`).

4. **Access the Application**:
- Open your browser (Chrome recommended) and go to: [http://localhost:5173](http://localhost:5173)
- The application should load successfully.

### Admin Credentials

To login as an **Admin**, follow these steps:

1. **Insert Admin Data**:
Before logging in, insert the following admin data into your **MongoDB users collection**. You can do this manually in MongoDB or use a MongoDB GUI tool like **MongoDB Compass**.

Example document to insert:
```json
{
  "_id": { "$oid": "64fea729cb871bf64c42010c" },
  "email": "vg33225@gmail.com",
  "fatherName": "ABCD",
  "role": "Admin",
  "password": "$2b$10$HmytXGhI64nyQnvKpB/xCutFxu11KHd/W29b50siqtxeH.9UaaUhO",
  "accountStatus": "Active",
  "name": "Vishal Gangwar",
  "imagePath": "uploads/1700.png",
  "updatedAt": { "$date": "2023-11-18T11:20:18.692Z" }
}
