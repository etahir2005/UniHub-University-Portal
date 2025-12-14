// Types
export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: 'teacher' | 'student';
    department?: string;
    avatar?: string;
    officeHours?: string;
    phone?: string;
    bio?: string;
    joinDate?: string;
    studentId?: string;
    major?: string;
    semester?: string;
    year?: string;
    gpa?: string | number;
    credits?: { completed: number; total: number };
    attendance?: number;
    enrolledCourses?: string[];
}

export interface Course {
    _id: string;
    courseCode: string;
    courseName: string;
    description: string;
    instructorId: string;
    instructorName: string;
    schedule: string;
    room: string;
    color: string;
    enrolledStudents: string[];
}

export interface Assignment {
    _id: string;
    courseId: string;
    title: string;
    dueDate: string;
    totalPoints: number;
    courseName?: string;
    courseCode?: string;
    description?: string;
    status?: string;
    files?: string[];
    grade?: string | null;
    score?: number | null;
    feedback?: string | null;
}

export interface Submission {
    _id: string;
    assignmentId: string;
    studentId: string;
    courseId: string;
    status: string;
    submittedAt: string;
    score: number;
    grade: string;
    feedback: string;
    files: string[];
}

export interface Announcement {
    _id: string;
    courseId: string;
    title: string;
    content: string;
    date: string;
    courseName?: string;
    author?: string;
    createdAt?: string;
}

export interface Resource {
    _id: string;
    courseId: string;
    title: string;
    type: string;
    size: string;
    courseCode?: string;
    description?: string;
    category?: string;
    fileName?: string;
    fileSize?: string;
    uploadDate?: string;
}

export interface Lecture {
    _id: string;
    courseId: string;
    title: string;
    week: number;
    description?: string;
    videoUrl?: string;
    duration?: string;
    date?: string;
}

export interface AttendanceRecord {
    week: number;
    status: string;
    date: string;
}

export interface StudentAttendance {
    studentId: string;
    attended: number;
    percentage: number;
    history: AttendanceRecord[];
}

export interface CourseAttendance {
    courseName: string;
    code: string;
    totalClasses: number;
    records: StudentAttendance[];
}

// Initial Data (Seeding)
const initialUsers: User[] = [
    // Teachers
    {
        _id: 'teacher1',
        firstName: 'Sarah',
        lastName: 'Malik',
        email: 'sarah.malik@university.edu',
        password: 'teacher123',
        role: 'teacher',
        department: 'Computer Science',
        officeHours: 'Mon, Wed 10:00 AM - 12:00 PM',
        phone: '+1 (555) 001-1001',
        bio: 'Expert in Programming Fundamentals and Intro to Computing.',
        joinDate: '2015-08-15'
    },
    {
        _id: 'teacher2',
        firstName: 'Ali',
        lastName: 'Raza',
        email: 'ali.raza@university.edu',
        password: 'teacher123',
        role: 'teacher',
        department: 'Software Engineering',
        officeHours: 'Tue, Thu 2:00 PM - 4:00 PM',
        phone: '+1 (555) 001-1002',
        bio: 'Specialist in Web Engineering and Modern Frameworks.',
        joinDate: '2017-01-10'
    },
    {
        _id: 'teacher3',
        firstName: 'Maria',
        lastName: 'Khan',
        email: 'maria.khan@university.edu',
        password: 'teacher123',
        role: 'teacher',
        department: 'Computer Science',
        officeHours: 'Fri 9:00 AM - 11:00 AM',
        phone: '+1 (555) 001-1003',
        bio: 'Professor of Operating Systems and System Architecture.',
        joinDate: '2019-09-01'
    },
    // Students (8 Students)
    ...Array.from({ length: 8 }, (_, i) => ({
        _id: `student${i + 1}`,
        firstName: 'Student',
        lastName: `${i + 1}`,
        email: `student0${i + 1}@university.edu`,
        password: 'student123',
        role: 'student' as const,
        studentId: `STU-2024-00${i + 1}`,
        major: i < 4 ? 'Computer Science' : 'Software Engineering',
        semester: 'Fall 2024',
        year: i < 4 ? '1st Year' : '2nd Year',
        gpa: (3.0 + Math.random()).toFixed(2),
        credits: { completed: 15 + i * 10, total: 120 },
        attendance: 85 + Math.floor(Math.random() * 15),
        enrolledCourses: [] // Will be populated by logic
    }))
];

