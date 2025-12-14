'use client';

import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    value: number;
    max?: number;
    className?: string;
}

export default function ProgressBar({ value, max = 100, className = '' }: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={`${styles.progressBar} ${className}`}>
            <div
                className={styles.progressFill}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
