'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

interface NavbarProps {
    tabs: { href: string; label: string }[];
}

export default function Navbar({ tabs }: NavbarProps) {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`${styles.tab} ${pathname === tab.href ? styles.active : ''}`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            <div className={styles.actions}>
                <button className={styles.logoutBtn}>Logout</button>
            </div>
        </nav>
    );
}
