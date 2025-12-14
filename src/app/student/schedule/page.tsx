'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { getDataForUser } from '@/lib/sampleData';

export default function StudentSchedulePage() {
    const [data, setData] = useState<any>(null);
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setData(getDataForUser(parsedUser));
        }
    }, []);

    if (!data) return null;

    const getSlotsByDay = (day: string) => {
        return data.schedule.filter((slot: any) => slot.day === day);
    };

    return (
        <DashboardLayout role="student">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        Class Schedule
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        Your weekly class timetable for Fall 2024.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
                    {weekDays.map((day) => {
                        const slots = getSlotsByDay(day);
                        return (
                            <div key={day} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                <div style={{
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                    fontWeight: 600
                                }}>
                                    {day}
                                </div>
                                {slots.length === 0 ? (
                                    <div style={{
                                        padding: 'var(--space-8)',
                                        textAlign: 'center',
                                        color: 'var(--color-gray-medium)',
                                        background: 'var(--color-accent)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        No classes
                                    </div>
                                ) : (
                                    slots.map((slot: any, index: number) => (
                                        <Card key={index} style={{ borderLeft: '4px solid var(--color-primary)' }}>
                                            <div style={{ padding: 'var(--space-4)' }}>
                                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-medium)', marginBottom: 'var(--space-1)' }}>
                                                    {slot.time}
                                                </div>
                                                <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: 'var(--space-1)' }}>
                                                    {slot.code}
                                                </div>
                                                <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                                                    {slot.course}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--color-gray-medium)' }}>
                                                    <span>📍 {slot.room}</span>
                                                    <span style={{
                                                        background: 'var(--color-accent)',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: 'var(--text-xs)'
                                                    }}>
                                                        {slot.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
}
