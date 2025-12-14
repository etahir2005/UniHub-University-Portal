'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle, CardSubtitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getAllCourses, getDataForUser } from '@/lib/sampleData';

export default function StudentEnrollPage() {
    const [user, setUser] = useState<any>(null);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [enrollLoading, setEnrollLoading] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Get current enrollments
            const userData = getDataForUser(parsedUser);
            const currentIds = userData?.courses.map((c: any) => c._id) || [];
            setEnrolledCourseIds(currentIds);

            // Get all courses
            const all = getAllCourses();
            setAvailableCourses(all);
        }
        setLoading(false);
    }, []);

    const handleEnroll = (courseId: string) => {
        setEnrollLoading(courseId);

        // Simulate API call
        setTimeout(() => {
            // Update LocalStorage
            const localEnrollments = JSON.parse(localStorage.getItem('enrollments') || '{}');
            const userEnrollments = localEnrollments[user._id] || [];

            if (!userEnrollments.includes(courseId)) {
                userEnrollments.push(courseId);
                localEnrollments[user._id] = userEnrollments;
                localStorage.setItem('enrollments', JSON.stringify(localEnrollments));

                // Update state
                setEnrolledCourseIds([...enrolledCourseIds, courseId]);
                alert('Successfully enrolled!');
            }

            setEnrollLoading(null);
        }, 800);
    };

    if (loading) return null;

    return (
        <DashboardLayout role="student">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        Course Enrollment
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        Browse and enroll in available courses for this semester.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                    {availableCourses.map((course) => {
                        const isEnrolled = enrolledCourseIds.includes(course._id);

                        return (
                            <Card key={course._id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-2)' }}>
                                    <div style={{ flex: 1, minWidth: '300px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                                            <Badge status="primary">{course.courseCode}</Badge>
                                            <CardTitle style={{ margin: 0 }}>{course.courseName}</CardTitle>
                                        </div>
                                        <CardSubtitle style={{ marginBottom: 'var(--space-4)' }}>
                                            👨‍🏫 {course.instructorName} • 📍 {course.room} • 🕐 {course.schedule}
                                        </CardSubtitle>
                                        <p style={{ color: 'var(--color-gray-dark)', lineHeight: 1.5 }}>
                                            {course.description}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-4)' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 600, fontSize: 'var(--text-lg)' }}>
                                                {course.enrolledStudents.length} Students
                                            </div>
                                            <div style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--text-sm)' }}>
                                                Currently Enrolled
                                            </div>
                                        </div>

                                        {isEnrolled ? (
                                            <Button variant="outline" disabled>
                                                ✓ Enrolled
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                onClick={() => handleEnroll(course._id)}
                                                disabled={enrollLoading === course._id}
                                            >
                                                {enrollLoading === course._id ? 'Enrolling...' : 'Enroll Now'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
