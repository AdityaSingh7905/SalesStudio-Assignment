# SalesStudio - Coupon Management System

## Overview
SalesStudio is a full-stack coupon management system built using **Next.js** for the frontend and **Node.js with Express** for the backend. It allows users to claim coupons securely with proper abuse prevention mechanisms.

## Tech Stack
### Frontend: Next.js, Tailwind CSS
### Backend: Node.js, Express.js, REST APIs, MondoDB(Mongoose)

## Deployment
### Frontend: [Vercel](https://sales-studio-assignment-alpha.vercel.app/)
### Database: MongoDB Atlas
## Folder Structure
```
/salesstudio
 ├── /frontend (Next.js App)
 └── /backend (Node.js with Express)
```

---

## Installation & Setup Instructions
### 1. Clone the Repository
```bash
git clone [GitHub Link](https://github.com/AdityaSingh7905/SalesStudio-Assignment)
cd salesstudio
```

### 2. Install Dependencies
#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### 3. Environment Variables
Create `.env` file inside the `backend` folder with the following:

**Backend (`/backend/.env`)**
```
PORT=8000
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the Application
#### Frontend
```bash
cd frontend
npm run dev
```

#### Backend
```bash
cd ../backend
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Abuse Prevention Strategies
The system includes several layers of protection to prevent abuse and ensure fair usage:

### 1. **Cooldown Timer (Backend-Controlled) ⏳**
- A **2-minute cooldown** period is implemented to prevent users from rapidly claiming multiple coupons.
- Each user's IP address and session ID are tracked. Any attempts to claim a coupon within the cooldown period are blocked.
- Users are informed about the remaining cooldown time if they attempt to claim a coupon too soon.

### 2. **Session ID for Enhanced Security**
- Each user is assigned a **unique session ID** stored in an **HTTP-only cookie** for added security.
- Even if a user deletes their `localStorage` data, the cooldown timer persists because of backend-based session tracking.

### 3. **Hybrid Countdown Timer (Best UX Solution) 🕒**
To balance performance and persistence:
- The **frontend** displays a real-time countdown timer using `localStorage`.
- The **backend** periodically validates the timer every minute or when the page is refreshed to ensure accuracy.

---

## API Endpoints
### **Claim Coupon**
`POST /api/coupons/claim`
- Claims the next available coupon if no active cooldown is present.

### **Add Coupon**
`POST /api/coupons/add`
- Adds a new coupon to the database.(I had used Postman for adding data to the MongoDB Database)

---


