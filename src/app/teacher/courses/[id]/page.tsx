'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input, { TextArea, Select } from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import { formatDate, formatFileSize } from '@/lib/utils';
import { getDataForUser } from '@/lib/sampleData';
import styles from './courseDetail.module.css';

export default function TeacherCourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any | null>(null);
    const [lectures, setLectures] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'lectures' | 'assignments' | 'students' | 'attendance' | 'announcements'>('lectures');

    // Lecture upload state
    const [showLectureForm, setShowLectureForm] = useState(false);
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureDescription, setLectureDescription] = useState('');
    const [lectureFile, setLectureFile] = useState<File | null>(null);
    const [uploadingLecture, setUploadingLecture] = useState(false);

    // Assignment creation state
    const [showAssignmentForm, setShowAssignmentForm] = useState(false);
    const [assignmentTitle, setAssignmentTitle] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [assignmentDueDate, setAssignmentDueDate] = useState('');
    const [assignmentPoints, setAssignmentPoints] = useState('100');
    const [creatingAssignment, setCreatingAssignment] = useState(false);

    // Announcement state
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    const [postingAnnouncement, setPostingAnnouncement] = useState(false);

    // Attendance state
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: 'present' | 'absent' }>({});
    const [savingAttendance, setSavingAttendance] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);

            if (data) {
                const foundCourse = data.courses.find((c: any) => c._id === courseId);
                if (foundCourse) {
                    setCourse(foundCourse);

                    // Filter data for this specific course
                    // Note: In a real app, these would be separate API calls. 
                    // Here we filter the global lists from sampleData.

                    // Lectures (Resources in sampleData)
                    const courseResources = data.resources.filter((r: any) => r.courseCode === foundCourse.courseCode);
                    setLectures(courseResources);

                    // Assignments
                    const courseAssignments = data.assignments.filter((a: any) => a.courseId === courseId);
                    setAssignments(courseAssignments);

                    // Students
                    // We need to find students enrolled in this course.
                    // In sampleData, course.enrolledStudents is an array of IDs.
                    // We need the full student objects.
                    // getDataForUser returns 'students' which is ALL students.
                    const enrolledStudents = data.students.filter((s: any) => foundCourse.enrolledStudents.includes(s._id));
                    setStudents(enrolledStudents);

                    // Initialize attendance
                    const initialRecords: { [key: string]: 'present' | 'absent' } = {};
                    enrolledStudents.forEach((student: any) => {
                        initialRecords[student._id] = 'present';
                    });
                    setAttendanceRecords(initialRecords);
                }
            }
        }
        setLoading(false);
    }, [courseId]);

    const handleUploadLecture = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!lectureFile || !lectureTitle) {
            setError('Please provide title and file');
            return;
        }

        setUploadingLecture(true);
        setError('');
        setSuccess('');

        // Mock upload
        setTimeout(() => {
            const newLecture = {
                _id: Date.now().toString(),
                title: lectureTitle,
                description: lectureDescription,
                fileName: lectureFile.name,
                fileUrl: '/uploads/sample.pdf', // Mock URL
                fileSize: lectureFile.size,
                uploadedBy: 'Dr. Smith', // Should be current user
                uploadedAt: new Date().toISOString(),
                courseCode: course?.courseCode
            };

            setLectures([newLecture, ...lectures]);
            setSuccess('Lecture uploaded successfully (Demo)!');
            setLectureTitle('');
            setLectureDescription('');
            setLectureFile(null);
            setShowLectureForm(false);
            setUploadingLecture(false);
        }, 1000);
    };

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!assignmentTitle || !assignmentDueDate) {
            setError('Please provide title and due date');
            return;
        }

        setCreatingAssignment(true);
        setError('');
        setSuccess('');

        // Mock creation
        setTimeout(() => {
            const newAssignment = {
                _id: Date.now().toString(),
                title: assignmentTitle,
                description: assignmentDescription,
                dueDate: assignmentDueDate,
                totalPoints: parseInt(assignmentPoints),
                courseId: courseId,
                courseCode: course?.courseCode,
                courseName: course?.courseName
            };

            setAssignments([newAssignment, ...assignments]);
            setSuccess('Assignment created successfully (Demo)!');
            setAssignmentTitle('');
            setAssignmentDescription('');
            setAssignmentDueDate('');
            setAssignmentPoints('100');
            setShowAssignmentForm(false);
            setCreatingAssignment(false);
        }, 1000);
    };

    const handlePostAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcementTitle || !announcementContent) {
            setError('Please provide title and content');
            return;
        }

        setPostingAnnouncement(true);
        setError('');
        setSuccess('');

        // Mock post
        setTimeout(() => {
            setSuccess('Announcement posted successfully (Demo)!');
            setAnnouncementTitle('');
            setAnnouncementContent('');
            setShowAnnouncementForm(false);
            setPostingAnnouncement(false);
        }, 1000);
    };

    const handleSaveAttendance = async () => {
        setSavingAttendance(true);
        setError('');
        setSuccess('');

        // Mock save
        setTimeout(() => {
            setSuccess('Attendance saved successfully (Demo)!');
            setSavingAttendance(false);
        }, 1000);
    };

    const toggleAttendance = (studentId: string) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
        }));
    };

    const markAllPresent = () => {
        const newRecords: { [key: string]: 'present' | 'absent' } = {};
        students.forEach(student => {
            newRecords[student._id] = 'present';
        });
        setAttendanceRecords(newRecords);
    };

    const markAllAbsent = () => {
        const newRecords: { [key: string]: 'present' | 'absent' } = {};
        students.forEach(student => {
            newRecords[student._id] = 'absent';
        });
        setAttendanceRecords(newRecords);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading course details...</div>
            </DashboardLayout>
        );
    }

    if (!course) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.error}>Course not found</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                {/* Course Header */}
                <div className={styles.header}>
                    <div>
                        <div className={styles.courseCode}>{course.courseCode}</div>
                        <h1 className={styles.title}>{course.courseName}</h1>
                        <p className={styles.schedule}>🕐 {course.schedule}</p>
                    </div>
                    <Badge status={'active'}>
                        Active
                    </Badge>
                </div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>👥</div>
                        <div className={styles.statValue}>{students.length}</div>
                        <div className={styles.statLabel}>Students</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📚</div>
                        <div className={styles.statValue}>{lectures.length}</div>
                        <div className={styles.statLabel}>Lectures</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📝</div>
                        <div className={styles.statValue}>{assignments.length}</div>
                        <div className={styles.statLabel}>Assignments</div>
                    </Card>
                </div>

                {/* Messages */}
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'lectures' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('lectures')}
                    >
                        📚 Lectures
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'assignments' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        📝 Assignments
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'students' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        👥 Students
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'attendance' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        ✓ Attendance
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'announcements' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        📢 Announcements
                    </button>
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {activeTab === 'lectures' && (
                        <div>
                            <div className={styles.tabHeader}>
                                <h2>Lecture Materials</h2>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowLectureForm(!showLectureForm)}
                                >
                                    {showLectureForm ? 'Cancel' : '+ Upload Lecture'}
                                </Button>
                            </div>

                            {showLectureForm && (
                                <Card className={styles.formCard}>
                                    <form onSubmit={handleUploadLecture}>
                                        <Input
                                            label="Lecture Title"
                                            value={lectureTitle}
                                            onChange={(e) => setLectureTitle(e.target.value)}
                                            required
                                        />
                                        <TextArea
                                            label="Description"
                                            value={lectureDescription}
                                            onChange={(e) => setLectureDescription(e.target.value)}
                                            rows={3}
                                        />
                                        <FileUpload
                                            onFilesSelected={(files) => setLectureFile(files[0])}
                                            maxFiles={1}
                                            maxSizeMB={50}
                                            acceptedTypes={['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.zip']}
                                            multiple={false}
                                        />
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={uploadingLecture || !lectureFile}
                                        >
                                            {uploadingLecture ? 'Uploading...' : 'Upload Lecture'}
                                        </Button>
                                    </form>
                                </Card>
                            )}

                            <div className={styles.lecturesList}>
                                {lectures.length === 0 ? (
                                    <Card><p className={styles.emptyState}>No lectures uploaded yet</p></Card>
                                ) : (
                                    lectures.map((lecture) => (
                                        <Card key={lecture._id} className={styles.lectureCard}>
                                            <h3>{lecture.title}</h3>
                                            <p>{lecture.description}</p>
                                            <div className={styles.lectureInfo}>
                                                <span>📄 {lecture.fileName}</span>
                                                <span>{formatFileSize(lecture.fileSize)}</span>
                                                <span>{formatDate(lecture.uploadedAt || lecture.createdAt)}</span>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div>
                            <div className={styles.tabHeader}>
                                <h2>Assignments</h2>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowAssignmentForm(!showAssignmentForm)}
                                >
                                    {showAssignmentForm ? 'Cancel' : '+ Create Assignment'}
                                </Button>
                            </div>

                            {showAssignmentForm && (
                                <Card className={styles.formCard}>
                                    <form onSubmit={handleCreateAssignment}>
                                        <Input
                                            label="Assignment Title"
                                            value={assignmentTitle}
                                            onChange={(e) => setAssignmentTitle(e.target.value)}
                                            required
                                        />
                                        <TextArea
                                            label="Description"
                                            value={assignmentDescription}
                                            onChange={(e) => setAssignmentDescription(e.target.value)}
                                            rows={4}
                                        />
                                        <Input
                                            type="date"
                                            label="Due Date"
                                            value={assignmentDueDate}
                                            onChange={(e) => setAssignmentDueDate(e.target.value)}
                                            required
                                        />
                                        <Input
                                            type="number"
                                            label="Total Points"
                                            value={assignmentPoints}
                                            onChange={(e) => setAssignmentPoints(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={creatingAssignment}
                                        >
                                            {creatingAssignment ? 'Creating...' : 'Create Assignment'}
                                        </Button>
                                    </form>
                                </Card>
                            )}

                            <div className={styles.assignmentsList}>
                                {assignments.length === 0 ? (
                                    <Card><p className={styles.emptyState}>No assignments yet</p></Card>
                                ) : (
                                    assignments.map((assignment) => (
                                        <Card key={assignment._id} className={styles.assignmentCard}>
                                            <h3>{assignment.title}</h3>
                                            <p>{assignment.description}</p>
                                            <div className={styles.assignmentInfo}>
                                                <span>Due: {formatDate(assignment.dueDate)}</span>
                                                <span>{assignment.totalPoints} points</span>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/teacher/assignments/${assignment._id}`}
                                            >
                                                View Submissions
                                            </Button>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div>
                            <h2 className={styles.tabHeader}>Enrolled Students ({students.length})</h2>
                            <div className={styles.studentsList}>
                                {students.length === 0 ? (
                                    <Card><p className={styles.emptyState}>No students enrolled yet</p></Card>
                                ) : (
                                    students.map((student) => (
                                        <Card key={student._id} className={styles.studentCard}>
                                            <div className={styles.studentInfo}>
                                                <div className={styles.studentAvatar}>
                                                    {student.firstName[0]}{student.lastName[0]}
                                                </div>
                                                <div>
                                                    <h3>{student.firstName} {student.lastName}</h3>
                                                    <p>{student.email}</p>
                                                    <p className={styles.studentId}>ID: {student.studentId}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div>
                            <h2 className={styles.tabHeader}>Mark Attendance</h2>
                            <Card className={styles.attendanceCard}>
                                <Input
                                    type="date"
                                    label="Date"
                                    value={attendanceDate}
                                    onChange={(e) => setAttendanceDate(e.target.value)}
                                />
                                <div className={styles.attendanceActions}>
                                    <Button variant="outline" size="sm" onClick={markAllPresent}>
                                        Mark All Present
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={markAllAbsent}>
                                        Mark All Absent
                                    </Button>
                                </div>
                                <div className={styles.attendanceList}>
                                    {students.map((student) => (
                                        <div key={student._id} className={styles.attendanceItem}>
                                            <span>{student.firstName} {student.lastName}</span>
                                            <div className={styles.attendanceToggle}>
                                                <button
                                                    className={`${styles.attendanceBtn} ${attendanceRecords[student._id] === 'present' ? styles.present : ''}`}
                                                    onClick={() => toggleAttendance(student._id)}
                                                >
                                                    {attendanceRecords[student._id] === 'present' ? '✓ Present' : '✕ Absent'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="primary"
                                    onClick={handleSaveAttendance}
                                    disabled={savingAttendance}
                                >
                                    {savingAttendance ? 'Saving...' : 'Save Attendance'}
                                </Button>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <div>
                            <div className={styles.tabHeader}>
                                <h2>Announcements</h2>
                                <Button
                                    variant="primary"
                                    onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                                >
                                    {showAnnouncementForm ? 'Cancel' : '+ Post Announcement'}
                                </Button>
                            </div>

                            {showAnnouncementForm && (
                                <Card className={styles.formCard}>
                                    <form onSubmit={handlePostAnnouncement}>
                                        <Input
                                            label="Title"
                                            value={announcementTitle}
                                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                                            required
                                        />
                                        <TextArea
                                            label="Content"
                                            value={announcementContent}
                                            onChange={(e) => setAnnouncementContent(e.target.value)}
                                            rows={5}
                                            required
                                        />
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={postingAnnouncement}
                                        >
                                            {postingAnnouncement ? 'Posting...' : 'Post Announcement'}
                                        </Button>
                                    </form>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
