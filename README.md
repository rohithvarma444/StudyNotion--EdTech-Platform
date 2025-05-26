# StudyNotion - Modern EdTech Platform

StudyNotion is a comprehensive educational technology platform that revolutionizes the way students learn and educators teach. Built with modern technologies and best practices, it provides a seamless learning experience for all users.

## 🌐 Live Demo

Visit our production environment at: [StudyNotion Platform](https://study-notion-ed-tech-platform-git-main-rohithvarma444s-projects.vercel.app/)

## 🚀 Features

### For Students
- 📚 Access to comprehensive course materials
- 📝 Interactive learning modules
- 📊 Progress tracking and analytics

### For Educators
- 📋 Course creation and management
- 👥 Student engagement tracking
- 📈 Performance reporting

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer


## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StudyNotion.git
   cd StudyNotion
   ```

2. **Install Dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both client and server directories:

   Server `.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_pass
   ```

   Client `.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start Development Servers**

   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server (in a new terminal)
   cd client
   npm start
   ```



## 🔒 Security

- JWT-based authentication
- Password hashing using bcrypt
- CORS enabled
- Rate limiting

## 📦 Deployment

The application can be deployed using various platforms:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

