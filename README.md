
# StudyNotion - Edtech Platform

StudyNotion
 is a robust online education platform designed to revolutionize the learning experience. By leveraging the MERN stack (MongoDB, Express.js, React.js, Node.js), StudyNotion offers a seamless and interactive environment for both students and instructors.

## Deployment Url
https://studynotion-50bs0r6r3-rohithvarma444s-projects.vercel.app



## Environment Variables

To run this project, you will need to add the following environment variables to your /server/.env file
```
MAIL_HOST = smtp.gmail.com
MAIL_USER = <email>
MAIL_PASS = "<password>"
ADMIN_MAIL = "<email>"
JWT_SECRET = "<secret>"
FOLDER_NAME = "uploads"
RAZORPAY_KEY = <your-api-key>
RAZORPAY_SECRET = <your-secret-key>
CLOUD_NAME = <cloudinary-instance>
API_KEY = <api-key-here>
API_SECRET = <api-secret-here>
MONGODB_URL = mongodb+srv://<user>:<pass>@edtech.h9ice.mongodb.net/Edtech
PORT = 4000
```
And also need to add the BackendURL in the /client/services/apis.js file
```backend-url/api/v4```
## Installation
Run these Installation commands in the root page of this repo

Backend:
```bash
  cd server
  npm install && npm run start
```
Frontend:
```bash
  cd client
  npm install && npm run start
```
    