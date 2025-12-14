'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import styles from './submissions.module.css';

export default function ViewSubmissionsPage() {
    const params = useParams();
    const router = useRouter();
    const [assignment, setAssignment] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [params.id]);

    const loadData = () => {
        const { getAssignments, getSubmissions, getUsers } = require('@/lib/sampleData');

        const allAssignments = getAssignments();
        const allSubmissions = getSubmissions();
        const allUsers = getUsers();

        const foundAssignment = allAssignments.find((a: any) => a._id === params.id);

        if (foundAssignment) {
            setAssignment(foundAssignment);

            const assignmentSubmissions = allSubmissions
                .filter((s: any) => s.assignmentId === params.id)
                .map((s: any) => {
                    const student = allUsers.find((u: any) => u._id === s.studentId);
                    return {
                        ...s,
                        studentInfo: student ? {
                            _id: student._id,
                            firstName: student.firstName,
                            lastName: student.lastName,
                            studentId: student.studentId
                        } : null
                    };
                })
                .filter((s: any) => s.studentInfo !== null);

            setSubmissions(assignmentSubmissions);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading submissions...</div>
            </DashboardLayout>
        );
    }

    if (!assignment) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.error}>Assignment not found</div>
            </DashboardLayout>
        );
    }

    const gradedCount = submissions.filter(s => s.status === 'Graded').length;

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{assignment.title}</h1>
                        <p className={styles.subtitle}>
                            {assignment.courseName} • Due: {formatDate(assignment.dueDate)}
                        </p>
                    </div>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{submissions.length}</div>
                            <div className={styles.statLabel}>Total Submissions</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{gradedCount}</div>
                            <div className={styles.statLabel}>Graded</div>
                        </div>
                    </div>
                </div>

                {submissions.length === 0 ? (
                    <Card>
                        <p className={styles.emptyState}>No submissions yet</p>
                    </Card>
                ) : (
                    <div className={styles.submissionsList}>
                        {submissions.map((submission) => (
                            <Card key={submission._id} className={styles.submissionCard}>
                                <div className={styles.submissionHeader}>
                                    <div>
                                        <CardTitle>
                                            {submission.studentInfo.firstName} {submission.studentInfo.lastName}
                                        </CardTitle>
                                        <p className={styles.studentId}>ID: {submission.studentInfo.studentId}</p>
                                    </div>
                                    <Badge status={submission.status === 'Graded' ? 'completed' : 'pending'}>
                                        {submission.status}
                                    </Badge>
                                </div>

                                <div className={styles.submissionInfo}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Submitted:</span>
                                        <span className={styles.infoValue}>{formatDate(submission.submittedAt)}</span>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoLabel}>File:</span>
                                        <span className={styles.infoValue}>{submission.fileUrl || 'submission.pdf'}</span>
                                    </div>
                                    {submission.status === 'Graded' && (
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Grade:</span>
                                            <span className={styles.infoValue}>
                                                {submission.score}/{assignment.totalPoints} ({submission.grade})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {submission.feedback && (
                                    <div className={styles.feedback}>
                                        <strong>Feedback:</strong> {submission.feedback}
                                    </div>
                                )}

                                <div className={styles.actions}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(submission.fileUrl || '#', '_blank')}
                                    >
                                        View File
                                    </Button>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => router.push(`/teacher/assignments/${params.id}/grade/${submission.studentInfo._id}`)}
                                    >
                                        {submission.status === 'Graded' ? 'Edit Grade' : 'Grade'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <div className={styles.backButton}>
                    <Button variant="outline" onClick={() => router.push('/teacher/assignments')}>
                        ← Back to Assignments
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
