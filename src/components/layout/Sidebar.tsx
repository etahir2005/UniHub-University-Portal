'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

interface SidebarProps {
    role: 'student' | 'teacher';
}

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const studentLinks = [
        { href: `/${role}/dashboard`, label: 'Home', icon: '🏠' },
        { href: `/${role}/courses`, label: 'Courses', icon: '📚' },
        { href: `/${role}/assignments`, label: 'Assignments', icon: '📝' },
        { href: `/${role}/grades`, label: 'Grades', icon: '📊' },
        { href: `/${role}/attendance`, label: 'Attendance', icon: '✓' },
        { href: `/${role}/resources`, label: 'Resource Hub', icon: '📁' },
        { href: `/${role}/profile`, label: 'Profile', icon: '👤' },
        { href: `/${role}/schedule`, label: 'Schedule', icon: '📅' },
    ];

    const teacherLinks = [
        { href: `/${role}/dashboard`, label: 'Home', icon: '🏠' },
        { href: `/${role}/courses`, label: 'Courses', icon: '📚' },
        { href: `/${role}/assignments`, label: 'Assignments', icon: '📝' },
        { href: `/${role}/attendance`, label: 'Attendance', icon: '✓' },
        { href: `/${role}/grades`, label: 'Grades', icon: '📊' },
        { href: `/${role}/resources`, label: 'Resources', icon: '📁' },
        { href: `/${role}/schedule`, label: 'Schedule', icon: '📅' },
        { href: `/${role}/profile`, label: 'Profile', icon: '👤' },
    ];

    const links = role === 'student' ? studentLinks : teacherLinks;

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon}>UH</div>
                <span className={styles.logoText}>UniHub</span>
            </div>

            <nav className={styles.nav}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
                    >
                        <span className={styles.icon}>{link.icon}</span>
                        <span className={styles.label}>{link.label}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.logout}>
                <button className={styles.logoutBtn} onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }}>
                    <span className={styles.icon}>🚪</span>
                    <span className={styles.label}>Logout</span>
                </button>
            </div>
        </aside>
    );
}
