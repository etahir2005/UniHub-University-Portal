'use client';

import React from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
    status: 'active' | 'pending' | 'completed' | 'inactive';
    children: React.ReactNode;
}

export default function Badge({ status, children }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[status]}`}>
            {children}
        </span>
    );
}
