'use client';

import React from 'react';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
    role: 'student' | 'teacher';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <div className={styles.layout}>
            <Sidebar role={role} />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
