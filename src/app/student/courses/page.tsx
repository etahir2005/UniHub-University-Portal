'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle, CardSubtitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import { getDataForUser } from '@/lib/sampleData';
import styles from './courses.module.css';

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);
            if (data) {
                setCourses(data.courses);
            }
        }
        setLoading(false);
    }, []);

    const calculateProgress = (course: any) => {
        return Math.floor(Math.random() * 40) + 60;
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className={styles.loading}>Loading courses...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <h1 className={styles.title}>My Courses</h1>
                            <p className={styles.subtitle}>Manage and view all your enrolled courses</p>
                        </div>
                        <Button onClick={() => window.location.href = '/student/enroll'}>
                            + Enroll in New Course
                        </Button>
                    </div>
                </div>

                {courses.length === 0 ? (
                    <Card>
                        <p className={styles.emptyState}>You are not enrolled in any courses yet.</p>
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <Button onClick={() => window.location.href = '/student/enroll'}>
                                Browse Courses
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className={styles.courseGrid}>
                        {courses.map((course) => {
                            const progress = calculateProgress(course);
                            return (
                                <Card key={course._id} className={styles.courseCard}>
                                    <div className={styles.courseHeader}>
                                        <div>
                                            <div className={styles.courseCode}>{course.courseCode}</div>
                                            <CardTitle>{course.courseName}</CardTitle>
                                            <CardSubtitle>
                                                👨‍🏫 {course.instructorName}
                                            </CardSubtitle>
                                        </div>
                                        <Badge status={'active'}>
                                            Active
                                        </Badge>
                                    </div>

                                    <div className={styles.courseInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoIcon}>👥</span>
                                            <span className={styles.infoText}>{course.enrolledStudents.length} Students</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoIcon}>🕐</span>
                                            <span className={styles.infoText}>{course.schedule}</span>
                                        </div>
                                    </div>

                                    <div className={styles.progressSection}>
                                        <div className={styles.progressHeader}>
                                            <span className={styles.progressLabel}>Course Progress</span>
                                            <span className={styles.progressValue}>{progress}%</span>
                                        </div>
                                        <ProgressBar value={progress} />
                                    </div>

                                    <Button
                                        variant="primary"
                                        className={styles.viewBtn}
                                        onClick={() => window.location.href = `/student/courses/${course._id}`}
                                    >
                                        View Course →
                                    </Button>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
