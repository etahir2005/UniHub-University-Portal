'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle, CardSubtitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { TextArea, Select } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { getDataForUser } from '@/lib/sampleData';
import styles from './courses.module.css';

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        description: '',
        schedule: '',
        semester: '',
        credits: '3',
    });
    const [error, setError] = useState('');

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

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Mock creation for demo
        alert('Course creation is simulated in this demo.');
        setShowCreateModal(false);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading courses...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>My Courses</h1>
                        <p className={styles.subtitle}>Create and manage your courses</p>
                    </div>
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        + Create New Course
                    </Button>
                </div>

                {courses.length === 0 ? (
                    <Card>
                        <p className={styles.emptyState}>
                            You haven't created any courses yet. Click "Create New Course" to get started.
                        </p>
                    </Card>
                ) : (
                    <div className={styles.courseGrid}>
                        {courses.map((course) => (
                            <Card key={course._id} className={styles.courseCard}>
                                <div className={styles.courseHeader}>
                                    <div>
                                        <div className={styles.courseCode}>{course.courseCode}</div>
                                        <CardTitle>{course.courseName}</CardTitle>
                                        <CardSubtitle>{course.schedule}</CardSubtitle>
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
                                </div>

                                <div className={styles.actions}>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => window.location.href = `/teacher/courses/${course._id}`}
                                    >
                                        Manage Course
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.location.href = `/teacher/courses/${course._id}/lectures`}
                                    >
                                        Upload Lecture
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Create Course Modal */}
                {showCreateModal && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2>Create New Course</h2>
                                <button className={styles.closeBtn} onClick={() => setShowCreateModal(false)}>
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleCreateCourse} className={styles.form}>
                                <Input
                                    label="Course Code"
                                    placeholder="e.g., CS101"
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Course Name"
                                    placeholder="e.g., Introduction to Programming"
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                    required
                                />

                                <TextArea
                                    label="Description"
                                    placeholder="Course description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />

                                <Input
                                    label="Schedule"
                                    placeholder="e.g., Mon/Wed 10:00-11:30 AM"
                                    value={formData.schedule}
                                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Semester"
                                    placeholder="e.g., Fall 2024"
                                    value={formData.semester}
                                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                />

                                <Select
                                    label="Credits"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                    options={[
                                        { value: '1', label: '1 Credit' },
                                        { value: '2', label: '2 Credits' },
                                        { value: '3', label: '3 Credits' },
                                        { value: '4', label: '4 Credits' },
                                    ]}
                                />

                                {error && <p className={styles.error}>{error}</p>}

                                <div className={styles.modalActions}>
                                    <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Create Course
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
