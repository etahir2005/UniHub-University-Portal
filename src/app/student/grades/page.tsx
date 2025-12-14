'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getDataForUser } from '@/lib/sampleData';

export default function StudentGradesPage() {
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

    const calculateGPA = () => {
        if (!data.grades || !data.grades.length) return '0.0';
        const total = data.grades.reduce((acc: number, curr: any) => acc + (curr.score || 0), 0);
        return (total / data.grades.length / 25).toFixed(2);
    };

    return (
        <DashboardLayout role="student">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        My Grades
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        View your academic performance and assessment results.
                    </p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                    <Card>
                        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                                {calculateGPA()}
                            </div>
                            <div style={{ color: 'var(--color-gray-medium)' }}>Current GPA</div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>
                                {data.grades?.length || 0}
                            </div>
                            <div style={{ color: 'var(--color-gray-medium)' }}>Graded Assignments</div>
                        </div>
                    </Card>
                    <Card>
                        <div style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-warning)', marginBottom: 'var(--space-1)' }}>
                                {data.assignments.filter((a: any) => a.status === 'Pending').length}
                            </div>
                            <div style={{ color: 'var(--color-gray-medium)' }}>Pending Assessments</div>
                        </div>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detailed Grade Report</CardTitle>
                    </CardHeader>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-gray-dark)' }}>Course</th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-gray-dark)' }}>Assignment</th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-gray-dark)' }}>Date</th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-gray-dark)' }}>Grade</th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-gray-dark)' }}>Percentage</th>
                                    <th style={{ padding: 'var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--color-gray-dark)' }}>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.grades || []).map((item: any) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <div style={{ fontWeight: 500 }}>{item.courseCode}</div>
                                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-medium)' }}>{item.courseName}</div>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)' }}>{item.title}</td>
                                        <td style={{ padding: 'var(--space-4)', color: 'var(--color-gray-medium)' }}>{new Date(item.dueDate).toLocaleDateString()}</td>
                                        <td style={{ padding: 'var(--space-4)' }}>
                                            <Badge status={item.grade?.startsWith('A') ? 'completed' : item.grade?.startsWith('B') ? 'active' : 'pending'}>
                                                {item.grade}
                                            </Badge>
                                        </td>
                                        <td style={{ padding: 'var(--space-4)', fontWeight: 500 }}>
                                            {item.score}/{item.totalPoints} ({Math.round((item.score / item.totalPoints) * 100)}%)
                                        </td>
                                        <td style={{ padding: 'var(--space-4)', color: 'var(--color-gray-medium)', maxWidth: '200px' }}>
                                            {item.feedback}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
