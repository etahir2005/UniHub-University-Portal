'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { getDataForUser } from '@/lib/sampleData';

export default function StudentAttendancePage() {
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

    return (
        <DashboardLayout role="student">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        Attendance Record
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        Track your attendance across all enrolled courses.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
                    {data.attendance.map((record: any) => (
                        <Card key={record.code}>
                            <CardHeader>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <div>
                                        <CardTitle>{record.courseName}</CardTitle>
                                        <div style={{ color: 'var(--color-gray-medium)', fontSize: 'var(--text-sm)' }}>{record.code}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: record.percentage >= 75 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            {record.percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <div style={{ padding: 'var(--space-4)' }}>
                                <div style={{ marginBottom: 'var(--space-4)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                                        <span>Progress</span>
                                        <span>{record.attended}/{record.totalClasses} Classes</span>
                                    </div>
                                    <ProgressBar value={record.percentage} max={100} className={record.percentage >= 75 ? 'bg-success' : 'bg-danger'} />
                                </div>

                                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)', color: 'var(--color-gray-dark)' }}>Recent History</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {record.history.slice(0, 5).map((entry: any, i: number) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2)', background: 'var(--color-gray-light)', borderRadius: 'var(--radius-sm)' }}>
                                            <span style={{ fontSize: 'var(--text-sm)' }}>Week {entry.week} ({new Date(entry.date).toLocaleDateString()})</span>
                                            <Badge variant={entry.status === 'Present' ? 'success' : 'danger'}>
                                                {entry.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
