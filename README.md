# Product Space Assignment - Full Stack Authentication Portal

A complete, responsive, full-stack authentication system built as a screening test for the Full Stack Developer Intern position at Product Space. This project features secure user registration, login, and protected route access using JSON Web Tokens (JWT).

## 🚀 Live Demo
* **Frontend (Vercel):** https://product-space-six.vercel.app/
* **Backend API (Render):** https://product-space-30ja.onrender.com

## ✨ Features
* **Secure Authentication:** User registration and login utilizing `bcryptjs` for password hashing and `jsonwebtoken` for secure session management.
* **Protected Routes:** A personalized dashboard that can only be accessed with a valid JWT Bearer token.
* **Modern UI:** A clean, responsive React frontend with interactive loading states, immediate input validation, and clear error handling.
* **Seamless Local Development:** Utilizes a Vite Proxy to eliminate CORS issues during local development, seamlessly routing `/api` requests to the Express backend.
* **Production Ready:** Configured with environment variables to dynamically switch between the local proxy and the live backend URL upon deployment.

## 🛠️ Tech Stack

**Frontend:**
* React.js (via Vite)
* CSS3 / Modern UI Design
* Fetch API

**Backend:**
* Node.js
* Express.js
* JSON Web Tokens (JWT)
* Bcrypt.js
* CORS

## 📂 Project Structure
This project is organized as a monorepo containing both the client and server code.

```text
product-space-assignment/
├── backend/                # Node.js & Express server
│   ├── server.js           # Main application logic & API routes
│   └── package.json
└── frontend/               # React application (Vite)
    ├── src/
    │   ├── App.jsx         # Main UI component and state management
    │   ├── index.css       # Global styling
    │   └── main.jsx        
    ├── vite.config.js      # Vite configuration (Proxy setup)
    └── package.json
