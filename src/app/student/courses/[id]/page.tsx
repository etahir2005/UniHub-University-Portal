'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, formatFileSize } from '@/lib/utils';
import { getDataForUser } from '@/lib/sampleData';
import styles from './courseDetail.module.css';

export default function StudentCourseDetailPage() {
    const params = useParams();
    const courseId = params.id as string;

    const [course, setCourse] = useState<any | null>(null);
    const [lectures, setLectures] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'lectures' | 'assignments' | 'announcements' | 'attendance'>('lectures');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);

            if (data) {
                const foundCourse = data.courses.find((c: any) => c._id === courseId);
                if (foundCourse) {
                    setCourse(foundCourse);

                    // Lectures (Resources)
                    const courseResources = data.resources.filter((r: any) => r.courseCode === foundCourse.courseCode);
                    setLectures(courseResources);

                    // Assignments
                    const courseAssignments = data.assignments.filter((a: any) => a.courseId === courseId);
                    setAssignments(courseAssignments);

                    // Announcements (Mock data if missing)
                    setAnnouncements([
                        { _id: '1', title: 'Welcome to the course', content: 'Welcome everyone! Please check the syllabus.', createdAt: new Date().toISOString() }
                    ]);

                    // Attendance (Mock data)
                    setAttendance([
                        { date: new Date().toISOString(), status: 'present' },
                        { date: new Date(Date.now() - 86400000).toISOString(), status: 'present' },
                    ]);
                }
            }
        }
        setLoading(false);
    }, [courseId]);

    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
    };

    const calculateAttendancePercentage = () => {
        if (attendance.length === 0) return 0;
        const presentCount = attendance.filter(a => a.status === 'present').length;
        return Math.round((presentCount / attendance.length) * 100);
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className={styles.loading}>Loading course details...</div>
            </DashboardLayout>
        );
    }

    if (!course) {
        return (
            <DashboardLayout role="student">
                <div className={styles.error}>Course not found</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                {/* Course Header */}
                <div className={styles.header}>
                    <div>
                        <div className={styles.courseCode}>{course.courseCode}</div>
                        <h1 className={styles.title}>{course.courseName}</h1>
                        <p className={styles.instructor}>
                            👨‍🏫 {course.instructorName}
                        </p>
                        <p className={styles.schedule}>🕐 {course.schedule}</p>
                    </div>
                    <Badge status={'active'}>
                        Active
                    </Badge>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
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
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>✓</div>
                        <div className={styles.statValue}>{calculateAttendancePercentage()}%</div>
                        <div className={styles.statLabel}>Attendance</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📢</div>
                        <div className={styles.statValue}>{announcements.length}</div>
                        <div className={styles.statLabel}>Announcements</div>
                    </Card>
                </div>

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
                        className={`${styles.tab} ${activeTab === 'announcements' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('announcements')}
                    >
                        📢 Announcements
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'attendance' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        ✓ Attendance
                    </button>
                </div>

                {/* Tab Content */}
                <div className={styles.tabContent}>
                    {activeTab === 'lectures' && (
                        <div className={styles.lecturesList}>
                            {lectures.length === 0 ? (
                                <Card>
                                    <p className={styles.emptyState}>No lectures uploaded yet</p>
                                </Card>
                            ) : (
                                lectures.map((lecture) => (
                                    <Card key={lecture._id} className={styles.lectureCard}>
                                        <div className={styles.lectureHeader}>
                                            <div>
                                                <h3 className={styles.lectureTitle}>{lecture.title}</h3>
                                                <p className={styles.lectureDescription}>{lecture.description}</p>
                                                <p className={styles.lectureInfo}>
                                                    Uploaded by {lecture.uploadedBy} • {formatDate(lecture.uploadedAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={styles.lectureFooter}>
                                            <div className={styles.fileInfo}>
                                                <span className={styles.fileIcon}>📄</span>
                                                <span className={styles.fileName}>{lecture.fileName}</span>
                                                <span className={styles.fileSize}>({formatFileSize(lecture.fileSize)})</span>
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleDownload(lecture.fileUrl, lecture.fileName)}
                                            >
                                                Download
                                            </Button>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className={styles.assignmentsList}>
                            {assignments.length === 0 ? (
                                <Card>
                                    <p className={styles.emptyState}>No assignments yet</p>
                                </Card>
                            ) : (
                                assignments.map((assignment) => (
                                    <Card key={assignment._id} className={styles.assignmentCard}>
                                        <div className={styles.assignmentHeader}>
                                            <div>
                                                <h3 className={styles.assignmentTitle}>{assignment.title}</h3>
                                                <p className={styles.assignmentDescription}>{assignment.description}</p>
                                            </div>
                                            {assignment.submission ? (
                                                <Badge status={assignment.submission.status === 'graded' ? 'completed' : 'pending'}>
                                                    {assignment.submission.status}
                                                </Badge>
                                            ) : (
                                                <Badge status="pending">Not Submitted</Badge>
                                            )}
                                        </div>
                                        <div className={styles.assignmentInfo}>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Due Date:</span>
                                                <span className={styles.infoValue}>{formatDate(assignment.dueDate)}</span>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <span className={styles.infoLabel}>Points:</span>
                                                <span className={styles.infoValue}>
                                                    {assignment.submission?.grade !== undefined
                                                        ? `${assignment.submission.grade}/${assignment.totalPoints}`
                                                        : `${assignment.totalPoints} points`}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant={assignment.submission ? 'outline' : 'primary'}
                                            onClick={() => window.location.href = `/student/assignments/${assignment._id}`}
                                        >
                                            {assignment.submission ? 'View Details' : 'Submit Assignment'}
                                        </Button>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <div className={styles.announcementsList}>
                            {announcements.length === 0 ? (
                                <Card>
                                    <p className={styles.emptyState}>No announcements yet</p>
                                </Card>
                            ) : (
                                announcements.map((announcement) => (
                                    <Card key={announcement._id} className={styles.announcementCard}>
                                        <div className={styles.announcementHeader}>
                                            <h3 className={styles.announcementTitle}>{announcement.title}</h3>
                                            <span className={styles.announcementDate}>
                                                {formatDate(announcement.createdAt)}
                                            </span>
                                        </div>
                                        <p className={styles.announcementContent}>{announcement.content}</p>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div className={styles.attendanceSection}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Attendance Record</CardTitle>
                                    <CardSubtitle>
                                        {calculateAttendancePercentage()}% attendance ({attendance.filter(a => a.status === 'present').length}/{attendance.length} classes)
                                    </CardSubtitle>
                                </CardHeader>
                                {attendance.length === 0 ? (
                                    <p className={styles.emptyState}>No attendance records yet</p>
                                ) : (
                                    <div className={styles.attendanceList}>
                                        {attendance.map((record, index) => (
                                            <div key={index} className={styles.attendanceItem}>
                                                <span className={styles.attendanceDate}>{formatDate(record.date)}</span>
                                                <Badge status={record.status === 'present' ? 'active' : 'inactive'}>
                                                    {record.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
