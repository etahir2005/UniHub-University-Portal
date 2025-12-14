'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProgressBar from '@/components/ui/ProgressBar';
import { getDataForUser } from '@/lib/sampleData';
import styles from './profile.module.css';

export default function StudentProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        studentId: '',
        phone: '',
        major: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setFormData({
                firstName: parsed.firstName || '',
                lastName: parsed.lastName || '',
                email: parsed.email || '',
                studentId: parsed.studentId || 'STU-2024-001',
                phone: parsed.phone || '+1 (555) 987-6543',
                major: parsed.major || 'Computer Science',
            });

            const data = getDataForUser(parsed);
            if (data) {
                setCourses(data.courses);
            }
        }
    }, []);

    const handleSave = () => {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
    };

    // Calculate stats based on real data
    const enrollmentInfo = {
        semester: user?.semester || 'Fall 2024',
        year: user?.year || '3rd Year',
        enrolledCourses: courses.length,
        completedCredits: user?.credits?.completed || 78,
        totalCredits: user?.credits?.total || 120,
        gpa: user?.gpa || 3.65,
        attendance: user?.attendance || 92,
    };

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                <h1 className={styles.title}>My Profile</h1>

                {/* Profile Card */}
                <Card className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {formData.firstName[0]}{formData.lastName[0]}
                        </div>
                        <div className={styles.profileInfo}>
                            <h2 className={styles.name}>
                                {formData.firstName} {formData.lastName}
                            </h2>
                            <p className={styles.role}>🎓 Student</p>
                            <p className={styles.studentId}>ID: {formData.studentId}</p>
                            <p className={styles.major}>📚 {formData.major}</p>
                        </div>
                        <Button
                            variant={isEditing ? 'outline' : 'primary'}
                            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className={styles.editForm}>
                            <div className={styles.formRow}>
                                <Input
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                                <Input
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <Input
                                label="Major"
                                value={formData.major}
                                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            />
                            <Button variant="primary" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.profileDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span className={styles.detailValue}>{formData.email}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Phone:</span>
                                <span className={styles.detailValue}>{formData.phone}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Major:</span>
                                <span className={styles.detailValue}>{formData.major}</span>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Enrollment Summary */}
                <Card className={styles.enrollmentCard}>
                    <CardHeader>
                        <CardTitle>Enrollment Summary</CardTitle>
                    </CardHeader>
                    <div className={styles.enrollmentGrid}>
                        <div className={styles.enrollmentItem}>
                            <div className={styles.enrollmentLabel}>Current Semester</div>
                            <div className={styles.enrollmentValue}>{enrollmentInfo.semester}</div>
                        </div>
                        <div className={styles.enrollmentItem}>
                            <div className={styles.enrollmentLabel}>Year</div>
                            <div className={styles.enrollmentValue}>{enrollmentInfo.year}</div>
                        </div>
                        <div className={styles.enrollmentItem}>
                            <div className={styles.enrollmentLabel}>Enrolled Courses</div>
                            <div className={styles.enrollmentValue}>{enrollmentInfo.enrolledCourses}</div>
                        </div>
                        <div className={styles.enrollmentItem}>
                            <div className={styles.enrollmentLabel}>Completed Credits</div>
                            <div className={styles.enrollmentValue}>
                                {enrollmentInfo.completedCredits}/{enrollmentInfo.totalCredits}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Progress Overview */}
                <Card className={styles.progressCard}>
                    <CardHeader>
                        <CardTitle>Progress Overview</CardTitle>
                    </CardHeader>
                    <div className={styles.progressSection}>
                        <div className={styles.progressItem}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Overall GPA</span>
                                <span className={styles.progressValue}>{enrollmentInfo.gpa}/4.0</span>
                            </div>
                            <ProgressBar value={(Number(enrollmentInfo.gpa) / 4.0) * 100} />
                        </div>
                        <div className={styles.progressItem}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Degree Completion</span>
                                <span className={styles.progressValue}>
                                    {Math.round((enrollmentInfo.completedCredits / enrollmentInfo.totalCredits) * 100)}%
                                </span>
                            </div>
                            <ProgressBar value={(enrollmentInfo.completedCredits / enrollmentInfo.totalCredits) * 100} />
                        </div>
                        <div className={styles.progressItem}>
                            <div className={styles.progressHeader}>
                                <span className={styles.progressLabel}>Attendance Rate</span>
                                <span className={styles.progressValue}>{enrollmentInfo.attendance}%</span>
                            </div>
                            <ProgressBar value={enrollmentInfo.attendance} />
                        </div>
                    </div>
                </Card>

                {/* Current Courses */}
                <Card className={styles.coursesCard}>
                    <CardHeader>
                        <CardTitle>Current Courses</CardTitle>
                    </CardHeader>
                    <div className={styles.coursesList}>
                        {courses.length === 0 ? (
                            <p className={styles.emptyState}>No courses enrolled.</p>
                        ) : (
                            courses.map(course => (
                                <div key={course._id} className={styles.courseItem}>
                                    <div className={styles.courseCode}>{course.courseCode}</div>
                                    <div className={styles.courseName}>{course.courseName}</div>
                                    <div className={styles.courseGrade}>
                                        {/* Mock grade for now, or fetch from grades */}
                                        {['A', 'A-', 'B+', 'B'][Math.floor(Math.random() * 4)]}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
