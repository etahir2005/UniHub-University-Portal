'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle, CardSubtitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input, { TextArea } from '@/components/ui/Input';
import { formatDate, isPastDate } from '@/lib/utils';
import { getDataForUser } from '@/lib/sampleData';
import styles from './assignments.module.css';

export default function TeacherAssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('all');

    // Form state
    const [courseId, setCourseId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [totalPoints, setTotalPoints] = useState('100');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);
            if (data) {
                setAssignments(data.assignments);
                setCourses(data.courses);
            }
        }
        setLoading(false);
    }, []);

    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId || !title || !dueDate) {
            setError('Please fill in all required fields');
            return;
        }

        setCreating(true);
        setError('');
        setSuccess('');
        setTimeout(() => {
            const { getAssignments, saveAssignments, getCourses } = require('@/lib/sampleData');
            const allAssignments = getAssignments();
            const allCourses = getCourses();
            const course = allCourses.find((c: any) => c._id === courseId);

            const newAssignment = {
                _id: `a${Date.now()}`,
                courseId,
                title,
                description,
                dueDate,
                totalPoints: Number(totalPoints),
                courseName: course?.courseName,
                courseCode: course?.courseCode,
                status: 'Pending',
                fileUrl: null
            };

            const updatedAssignments = [...allAssignments, newAssignment];
            saveAssignments(updatedAssignments);
            setAssignments(updatedAssignments);
            setSuccess('Assignment created successfully!');
            setCreating(false);
            setShowCreateForm(false);
            setTitle('');
            setDescription('');
            setDueDate('');
            setTotalPoints('100');
        }, 800);
    };

    const filteredAssignments = selectedCourse === 'all'
        ? assignments
        : assignments.filter(a => a.courseId === selectedCourse);

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading assignments...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Assignments</h1>
                        <p className={styles.subtitle}>Create and manage assignments across all courses</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancel' : '+ Create Assignment'}
                    </Button>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                {showCreateForm && (
                    <Card className={styles.formCard}>
                        <h2 className={styles.formTitle}>Create New Assignment</h2>
                        <form onSubmit={handleCreateAssignment}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Course *</label>
                                <select
                                    className={styles.select}
                                    value={courseId}
                                    onChange={(e) => setCourseId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.courseCode} - {course.courseName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Assignment Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <TextArea
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                            <Input
                                type="date"
                                label="Due Date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                            <Input
                                type="number"
                                label="Total Points"
                                value={totalPoints}
                                onChange={(e) => setTotalPoints(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={creating}
                            >
                                {creating ? 'Creating...' : 'Create Assignment'}
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Filter */}
                <div className={styles.filterSection}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Filter by Course</label>
                        <select
                            className={styles.select}
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="all">All Courses</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Assignments List */}
                <div className={styles.assignmentsList}>
                    {filteredAssignments.length === 0 ? (
                        <Card>
                            <p className={styles.emptyState}>No assignments found</p>
                        </Card>
                    ) : (
                        filteredAssignments.map((assignment) => {
                            const isOverdue = isPastDate(assignment.dueDate);
                            return (
                                <Card key={assignment._id} className={styles.assignmentCard}>
                                    <div className={styles.assignmentHeader}>
                                        <div>
                                            <CardTitle>{assignment.title}</CardTitle>
                                            <CardSubtitle>
                                                {assignment.courseCode} - {assignment.courseName}
                                            </CardSubtitle>
                                        </div>
                                        <Badge status={isOverdue ? 'inactive' : 'active'}>
                                            {isOverdue ? 'Overdue' : 'Active'}
                                        </Badge>
                                    </div>

                                    <p className={styles.description}>{assignment.description}</p>

                                    <div className={styles.assignmentInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Due Date:</span>
                                            <span className={`${styles.infoValue} ${isOverdue ? styles.overdue : ''}`}>
                                                {formatDate(assignment.dueDate)}
                                            </span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Points:</span>
                                            <span className={styles.infoValue}>{assignment.totalPoints}</span>
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => window.location.href = `/teacher/assignments/${assignment._id}`}
                                        >
                                            View Submissions
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
