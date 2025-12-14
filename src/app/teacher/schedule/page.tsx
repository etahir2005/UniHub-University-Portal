'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { getDataForUser } from '@/lib/sampleData';
import styles from './schedule.module.css';

interface ScheduleSlot {
    day: string;
    course: string;
    code: string;
    time: string;
    room: string;
    type?: string;
}

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TeacherSchedulePage() {
    const [schedule, setSchedule] = useState<ScheduleSlot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            const data = getDataForUser(parsed);
            if (data && data.schedule) {
                setSchedule(data.schedule);
            }
        }
        setLoading(false);
    }, []);

    const getSlotsByDay = (day: string) => {
        return schedule.filter(slot => slot.day === day);
    };

    if (loading) {
        return (
            <DashboardLayout role="teacher">
                <div className={styles.loading}>Loading schedule...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>My Schedule</h1>
                        <p className={styles.subtitle}>Your weekly teaching schedule</p>
                    </div>
                </div>

                {/* Weekly View */}
                <div className={styles.weeklyView}>
                    {weekDays.map((day) => {
                        const slots = getSlotsByDay(day);
                        return (
                            <div key={day} className={styles.dayColumn}>
                                <div className={styles.dayHeader}>{day}</div>
                                <div className={styles.slotsContainer}>
                                    {slots.length === 0 ? (
                                        <div className={styles.noClass}>No classes</div>
                                    ) : (
                                        slots.map((slot, index) => (
                                            <Card key={index} className={styles.slotCard}>
                                                <div className={styles.slotTime}>{slot.time}</div>
                                                {slot.code && (
                                                    <>
                                                        <div className={styles.courseCode}>{slot.code}</div>
                                                        <div className={styles.courseName}>{slot.course}</div>
                                                        <div className={styles.room}>📍 {slot.room}</div>
                                                    </>
                                                )}
                                                {!slot.code && (
                                                    <div className={styles.officeHours}>
                                                        🕐 {slot.course}
                                                        <div className={styles.room}>{slot.room}</div>
                                                    </div>
                                                )}
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* List View */}
                <div className={styles.listView}>
                    <h2 className={styles.sectionTitle}>All Classes</h2>
                    <div className={styles.classList}>
                        {schedule.length === 0 ? (
                            <p>No classes scheduled.</p>
                        ) : (
                            schedule.map((slot, index) => (
                                <Card key={index} className={styles.classCard}>
                                    <div className={styles.classHeader}>
                                        <div>
                                            <div className={styles.classDay}>{slot.day}</div>
                                            {slot.code && (
                                                <>
                                                    <div className={styles.className}>
                                                        {slot.code} - {slot.course}
                                                    </div>
                                                </>
                                            )}
                                            {!slot.code && (
                                                <div className={styles.className}>{slot.course}</div>
                                            )}
                                        </div>
                                        <div className={styles.classTime}>{slot.time}</div>
                                    </div>
                                    <div className={styles.classRoom}>📍 {slot.room}</div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
