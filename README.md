# UniHub - University Student Portal & Resource Hub

A complete, production-ready university student portal with role-based authentication, course management, assignment workflows, resource hub, and notifications system.

## 🚀 Features

### For Students
- ✅ View enrolled courses with progress tracking
- ✅ Submit assignments with file uploads
- ✅ View grades and attendance records
- ✅ Access resource hub (past papers, notes, tutorials)
- ✅ Receive in-app notifications
- ✅ Download lecture materials

### For Teachers
- ✅ Create and manage courses
- ✅ Upload lecture materials
- ✅ Create assignments with due dates
- ✅ Grade student submissions with feedback
- ✅ Mark attendance
- ✅ Post announcements
- ✅ View all student submissions

### Technical Features
- 🔐 JWT-based authentication
- 🎨 Responsive design matching prototype
- 📁 File upload/download system
- 🔔 Real-time notifications
- 📊 Progress tracking
- 🎯 Role-based access control

## 📋 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **File Storage**: Local filesystem (upgradeable to cloud)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed

## 🚀 Quick Start (Demo Mode)
If you just want to run the project to see the UI and features without setting up a database:

1. **Unzip the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Login with demo accounts**:
   - **Teacher**: `sarah.malik@university.edu` / `teacher123`
   - **Student**: `student01@university.edu` / `student123`

*Note: In this mode, data is saved to your browser's local storage. If you clear your cache or use a different browser, data will reset.*

## 🛠️ Full Installation (With Database)
For a complete production setup with MongoDB:

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally OR MongoDB Atlas account

### Step 1: Clone and Install

```bash
cd exo-perseverance
npm install
```

### Step 2: Environment Setup

Create `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/unihub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./public/uploads
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unihub?retryWrites=true&w=majority
```

### Step 3: Create Upload Directories

```bash
mkdir -p public/uploads/lectures
mkdir -p public/uploads/assignments
mkdir -p public/uploads/submissions
mkdir -p public/uploads/resources
```

### Step 4: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` - you'll be redirected to the login page.

## 👥 Creating Test Users

Since there's no registration page UI yet, you can create users via API:

### Create a Student Account

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@university.edu",
    "password": "password123",
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "studentId": "STU001"
  }'
```

### Create a Teacher Account

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@university.edu",
    "password": "password123",
    "role": "teacher",
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "employeeId": "EMP001"
  }'
```

## 🎯 Usage Guide

### Login
1. Go to `/login`
2. Enter email and password
3. Select role (Student or Teacher)
4. Click "Login as Student/Teacher"

### Student Workflow
1. **Dashboard** - View announcements and quick links
2. **Courses** - See enrolled courses with progress
3. **Assignments** - View pending/completed assignments
4. **Submit Assignment** - Upload files before due date
5. **Grades** - Check graded assignments
6. **Resources** - Search and download study materials

### Teacher Workflow
1. **Dashboard** - Overview of courses
2. **Create Course** - Add new course with code, name, schedule
3. **Upload Lecture** - Add materials for students
4. **Create Assignment** - Set title, description, due date, points
5. **View Submissions** - See all student submissions
6. **Grade Assignment** - Provide score and feedback
7. **Mark Attendance** - Record student attendance
8. **Post Announcement** - Notify all enrolled students

## 📁 Project Structure

```
exo-perseverance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── courses/       # Course management
│   │   │   ├── assignments/   # Assignment CRUD
│   │   │   ├── resources/     # Resource hub
│   │   │   ├── grades/        # Grades
│   │   │   ├── attendance/    # Attendance
│   │   │   ├── announcements/ # Announcements
│   │   │   ├── notifications/ # Notifications
│   │   │   └── uploads/       # File uploads
│   │   ├── login/             # Login page
│   │   ├── student/           # Student pages
│   │   └── teacher/           # Teacher pages
│   ├── components/
│   │   ├── ui/                # Reusable components
│   │   └── layout/            # Layout components
│   ├── lib/                   # Utilities
│   ├── models/                # Mongoose models
│   └── styles/                # Global styles
├── public/
│   └── uploads/               # File storage
└── package.json
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Set Environment Variables in Vercel**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Random secret key
   - `NEXT_PUBLIC_API_URL` - Your Vercel deployment URL

### Deploy to Other Platforms

**Build for production:**
```bash
npm run build
npm start
```

The app runs on port 3000 by default.

## 🔒 Security Notes

- Change `JWT_SECRET` to a strong random string in production
- Use MongoDB Atlas with IP whitelisting
- Enable HTTPS in production
- Validate file uploads (size, type)
- Implement rate limiting for API routes
- Add CORS configuration if needed

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List courses (role-filtered)
- `POST /api/courses` - Create course (teacher only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (teacher only)
- `DELETE /api/courses/:id` - Delete course (teacher only)

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment (teacher only)
- `POST /api/assignments/:id/submit` - Submit assignment (student only)
- `GET /api/assignments/:id/submissions` - View submissions (teacher only)
- `POST /api/assignments/:id/grade` - Grade submission (teacher only)

### Resources
- `GET /api/resources` - List resources (with search/filter)
- `POST /api/resources` - Upload resource

### Grades & Attendance
- `GET /api/grades` - Get grades
- `GET /api/attendance` - Get attendance
- `POST /api/attendance` - Mark attendance (teacher only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications` - Mark as read

### File Upload
- `POST /api/uploads` - Upload file

## 🎨 Design System

The application uses a custom design system matching the prototype:

- **Primary Color**: Deep Orange (#E8551E)
- **Background**: Cream (#FFF8E7)
- **Accent**: Soft Peach (#FFE5D9)
- **Fonts**: Poppins (headings), Inter (body)

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- For Atlas, whitelist your IP address

### File Upload Issues
- Check upload directories exist
- Verify file size limits
- Check file permissions

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📄 License

MIT License - feel free to use this project for your university or educational institution.

## 🤝 Contributing

This is a complete production-ready application. Feel free to extend it with:
- Email notifications
- Calendar integration
- Video lectures
- Discussion forums
- Mobile app
- Analytics dashboard

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for universities worldwide**
