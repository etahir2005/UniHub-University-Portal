'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '@/components/ui/Card';
import { timeAgo } from '@/lib/utils';
import { getDataForUser } from '@/lib/sampleData';
import styles from './dashboard.module.css';

export default function StudentDashboard() {
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setData(getDataForUser(parsedUser));
        }
    }, []);

    if (!data) return null;

    const stats = {
        enrolledCourses: data.courses.length,
        pendingAssignments: data.assignments.filter((a: any) => a.status === 'Pending').length,
        averageGrade: user?.gpa || '3.5',
        attendance: `${user?.attendance || 90}%`
    };

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Student Dashboard</h1>
                        <p className={styles.welcome}>
                            Welcome back, {user?.firstName || 'Student'}! Here's what's happening today.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📚</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{stats.enrolledCourses}</div>
                            <div style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--text-sm)' }}>Enrolled Courses</div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📝</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{stats.pendingAssignments}</div>
                            <div style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--text-sm)' }}>Pending Assignments</div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🏆</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{stats.averageGrade}</div>
                            <div style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--text-sm)' }}>CGPA</div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ textAlign: 'center', padding: 'var(--space-2)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>✓</div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{stats.attendance}</div>
                            <div style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--text-sm)' }}>Attendance</div>
                        </div>
                    </Card>
                </div>

                <div className={styles.grid}>
                    <Card className={styles.announcementCard}>
                        <CardHeader>
                            <div className={styles.cardHeaderContent}>
                                <span className={styles.icon}>📢</span>
                                <CardTitle>Recent Announcements</CardTitle>
                            </div>
                        </CardHeader>

                        <div className={styles.announcementList}>
                            {data.announcements.slice(0, 3).map((announcement: any) => (
                                <div key={announcement._id} className={styles.announcementItem}>
                                    <div className={styles.announcementHeader}>
                                        <h4 className={styles.announcementTitle}>{announcement.title}</h4>
                                        <span className={styles.announcementTime}>
                                            {timeAgo(announcement.createdAt)}
                                        </span>
                                    </div>
                                    <p className={styles.announcementContent}>{announcement.content}</p>
                                    <p className={styles.announcementCourse}>
                                        {announcement.courseName} • {announcement.author}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className={styles.quickLinks}>
                        <CardHeader>
                            <CardTitle>Quick Links</CardTitle>
                        </CardHeader>

                        <div className={styles.linkGrid}>
                            <Link href="/student/courses" className={styles.linkCard}>
                                <span className={styles.linkIcon}>📚</span>
                                <span className={styles.linkLabel}>My Courses</span>
                            </Link>
                            <Link href="/student/assignments" className={styles.linkCard}>
                                <span className={styles.linkIcon}>📝</span>
                                <span className={styles.linkLabel}>Assignments</span>
                            </Link>
                            <Link href="/student/grades" className={styles.linkCard}>
                                <span className={styles.linkIcon}>📊</span>
                                <span className={styles.linkLabel}>Grades</span>
                            </Link>
                            <Link href="/student/attendance" className={styles.linkCard}>
                                <span className={styles.linkIcon}>✓</span>
                                <span className={styles.linkLabel}>Attendance</span>
                            </Link>
                            <Link href="/student/resources" className={styles.linkCard}>
                                <span className={styles.linkIcon}>📁</span>
                                <span className={styles.linkLabel}>Resources</span>
                            </Link>
                            <Link href="/student/schedule" className={styles.linkCard}>
                                <span className={styles.linkIcon}>📅</span>
                                <span className={styles.linkLabel}>Schedule</span>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