const initialCourses: Course[] = [
    {
        _id: 'c1',
        courseCode: 'PF101',
        courseName: 'Programming Fundamentals',
        description: 'Introduction to logic building and C++ programming.',
        instructorId: 'teacher1',
        instructorName: 'Dr. Sarah Malik',
        schedule: 'Mon 09:00 AM - 11:00 AM',
        room: 'Room 101',
        color: '#4F46E5',
        enrolledStudents: ['student1', 'student2', 'student3', 'student4', 'student5', 'student6', 'student7', 'student8']
    },
    {
        _id: 'c2',
        courseCode: 'CS101',
        courseName: 'Intro to Computing',
        description: 'Basics of computer hardware, software, and history.',
        instructorId: 'teacher1',
        instructorName: 'Dr. Sarah Malik',
        schedule: 'Wed 11:00 AM - 01:00 PM',
        room: 'Room 102',
        color: '#E8551E',
        enrolledStudents: ['student1', 'student2', 'student3', 'student4']
    },
    {
        _id: 'c3',
        courseCode: 'CS202',
        courseName: 'Web Engineering',
        description: 'Full stack web development with MERN stack.',
        instructorId: 'teacher2',
        instructorName: 'Dr. Ali Raza',
        schedule: 'Tue 01:00 PM - 03:00 PM',
        room: 'Lab 201',
        color: '#10B981',
        enrolledStudents: ['student3', 'student4', 'student5', 'student6', 'student7', 'student8']
    },
    {
        _id: 'c4',
        courseCode: 'CS303',
        courseName: 'Operating Systems',
        description: 'Process management, memory management, and concurrency.',
        instructorId: 'teacher3',
        instructorName: 'Dr. Maria Khan',
        schedule: 'Thu 09:00 AM - 11:00 AM',
        room: 'Room 303',
        color: '#F59E0B',
        enrolledStudents: ['student1', 'student2', 'student5', 'student6', 'student7', 'student8']
    }
];

const getCourse = (id: string) => initialCourses.find(c => c._id === id);

const initialAssignments: Assignment[] = [
    // PF101 Assignments
    { _id: 'a1', courseId: 'c1', title: 'Lab 1: Variables', dueDate: '2024-10-10', totalPoints: 10 },
    { _id: 'a2', courseId: 'c1', title: 'Assignment 1: Loops', dueDate: '2024-10-25', totalPoints: 50 },
    { _id: 'a3', courseId: 'c1', title: 'Project: Calculator', dueDate: '2024-12-15', totalPoints: 100 },
    // CS101 Assignments
    { _id: 'a4', courseId: 'c2', title: 'Essay: History of Computers', dueDate: '2024-10-05', totalPoints: 20 },
    { _id: 'a5', courseId: 'c2', title: 'Presentation: Future Tech', dueDate: '2024-11-20', totalPoints: 30 },
    // CS202 Assignments
    { _id: 'a6', courseId: 'c3', title: 'Frontend UI Design', dueDate: '2024-10-15', totalPoints: 50 },
    { _id: 'a7', courseId: 'c3', title: 'Backend API Integration', dueDate: '2024-11-10', totalPoints: 50 },
    { _id: 'a8', courseId: 'c3', title: 'Final Project', dueDate: '2024-12-20', totalPoints: 100 },
    // CS303 Assignments
    { _id: 'a9', courseId: 'c4', title: 'Process Scheduling Algo', dueDate: '2024-10-30', totalPoints: 50 },
    { _id: 'a10', courseId: 'c4', title: 'Memory Management Report', dueDate: '2024-11-25', totalPoints: 50 }
].map(a => ({
    ...a,
    courseName: getCourse(a.courseId)?.courseName,
    courseCode: getCourse(a.courseId)?.courseCode,
    description: `Complete the ${a.title} task. Ensure all requirements are met.`,
    status: 'Pending',
    files: []
}));

