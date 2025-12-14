'use client';

import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export default function Card({ children, className = '', onClick, style }: CardProps) {
    return (
        <div className={`${styles.card} ${className}`} onClick={onClick} style={style}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`${styles.cardHeader} ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <h3 className={`${styles.cardTitle} ${className}`}>{children}</h3>;
}

export function CardSubtitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <p className={`${styles.cardSubtitle} ${className}`}>{children}</p>;
}
