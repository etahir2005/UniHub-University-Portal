'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatDate, isPastDate } from '@/lib/utils';
import { getDataForUser } from '@/lib/sampleData';
import styles from './assignments.module.css';

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);
            if (data) {
                setAssignments(data.assignments);
            }
        }
        setLoading(false);
    }, []);

    const pendingAssignments = assignments.filter(a => a.status === 'Pending' || a.status === 'Overdue');
    const completedAssignments = assignments.filter(a => a.status === 'Submitted' || a.status === 'Graded');

    const displayAssignments = activeTab === 'pending' ? pendingAssignments : completedAssignments;

    if (loading) {
        return (
            <DashboardLayout role="student">
                <div className={styles.loading}>Loading assignments...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Assignments</h1>
                    <p className={styles.subtitle}>Track and manage all your assignments</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'pending' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending ({pendingAssignments.length})
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'completed' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed ({completedAssignments.length})
                    </button>
                </div>

                {displayAssignments.length === 0 ? (
                    <Card>
                        <p className={styles.emptyState}>
                            {activeTab === 'pending' ? 'No pending assignments' : 'No completed assignments'}
                        </p>
                    </Card>
                ) : (
                    <div className={styles.assignmentList}>
                        {displayAssignments.map((assignment) => {
                            const isOverdue = isPastDate(assignment.dueDate) && assignment.status === 'Pending';
                            return (
                                <Card key={assignment._id} className={styles.assignmentCard}>
                                    <div className={styles.assignmentHeader}>
                                        <div>
                                            <CardTitle>{assignment.title}</CardTitle>
                                            <p className={styles.courseName}>{assignment.courseName}</p>
                                        </div>
                                        <Badge status={assignment.status === 'Graded' ? 'completed' : assignment.status === 'Submitted' ? 'active' : isOverdue ? 'inactive' : 'pending'}>
                                            {assignment.status}
                                        </Badge>
                                    </div>

                                    <div className={styles.assignmentInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Due Date:</span>
                                            <span className={`${styles.infoValue} ${isOverdue ? styles.overdue : ''}`}>
                                                {formatDate(assignment.dueDate)}
                                            </span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Points:</span>
                                            <span className={styles.infoValue}>
                                                {assignment.grade
                                                    ? `${assignment.score}/${assignment.totalPoints}`
                                                    : `${assignment.totalPoints} points`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={styles.actions}>
                                        {assignment.status === 'Graded' || assignment.status === 'Submitted' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/student/assignments/${assignment._id}`}
                                            >
                                                View Details
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => window.location.href = `/student/assignments/${assignment._id}`}
                                            >
                                                Submit Assignment
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