const initialSubmissions: Submission[] = [];
initialCourses.forEach(course => {
    const courseAssignments = initialAssignments.filter(a => a.courseId === course._id);
    course.enrolledStudents.forEach(studentId => {
        courseAssignments.forEach(assignment => {
            const isSubmitted = Math.random() > 0.2;
            if (isSubmitted) {
                const minScore = Math.floor(assignment.totalPoints * 0.5);
                const maxScore = assignment.totalPoints;
                const score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
                const percentage = (score / assignment.totalPoints) * 100;
                let grade = 'F';
                if (percentage >= 90) grade = 'A';
                else if (percentage >= 80) grade = 'B';
                else if (percentage >= 70) grade = 'C';
                else if (percentage >= 60) grade = 'D';

                initialSubmissions.push({
                    _id: `sub_${assignment._id}_${studentId}`,
                    assignmentId: assignment._id,
                    studentId: studentId,
                    courseId: course._id,
                    status: 'Graded',
                    submittedAt: '2024-10-12',
                    score: score,
                    grade: grade,
                    feedback: 'Good effort!',
                    files: ['/submission.pdf']
                });
            }
        });
    });
});

const initialAnnouncements: Announcement[] = [
    { _id: 'ann1', courseId: 'c1', title: 'Welcome to PF101', content: 'Welcome class! Please review the syllabus.', date: '2024-09-01' },
    { _id: 'ann2', courseId: 'c1', title: 'Lab 1 Cancelled', content: 'Lab 1 is rescheduled to next week.', date: '2024-09-10' },
    { _id: 'ann3', courseId: 'c2', title: 'Guest Speaker', content: 'We have a guest speaker on Friday.', date: '2024-10-05' },
    { _id: 'ann4', courseId: 'c3', title: 'React Workshop', content: 'Join us for a React workshop this Saturday.', date: '2024-10-20' },
    { _id: 'ann5', courseId: 'c4', title: 'Midterm Syllabus', content: 'Midterm will cover chapters 1-5.', date: '2024-10-15' }
].map(ann => ({
    ...ann,
    courseName: getCourse(ann.courseId)?.courseName,
    author: getCourse(ann.courseId)?.instructorName,
    createdAt: ann.date
}));

const initialResources: Resource[] = [
    { _id: 'r1', courseId: 'c1', title: 'C++ Basics PDF', type: 'PDF', size: '2MB' },
    { _id: 'r2', courseId: 'c1', title: 'Setup Guide', type: 'PDF', size: '1MB' },
    { _id: 'r3', courseId: 'c2', title: 'History of Computing', type: 'Slides', size: '5MB' },
    { _id: 'r4', courseId: 'c3', title: 'React Cheatsheet', type: 'Image', size: '500KB' },
    { _id: 'r5', courseId: 'c3', title: 'Node.js Setup', type: 'Video', size: '150MB' },
    { _id: 'r6', courseId: 'c4', title: 'Process States Diagram', type: 'Image', size: '1MB' }
].map(r => ({
    ...r,
    courseCode: getCourse(r.courseId)?.courseCode,
    description: `Resource for ${r.title}`,
    category: 'Lecture Material',
    fileName: `${r.title.replace(/\s/g, '_')}.${r.type.toLowerCase()}`,
    fileSize: r.size,
    uploadDate: '2024-09-15'
}));

const initialLectures: Lecture[] = [
    { _id: 'l1', courseId: 'c1', title: 'Lec 1: Intro to C++', week: 1 },
    { _id: 'l2', courseId: 'c1', title: 'Lec 2: Variables & Types', week: 2 },
    { _id: 'l3', courseId: 'c2', title: 'Lec 1: What is a Computer?', week: 1 },
    { _id: 'l4', courseId: 'c3', title: 'Lec 1: Intro to Web', week: 1 },
    { _id: 'l5', courseId: 'c3', title: 'Lec 2: HTML & CSS', week: 2 },
    { _id: 'l6', courseId: 'c4', title: 'Lec 1: OS Overview', week: 1 }
].map(l => ({
    ...l,
    description: `Recording of ${l.title}`,
    videoUrl: '#',
    duration: '1h 30m',
    date: '2024-09-01'
}));

const initialAttendance: Record<string, CourseAttendance> = {};
initialCourses.forEach(course => {
    initialAttendance[course._id] = {
        courseName: course.courseName,
        code: course.courseCode,
        totalClasses: 10,
        records: course.enrolledStudents.map(studentId => ({
            studentId,
            attended: 0,
            percentage: 0,
            history: Array.from({ length: 10 }, (_, i) => ({
                week: i + 1,
                status: Math.random() > 0.1 ? 'Present' : 'Absent',
                date: `2024-09-${10 + i}`
            }))
        }))
    };
    initialAttendance[course._id].records.forEach(r => {
        const presentCount = r.history.filter(h => h.status === 'Present').length;
        r.attended = presentCount;
        r.percentage = (presentCount / 10) * 100;
    });
});

