Safety Companion

A full-stack web application designed to enhance personal safety for individuals, especially women and solo travelers. The platform provides real-time location tracking, safety route analysis, emergency contact management, and instant SOS alerts.

Features
1. Authentication

Secure user registration and login using JWT

Password encryption with bcrypt

Forgot password and reset functionality

2. Dashboard

Personalized user dashboard

Quick access to key features

Voice-based protection trigger

SOS emergency alert system

3. Safety Map

Live location tracking

Multiple route suggestions using Google Maps

Safety scoring based on nearby places (police, hospitals, public areas)

Identification of unsafe zones

Route insights with detailed explanations

4. Emergency Contacts

Add, edit, and delete emergency contacts

Secure storage with authentication

Quick access during emergencies

5. Safety Tips

Curated safety guidelines

Interactive checklist for readiness

Static safety recommendations for real-world situations

Tech Stack
Frontend

React.js

Tailwind CSS

Axios

Google Maps JavaScript API

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

bcrypt for password hashing

Project Structure
client/
  ├── src/
  │   ├── pages/
  │   ├── components/
  │   └── context/

server/
  ├── models/
  ├── routes/
  ├── middleware/
  └── server.js
Installation & Setup
1. Clone the repository
git clone <your-repo-link>
cd project-folder
2. Backend Setup
cd server
npm install

Create a .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5001

Run backend:

npm start
3. Frontend Setup
cd client
npm install

Create .env:

REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key

Run frontend:

npm start
API Endpoints
Auth

POST /signup

POST /login

GET /api/auth/me

Password Reset

POST /api/forgot-password

POST /api/reset-password/:token

Contacts

GET /api/contacts

POST /api/contacts

PUT /api/contacts/:id

DELETE /api/contacts/:id

SOS

POST /api/sos

Deployment (Overview)

Frontend: Vercel / Netlify

Backend: Render / Railway

Database: MongoDB Atlas

Steps:

Push code to GitHub

Deploy backend and configure environment variables

Deploy frontend and connect API URLs

Update CORS settings in backend

Future Improvements

Real-time alerts using notifications

Integration with emergency services APIs

Advanced AI-based route safety prediction

Mobile application version

Author

Gangamithra R

