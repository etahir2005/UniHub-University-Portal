'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getDataForUser } from '@/lib/sampleData';
import styles from './attendance.module.css';

export default function TeacherAttendancePage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: 'present' | 'absent' }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [allStudents, setAllStudents] = useState<any[]>([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);
            if (data) {
                setCourses(data.courses);
                setAllStudents(data.students || []);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            const course = courses.find(c => c._id === selectedCourseId);
            setSelectedCourse(course || null);

            if (course) {
                const courseStudents = allStudents.filter(s => course.enrolledStudents.includes(s._id));
                const initialRecords: { [key: string]: 'present' | 'absent' } = {};
                courseStudents.forEach(student => {
                    initialRecords[student._id] = 'present';
                });
                setAttendanceRecords(initialRecords);
            }
        }
    }, [selectedCourseId, courses, allStudents]);

    const courseStudents = selectedCourse ? allStudents.filter(s => selectedCourse.enrolledStudents.includes(s._id)) : [];

    const toggleAttendance = (studentId: string) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
        }));
    };

    const markAllPresent = () => {
        const newRecords: { [key: string]: 'present' | 'absent' } = {};
        courseStudents.forEach(student => {
            newRecords[student._id] = 'present';
        });
        setAttendanceRecords(newRecords);
    };

    const markAllAbsent = () => {
        const newRecords: { [key: string]: 'present' | 'absent' } = {};
        courseStudents.forEach(student => {
            newRecords[student._id] = 'absent';
        });
        setAttendanceRecords(newRecords);
    };

    const handleSaveAttendance = async () => {
        if (!selectedCourseId || !attendanceDate) {
            setError('Please select a course and date');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        setTimeout(() => {
            setSuccess('Attendance saved successfully!');
            setSaving(false);
        }, 800);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading...</div>
            </DashboardLayout>
        );
    }

    const presentCount = Object.values(attendanceRecords).filter(status => status === 'present').length;
    const absentCount = Object.values(attendanceRecords).filter(status => status === 'absent').length;

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Mark Attendance</h1>
                        <p className={styles.subtitle}>Record student attendance for your courses</p>
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                <Card className={styles.selectionCard}>
                    <div className={styles.selectionGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Select Course</label>
                            <select
                                className={styles.select}
                                value={selectedCourseId}
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                <option value="">Choose a course...</option>
                                {courses.map((course) => (
                                    <option key={course._id} value={course._id}>
                                        {course.courseCode} - {course.courseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Input
                            type="date"
                            label="Date"
                            value={attendanceDate}
                            onChange={(e) => setAttendanceDate(e.target.value)}
                        />
                    </div>
                </Card>

                {selectedCourse && (
                    <>
                        <div className={styles.statsGrid}>
                            <Card className={styles.statCard}>
                                <div className={styles.statValue}>{courseStudents.length}</div>
                                <div className={styles.statLabel}>Total Students</div>
                            </Card>
                            <Card className={styles.statCard}>
                                <div className={styles.statValue}>{presentCount}</div>
                                <div className={styles.statLabel}>Present</div>
                            </Card>
                            <Card className={styles.statCard}>
                                <div className={styles.statValue}>{absentCount}</div>
                                <div className={styles.statLabel}>Absent</div>
                            </Card>
                        </div>

                        <Card className={styles.attendanceCard}>
                            <CardHeader>
                                <CardTitle>Student List</CardTitle>
                                <CardSubtitle>Click on each student to toggle attendance</CardSubtitle>
                            </CardHeader>

                            <div className={styles.bulkActions}>
                                <Button variant="outline" size="sm" onClick={markAllPresent}>
                                    ✓ Mark All Present
                                </Button>
                                <Button variant="outline" size="sm" onClick={markAllAbsent}>
                                    ✕ Mark All Absent
                                </Button>
                            </div>

                            <div className={styles.attendanceList}>
                                {courseStudents.map((student) => (
                                    <div key={student._id} className={styles.attendanceItem}>
                                        <div className={styles.studentInfo}>
                                            <div className={styles.studentAvatar}>
                                                {student.firstName[0]}{student.lastName[0]}
                                            </div>
                                            <div>
                                                <div className={styles.studentName}>
                                                    {student.firstName} {student.lastName}
                                                </div>
                                                <div className={styles.studentId}>ID: {student.studentId}</div>
                                            </div>
                                        </div>
                                        <button
                                            className={`${styles.attendanceBtn} ${attendanceRecords[student._id] === 'present' ? styles.present : styles.absent
                                                }`}
                                            onClick={() => toggleAttendance(student._id)}
                                        >
                                            {attendanceRecords[student._id] === 'present' ? '✓ Present' : '✕ Absent'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.saveSection}>
                                <Button
                                    variant="primary"
                                    onClick={handleSaveAttendance}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save Attendance'}
                                </Button>
                            </div>
                        </Card>
                    </>
                )}

                {!selectedCourse && !loading && (
                    <Card>
                        <p className={styles.emptyState}>Please select a course to mark attendance</p>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