// --- LocalStorage Logic ---

const STORAGE_KEYS = {
    USERS: 'unihub_users',
    COURSES: 'unihub_courses',
    ASSIGNMENTS: 'unihub_assignments',
    SUBMISSIONS: 'unihub_submissions',
    ANNOUNCEMENTS: 'unihub_announcements',
    RESOURCES: 'unihub_resources',
    LECTURES: 'unihub_lectures',
    ATTENDANCE: 'unihub_attendance'
};

export const initializeStorage = () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(initialCourses));
        localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(initialAssignments));
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
        localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(initialAnnouncements));
        localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(initialResources));
        localStorage.setItem(STORAGE_KEYS.LECTURES, JSON.stringify(initialLectures));
        localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialAttendance));
        console.log('Storage initialized with sample data');
    }
};

// Getters
export const getUsers = (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
export const getCourses = (): Course[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
export const getAssignments = (): Assignment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS) || '[]');
export const getSubmissions = (): Submission[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
export const getAnnouncements = (): Announcement[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
export const getResources = (): Resource[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.RESOURCES) || '[]');
export const getLectures = (): Lecture[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.LECTURES) || '[]');
export const getAttendance = (): Record<string, CourseAttendance> => JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '{}');

// Setters
export const saveUsers = (data: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
export const saveCourses = (data: Course[]) => localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(data));
export const saveAssignments = (data: Assignment[]) => localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(data));
export const saveSubmissions = (data: Submission[]) => localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(data));

// Auth
// Auth
// Auth
export const updateSubmissionGrade = (assignmentId: string, studentId: string, score: number, feedback: string) => {
    initializeStorage();
    const allSubmissions = getSubmissions();
    const existingIndex = allSubmissions.findIndex(s => s.assignmentId === assignmentId && (s.studentId === studentId || (s.studentId as any)._id === studentId));

    // Calculate letter grade
    const allAssignments = getAssignments();
    const assignment = allAssignments.find(a => a._id === assignmentId);
    let letterGrade = 'F';
    if (assignment) {
        const percentage = (score / assignment.totalPoints) * 100;
        if (percentage >= 90) letterGrade = 'A';
        else if (percentage >= 80) letterGrade = 'B';
        else if (percentage >= 70) letterGrade = 'C';
        else if (percentage >= 60) letterGrade = 'D';
    }

    if (existingIndex >= 0) {
        allSubmissions[existingIndex] = {
            ...allSubmissions[existingIndex],
            grade: letterGrade,
            feedback,
            status: 'Graded',
            score: score
        };
        saveSubmissions(allSubmissions);
        return true;
    } else {
        // Create new submission if not exists (mock)
        const newSubmission: Submission = {
            _id: `sub_${Date.now()}`,
            assignmentId,
            studentId,
            courseId: assignment?.courseId || '',
            status: 'Graded',
            submittedAt: new Date().toISOString(),
            score: score,
            grade: letterGrade,
            feedback,
            files: []
        };
        allSubmissions.push(newSubmission);
        saveSubmissions(allSubmissions);
        return true;
    }
};

export const authenticateUser = (email: string, password?: string) => {
    initializeStorage();
    const users = getUsers();
    const user = users.find(u => u.email === email && (!password || u.password === password));
    return user || null;
};

// Helper to validate and fix data integrity
const validateAndFixData = (data: any) => {
    if (!data || !data.submissions || !data.assignments) return data;

    // Fix invalid scores
    let hasChanges = false;
    const fixedSubmissions = data.submissions.map((sub: any) => {
        const assignment = data.assignments.find((a: any) => a._id === sub.assignmentId);
        if (assignment && sub.score > assignment.totalPoints) {
            console.warn(`Fixing invalid score for submission ${sub._id}: ${sub.score}/${assignment.totalPoints}`);
            hasChanges = true;
            return { ...sub, score: assignment.totalPoints };
        }
        return sub;
    });

    if (hasChanges) {
        return { ...data, submissions: fixedSubmissions };
    }
    return data;
};

