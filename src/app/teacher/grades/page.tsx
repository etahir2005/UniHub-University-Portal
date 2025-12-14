'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getDataForUser } from '@/lib/sampleData';

export default function TeacherGradesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [editGrade, setEditGrade] = useState('');
    const [editFeedback, setEditFeedback] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);
            if (data) {
                setCourses(data.courses);
                if (data.courses.length > 0) {
                    setSelectedCourseId(data.courses[0]._id);
                }
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const data = getDataForUser(parsedUser);
                if (data) {
                    const courseAssignments = data.assignments.filter((a: any) => a.courseId === selectedCourseId);
                    setAssignments(courseAssignments);
                    if (courseAssignments.length > 0) {
                        setSelectedAssignmentId(courseAssignments[0]._id);
                    } else {
                        setSelectedAssignmentId('');
                    }

                    const course = data.courses.find((c: any) => c._id === selectedCourseId);
                    if (course && data.students) {
                        const enrolledStudents = data.students.filter((s: any) => course.enrolledStudents.includes(s._id));
                        setStudents(enrolledStudents);
                    }
                }
            }
        }
    }, [selectedCourseId]);

    const handleGradeEdit = (student: any) => {
        setSelectedStudent(student);
        setEditGrade('');
        setEditFeedback('');
        setShowGradeModal(true);
    };

    const handleSaveGrade = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowGradeModal(false);
            alert(`Grade saved for ${selectedStudent.firstName} ${selectedStudent.lastName}!`);
        }, 1000);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div style={{ padding: '2rem' }}>Loading gradebook...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        Gradebook
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        Manage grades and feedback for all your courses.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: 'var(--space-6)' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Course</label>
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-gray-light)',
                                fontSize: 'var(--text-base)'
                            }}
                        >
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.courseCode} - {course.courseName}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Assignment</label>
                        <select
                            value={selectedAssignmentId}
                            onChange={(e) => setSelectedAssignmentId(e.target.value)}
                            disabled={!selectedCourseId || assignments.length === 0}
                            style={{
                                width: '100%',
                                padding: 'var(--space-3)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-gray-light)',
                                fontSize: 'var(--text-base)'
                            }}
                        >
                            {assignments.length === 0 ? (
                                <option>No assignments found</option>
                            ) : (
                                assignments.map(assignment => (
                                    <option key={assignment._id} value={assignment._id}>{assignment.title}</option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                <Card>
                    <div style={{ padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>
                                {assignments.find(a => a._id === selectedAssignmentId)?.title || 'Select an Assignment'}
                            </h2>
                            <Button variant="outline">Export Grades</Button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-gray-light)', textAlign: 'left' }}>
                                        <th style={{ padding: 'var(--space-4)', color: 'var(--color-gray-dark)' }}>Student</th>
                                        <th style={{ padding: 'var(--space-4)', color: 'var(--color-gray-dark)' }}>ID</th>
                                        <th style={{ padding: 'var(--space-4)', color: 'var(--color-gray-dark)' }}>Status</th>
                                        <th style={{ padding: 'var(--space-4)', color: 'var(--color-gray-dark)' }}>Grade</th>
                                        <th style={{ padding: 'var(--space-4)', color: 'var(--color-gray-dark)' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'gray' }}>
                                                No students found for this course.
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((student) => (
                                            <tr key={student._id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                                                <td style={{ padding: 'var(--space-4)', fontWeight: 500 }}>
                                                    {student.firstName} {student.lastName}
                                                </td>
                                                <td style={{ padding: 'var(--space-4)', color: 'var(--color-gray-medium)' }}>
                                                    {student.studentId}
                                                </td>
                                                <td style={{ padding: 'var(--space-4)' }}>
                                                    <Badge status="pending">Pending</Badge>
                                                </td>
                                                <td style={{ padding: 'var(--space-4)', fontWeight: 600 }}>
                                                    - / {assignments.find(a => a._id === selectedAssignmentId)?.totalPoints || 100}
                                                </td>
                                                <td style={{ padding: 'var(--space-4)' }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleGradeEdit(student)}
                                                    >
                                                        Grade
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>

                {showGradeModal && selectedStudent && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <Card style={{ width: '500px', maxWidth: '90%' }}>
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    Grade: {selectedStudent.firstName} {selectedStudent.lastName}
                                </h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <Input
                                        label="Score"
                                        type="number"
                                        value={editGrade}
                                        onChange={(e) => setEditGrade(e.target.value)}
                                        placeholder={`Max: ${assignments.find(a => a._id === selectedAssignmentId)?.totalPoints || 100}`}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Feedback</label>
                                    <textarea
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #e2e8f0',
                                            minHeight: '100px'
                                        }}
                                        value={editFeedback}
                                        onChange={(e) => setEditFeedback(e.target.value)}
                                        placeholder="Enter feedback for the student..."
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <Button variant="outline" onClick={() => setShowGradeModal(false)}>Cancel</Button>
                                    <Button variant="primary" onClick={handleSaveGrade} disabled={isSaving}>
                                        {isSaving ? 'Saving...' : 'Save Grade'}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
