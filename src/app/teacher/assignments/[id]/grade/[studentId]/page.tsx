'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle } from '@/components/ui/Card';
import { updateSubmissionGrade } from '@/lib/sampleData';
import { Submission, Assignment } from '@/lib/sampleData';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { TextArea } from '@/components/ui/Input';
import styles from './page.module.css';

// Define a type for the populated submission returned by the API
interface PopulatedSubmission extends Omit<Submission, 'studentId'> {
    studentId: {
        _id: string;
        firstName: string;
        lastName: string;
        studentId: string;
        email: string;
    };
}

export default function GradeSubmissionPage() {
    const params = useParams();
    const router = useRouter();
    const [submission, setSubmission] = useState<PopulatedSubmission | null>(null);
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            // Fetch assignment
            const assignmentResponse = await fetch(`/api/assignments/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (assignmentResponse.ok) {
                const data = await assignmentResponse.json();
                setAssignment(data.assignment);
            }

            // Fetch submissions
            const submissionsResponse = await fetch(`/api/assignments/${params.id}/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (submissionsResponse.ok) {
                const data = await submissionsResponse.json();
                const studentSubmission = data.submissions.find(
                    (s: any) => s.studentId._id === params.studentId
                );

                if (studentSubmission) {
                    setSubmission(studentSubmission);
                    setGrade(studentSubmission.grade?.toString() || '');
                    setFeedback(studentSubmission.feedback || '');
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const gradeNum = parseFloat(grade);
        if (isNaN(gradeNum) || gradeNum < 0 || (assignment && gradeNum > assignment.totalPoints)) {
            setError(`Grade must be between 0 and ${assignment?.totalPoints}`);
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            // Update local storage (for demo synchronization)
            updateSubmissionGrade(params.id as string, params.studentId as string, gradeNum, feedback);

            const response = await fetch(`/api/assignments/${params.id}/grade`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: params.studentId,
                    grade: gradeNum,
                    feedback,
                }),
            });

            // Even if API fails (mock DB), we proceed if local update worked
            if (!response.ok) {
                console.warn('API submission failed, but local data updated');
            }

            router.push(`/teacher/assignments/${params.id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const calculatePercentage = () => {
        const gradeNum = parseFloat(grade);
        if (isNaN(gradeNum) || !assignment) return 0;
        return Math.round((gradeNum / assignment.totalPoints) * 100);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading submission...</div>
            </DashboardLayout>
        );
    }

    if (!submission || !assignment) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.error}>Submission not found</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/teacher/assignments/${params.id}`)}
                    >
                        ← Back to Submissions
                    </Button>
                </div>

                <Card className={styles.submissionCard}>
                    <div className={styles.submissionHeader}>
                        <div>
                            <CardTitle>{assignment.title}</CardTitle>
                            <p className={styles.studentName}>
                                {submission.studentId.firstName} {submission.studentId.lastName} (ID: {submission.studentId.studentId})
                            </p>
                        </div>
                        <div className={styles.points}>{assignment.totalPoints} points</div>
                    </div>

                    <div className={styles.submissionInfo}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Submitted:</span>
                            <span className={styles.infoValue}>{formatDate(submission.submittedAt)}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Files Submitted:</span>
                            <span className={styles.infoValue}>{submission.files.length} file(s)</span>
                        </div>
                    </div>

                    <div className={styles.files}>
                        <h3>Submitted Files</h3>
                        {submission.files.map((file, index) => (
                            <a
                                key={index}
                                href={file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileLink}
                                download
                            >
                                📎 {file.split('/').pop()}
                            </a>
                        ))}
                    </div>
                </Card>

                <Card className={styles.gradeCard}>
                    <h2 className={styles.gradeTitle}>Grade Submission</h2>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.gradeInput}>
                            <Input
                                label={`Grade (out of ${assignment.totalPoints})`}
                                type="number"
                                min="0"
                                max={assignment.totalPoints}
                                step="0.5"
                                placeholder="Enter grade"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                required
                            />
                            {grade && (
                                <div className={styles.percentage}>
                                    = {calculatePercentage()}%
                                </div>
                            )}
                        </div>

                        <TextArea
                            label="Feedback (optional)"
                            placeholder="Provide feedback to the student..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={6}
                        />

                        {error && <p className={styles.error}>{error}</p>}

                        <div className={styles.actions}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/teacher/assignments/${params.id}`)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting Grade...' : 'Submit Grade'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
}