export const getDataForUser = (user: User) => {
    initializeStorage();
    if (!user) return null;

    // Run validation on load
    let allData = {
        users: getUsers(),
        courses: getCourses(),
        assignments: getAssignments(),
        submissions: getSubmissions(),
        announcements: getAnnouncements(),
        resources: getResources(),
        lectures: getLectures(),
        attendance: getAttendance()
    };

    // Validate and fix if needed
    const validatedData = validateAndFixData(allData);
    if (validatedData !== allData) {
        saveSubmissions(validatedData.submissions);
        allData = validatedData;
    }

    const { courses: allCourses, assignments: allAssignments, submissions: allSubmissions, announcements: allAnnouncements, resources: allResources, lectures: allLectures, attendance: allAttendance, users: allUsers } = allData;

    let enrolledCourseIds: string[] = [];

    if (user.role === 'teacher') {
        enrolledCourseIds = allCourses.filter(c => c.instructorId === user._id).map(c => c._id);
    } else {
        // Check both course.enrolledStudents AND user.enrolledCourses (for robustness)
        const enrolledInCourse = allCourses.filter(c => c.enrolledStudents.includes(user._id)).map(c => c._id);
        const userEnrollments = user.enrolledCourses || [];
        enrolledCourseIds = [...new Set([...enrolledInCourse, ...userEnrollments])];
    }

    const myCourses = allCourses.filter(c => enrolledCourseIds.includes(c._id));

    const mySchedule = myCourses.map(course => {
        const parts = course.schedule.split(' ');
        const day = parts[0];
        const time = parts.slice(1).join(' ');
        const dayMap: Record<string, string> = {
            'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday'
        };
        return {
            day: dayMap[day] || day,
            course: course.courseName,
            code: course.courseCode,
            time: time,
            room: course.room,
            type: 'Lecture'
        };
    });

    if (user.role === 'teacher') {
        return {
            courses: myCourses,
            assignments: allAssignments.filter(a => enrolledCourseIds.includes(a.courseId)),
            announcements: allAnnouncements.filter(a => enrolledCourseIds.includes(a.courseId)),
            resources: allResources.filter(r => enrolledCourseIds.includes(r.courseId)),
            lectures: allLectures.filter(l => enrolledCourseIds.includes(l.courseId)),
            students: allUsers.filter(u => u.role === 'student' && myCourses.some(c => c.enrolledStudents.includes(u._id))),
            schedule: mySchedule,
            attendance: myCourses.map(c => {
                const { courseName, code, ...attendanceData } = allAttendance[c._id] || {};
                return {
                    courseName: c.courseName,
                    code: c.courseCode,
                    ...attendanceData
                };
            })
        };
    } else {
        const mySubmissions = allSubmissions.filter(s => s.studentId === user._id);
        const myAssignments = allAssignments.filter(a => enrolledCourseIds.includes(a.courseId)).map(a => {
            const sub = mySubmissions.find(s => s.assignmentId === a._id);
            return {
                ...a,
                status: sub ? sub.status : (new Date(a.dueDate) < new Date() ? 'Overdue' : 'Pending'),
                grade: sub ? sub.grade : null,
                score: sub ? sub.score : null,
                feedback: sub ? sub.feedback : null,
                submission: sub
            };
        });

        return {
            courses: myCourses,
            assignments: myAssignments,
            announcements: allAnnouncements.filter(a => enrolledCourseIds.includes(a.courseId)),
            resources: allResources.filter(r => enrolledCourseIds.includes(r.courseId)),
            lectures: allLectures.filter(l => enrolledCourseIds.includes(l.courseId)),
            grades: myAssignments.filter(a => a.grade),
            schedule: mySchedule,
            attendance: myCourses.map(c => {
                const record = allAttendance[c._id]?.records.find(r => r.studentId === user._id);
                return {
                    courseName: c.courseName,
                    code: c.courseCode,
                    ...(record || { attended: 0, percentage: 0, history: [] })
                };
            })
        };
    }
};

// Export initial data for reference if needed, but prefer getters
export { initialUsers as users, initialCourses as courses, initialAssignments as assignments, initialSubmissions as submissions };

export const getAllCourses = () => getCourses();
