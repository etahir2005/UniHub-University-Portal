# UniHub - University Student Portal and Resource Hub

UniHub is a complete, production-ready university management system designed to support students and teachers through a single, unified digital platform. The system provides role-based access, course and assignment management, a resource hub, grading, attendance, and notifications.

---

## Project Overview

The UniHub University Portal aims to streamline academic workflows commonly found in higher education institutions. It centralizes essential academic operations such as course management, assignment submission and grading, attendance tracking, and resource sharing into one integrated web-based application.

---

## Key Features

### Student Features

* View enrolled courses and track progress
* Submit assignments with file uploads
* View grades and attendance records
* Access shared academic resources such as notes and past papers
* Receive system notifications
* Download lecture materials

### Teacher Features

* Create and manage courses
* Upload lecture materials
* Create and manage assignments with due dates
* View and grade student submissions with feedback
* Mark student attendance
* Post announcements for enrolled students

### System Features

* Role-based authentication and authorization
* Secure login using JWT
* Responsive user interface
* File upload and download functionality
* Notification system
* Modular and scalable architecture

---

## Technology Stack

* Frontend: Next.js 14 (App Router), TypeScript, CSS Modules
* Backend: Next.js API Routes
* Database: MongoDB with Mongoose
* Authentication: JSON Web Tokens (JWT) with bcrypt
* File Storage: Local filesystem (extendable to cloud storage)

---

## Installation and Setup

### Prerequisites

* Node.js version 18 or higher
* MongoDB (local installation or MongoDB Atlas)

---

## Quick Start (Demo Mode)

This mode allows you to run the application without setting up a database.

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Access the application at:

```
http://localhost:3000
```

### Demo Credentials

* Teacher: [sarah.malik@university.edu](mailto:sarah.malik@university.edu) / teacher123
* Student: [student01@university.edu](mailto:student01@university.edu) / student123

Note: Demo mode stores data in the browser's local storage and resets when the cache is cleared.

---

## Full Installation (With Database)

### Environment Configuration

Create a file named `.env.local` in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/unihub
JWT_SECRET=replace-with-a-secure-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads
```

For MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unihub?retryWrites=true&w=majority
```

---

### Create Upload Directories

```bash
mkdir -p public/uploads/lectures
mkdir -p public/uploads/assignments
mkdir -p public/uploads/submissions
mkdir -p public/uploads/resources
```

---

### Run the Application

```bash
npm run dev
```

---

## User Workflows

### Student Workflow

1. Log in as a student
2. View dashboard announcements
3. Access enrolled courses
4. Submit assignments before deadlines
5. View grades and attendance
6. Download learning resources

### Teacher Workflow

1. Log in as a teacher
2. Create and manage courses
3. Upload lectures and assignments
4. Review and grade submissions
5. Mark attendance
6. Post announcements

---

## Project Structure

```
exo-perseverance/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── login/
│   │   ├── student/
│   │   └── teacher/
│   ├── components/
│   ├── lib/
│   ├── models/
│   └── styles/
├── public/
│   └── uploads/
└── package.json
```

---

## Deployment

### Deployment on Vercel

1. Push the project to GitHub
2. Import the repository into Vercel
3. Configure environment variables
4. Deploy the application

---

## Security Considerations

* Use a strong JWT secret in production
* Secure database access with authentication and IP whitelisting
* Validate file uploads
* Enable HTTPS in production

---

## API Overview

* POST /api/auth/register
* POST /api/auth/login
* GET /api/courses
* POST /api/assignments
* POST /api/assignments/:id/submit
* POST /api/assignments/:id/grade
* GET /api/resources
* GET /api/notifications

---

## Contribution and Extension

The system can be extended with additional features such as email notifications, calendar integration, discussion forums, analytics dashboards, and mobile application support.

---

## Support

For questions or issues, please use the GitHub issues section of this repository.
