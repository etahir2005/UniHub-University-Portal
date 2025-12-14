'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FileUpload from '@/components/ui/FileUpload';
import { formatDate, isPastDate } from '@/lib/utils';
import styles from './submit.module.css';

export default function SubmitAssignmentPage() {
    const params = useParams();
    const router = useRouter();
    const assignmentId = params.id as string;

    const [assignment, setAssignment] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Load data from localStorage
        const { getAssignments, getSubmissions, getCourses } = require('@/lib/sampleData');
        const userStr = localStorage.getItem('user');

        if (!userStr) {
            router.push('/login');
            return;
        }

        const user = JSON.parse(userStr);
        const allAssignments = getAssignments();
        const allSubmissions = getSubmissions();

        const foundAssignment = allAssignments.find((a: any) => a._id === assignmentId);

        if (foundAssignment) {
            // Enrich with course details if missing
            if (!foundAssignment.courseName) {
                const allCourses = getCourses();
                const course = allCourses.find((c: any) => c._id === foundAssignment.courseId);
                if (course) {
                    foundAssignment.courseName = course.courseName;
                    foundAssignment.courseCode = course.courseCode;
                    // Ensure courseId is an object for the UI if needed, or keep as string
                    // The UI expects courseId.courseCode, so let's mock that structure or update UI
                    foundAssignment.courseDetails = course;
                }
            }

            setAssignment(foundAssignment);

            const foundSubmission = allSubmissions.find(
                (s: any) => s.assignmentId === assignmentId && s.studentId === user._id
            );
            setSubmission(foundSubmission || null);
        }

        setLoading(false);
    }, [assignmentId, router]);

    const handleFileSelect = (files: File[]) => {
        if (files.length > 0) {
            setUploadedFile(files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadedFile) {
            setError('Please select a file to upload');
            return;
        }

        if (assignment && isPastDate(assignment.dueDate)) {
            const confirmLate = window.confirm('This assignment is past due. Submit anyway?');
            if (!confirmLate) return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');
        setTimeout(() => {
            const { getSubmissions, saveSubmissions } = require('@/lib/sampleData');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const allSubmissions = getSubmissions();

            const newSubmission = {
                _id: `sub_${assignmentId}_${user._id}_${Date.now()}`,
                assignmentId: assignmentId,
                studentId: user._id,
                courseId: assignment.courseId,
                status: 'Pending',
                submittedAt: new Date().toISOString(),
                score: 0,
                grade: 'Pending',
                feedback: '',
                fileUrl: URL.createObjectURL(uploadedFile),
                fileName: uploadedFile.name,
                fileSize: uploadedFile.size
            };
            const existingIndex = allSubmissions.findIndex(
                (s: any) => s.assignmentId === assignmentId && s.studentId === user._id
            );

            if (existingIndex >= 0) {
                allSubmissions[existingIndex] = newSubmission;
            } else {
                allSubmissions.push(newSubmission);
            }

            saveSubmissions(allSubmissions);
            setSubmission(newSubmission);
            setSuccess('Assignment submitted successfully!');
            setUploadedFile(null);
            setSubmitting(false);

            setTimeout(() => {
                router.push('/student/assignments');
            }, 1500);
        }, 1000);
    };

    const handleDownload = (fileUrl: string, fileName: string) => {
        alert(`Downloading ${fileName}...`);
    };

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className={styles.loading}>Loading assignment...</div>
            </DashboardLayout>
        );
    }

    if (!assignment) {
        return (
            <DashboardLayout role="student">
                <div className={styles.error}>Assignment not found</div>
            </DashboardLayout>
        );
    }

    const isOverdue = isPastDate(assignment.dueDate) && !submission;

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                <div className={styles.header}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        ← Back
                    </Button>
                </div>

                {/* Assignment Details */}
                <Card className={styles.assignmentCard}>
                    <div className={styles.assignmentHeader}>
                        <div>
                            <h1 className={styles.title}>{assignment.title}</h1>
                            <p className={styles.courseName}>
                                {assignment.courseCode || assignment.courseDetails?.courseCode} - {assignment.courseName || assignment.courseDetails?.courseName}
                            </p>
                        </div>
                        {submission ? (
                            <Badge status={submission.status === 'Graded' ? 'completed' : 'pending'}>
                                {submission.status}
                            </Badge>
                        ) : (
                            <Badge status={isOverdue ? 'inactive' : 'pending'}>
                                {isOverdue ? 'Overdue' : 'Not Submitted'}
                            </Badge>
                        )}
                    </div>

                    <div className={styles.description}>
                        <h3 className={styles.sectionTitle}>Description</h3>
                        <p className={styles.descriptionText}>{assignment.description}</p>
                    </div>

                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Due Date</div>
                            <div className={`${styles.infoValue} ${isOverdue ? styles.overdue : ''}`}>
                                {formatDate(assignment.dueDate)}
                            </div>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Total Points</div>
                            <div className={styles.infoValue}>{assignment.totalPoints}</div>
                        </div>
                        {/* <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Posted On</div>
                            <div className={styles.infoValue}>{formatDate(assignment.createdAt)}</div>
                        </div> */}
                        {submission && submission.status === 'Graded' && (
                            <div className={styles.infoCard}>
                                <div className={styles.infoLabel}>Your Grade</div>
                                <div className={styles.infoValue}>
                                    {submission.grade}/{assignment.totalPoints}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Submission Section */}
                {submission ? (
                    <Card className={styles.submissionCard}>
                        <CardHeader>
                            <CardTitle>Your Submission</CardTitle>
                            <CardSubtitle>Submitted on {formatDate(submission.submittedAt)}</CardSubtitle>
                        </CardHeader>

                        <div className={styles.submittedFile}>
                            <div className={styles.fileInfo}>
                                <span className={styles.fileIcon}>📄</span>
                                <span className={styles.fileName}>{submission.fileName || 'submission.pdf'}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(submission.fileUrl, submission.fileName || 'submission.pdf')}
                            >
                                Download
                            </Button>
                        </div>

                        {submission.status === 'Graded' && (
                            <div className={styles.gradeSection}>
                                <div className={styles.gradeHeader}>
                                    <h3 className={styles.sectionTitle}>Grade & Feedback</h3>
                                    <div className={styles.gradeValue}>
                                        {submission.score}/{assignment.totalPoints} points
                                    </div>
                                </div>
                                {submission.feedback && (
                                    <div className={styles.feedback}>
                                        <p className={styles.feedbackLabel}>Teacher's Feedback:</p>
                                        <p className={styles.feedbackText}>{submission.feedback}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {submission.status !== 'Graded' && (
                            <div className={styles.pendingNotice}>
                                <span className={styles.pendingIcon}>⏳</span>
                                <span>Your submission is pending review by the teacher.</span>
                            </div>
                        )}
                    </Card>
                ) : (
                    <Card className={styles.uploadCard}>
                        <CardHeader>
                            <CardTitle>Submit Assignment</CardTitle>
                            <CardSubtitle>
                                {isOverdue ? '⚠️ This assignment is past due' : 'Upload your work'}
                            </CardSubtitle>
                        </CardHeader>

                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className={styles.successMessage}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <FileUpload
                                onFilesSelected={handleFileSelect}
                                maxFiles={1}
                                maxSizeMB={10}
                                acceptedTypes={['.pdf', '.doc', '.docx', '.zip', '.txt']}
                                multiple={false}
                            />

                            {uploadedFile && (
                                <div className={styles.selectedFile}>
                                    <span className={styles.fileIcon}>📄</span>
                                    <span className={styles.fileName}>{uploadedFile.name}</span>
                                    <button
                                        type="button"
                                        className={styles.removeBtn}
                                        onClick={() => setUploadedFile(null)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!uploadedFile || submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Assignment'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
