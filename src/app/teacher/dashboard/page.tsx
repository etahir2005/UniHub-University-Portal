'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { getDataForUser } from '@/lib/sampleData';

export default function TeacherDashboard() {
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setData(getDataForUser(parsedUser));
        }
    }, []);

    if (!data) return null;

    const stats = {
        totalCourses: data.courses.length,
        activeAssignments: data.assignments.filter((a: any) => a.status === 'Pending').length,
        totalStudents: data.students.length,
        recentAnnouncements: data.announcements.length
    };

    return (
        <DashboardLayout role="teacher">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        Teacher Dashboard
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        Welcome back, {user?.firstName}! Here's an overview of your courses and students.
                    </p>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ fontSize: '2.5rem' }}>📚</div>
                            <div>
                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    {stats.totalCourses}
                                </div>
                                <div style={{ color: 'var(--color-gray-medium)' }}>Active Courses</div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ fontSize: '2.5rem' }}>📝</div>
                            <div>
                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    {stats.activeAssignments}
                                </div>
                                <div style={{ color: 'var(--color-gray-medium)' }}>Active Assignments</div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                            <div style={{ fontSize: '2.5rem' }}>👨‍🎓</div>
                            <div>
                                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
                                    {stats.totalStudents}
                                </div>
                                <div style={{ color: 'var(--color-gray-medium)' }}>Total Students</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions Grid */}
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
                    <Link href="/teacher/courses" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>📚 My Courses</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>Manage course content and students</p>
                        </Card>
                    </Link>

                    <Link href="/teacher/assignments" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>📝 Assignments</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>Create and grade assignments</p>
                        </Card>
                    </Link>

                    <Link href="/teacher/attendance" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>✓ Attendance</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>Mark student attendance</p>
                        </Card>
                    </Link>

                    <Link href="/teacher/grades" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>📊 Grades</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>View and manage grades</p>
                        </Card>
                    </Link>

                    <Link href="/teacher/resources" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>📁 Resources</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>Upload lecture notes and files</p>
                        </Card>
                    </Link>

                    <Link href="/teacher/schedule" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>📅 Schedule</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>View your teaching timetable</p>
                        </Card>
                    </Link>

                    <Link href="/teacher/profile" style={{ textDecoration: 'none' }}>
                        <Card className="hover-card">
                            <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>👤 Profile</h3>
                            <p style={{ color: 'var(--color-gray-medium)' }}>View and edit your profile</p>
                        </Card>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
