'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student' as 'student' | 'teacher',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            router.push(`/${data.user.role}/dashboard`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                {/* Left panel with cream background */}
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to access your portal</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="student@university.edu"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <div className={styles.roleSelection}>
                            <label className={styles.roleLabel}>Select Role</label>
                            <div className={styles.roleButtons}>
                                <button
                                    type="button"
                                    className={`${styles.roleBtn} ${formData.role === 'student' ? styles.roleActive : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                >
                                    🎓 Student
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.roleBtn} ${formData.role === 'teacher' ? styles.roleActive : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'teacher' })}
                                >
                                    👨‍🏫 Teacher
                                </button>
                            </div>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <Button type="submit" variant="primary" size="lg" disabled={loading} className={styles.submitBtn}>
                            {loading ? 'Logging in...' : `Login as ${formData.role === 'student' ? 'Student' : 'Teacher'}`}
                        </Button>

                        <p className={styles.forgotPassword}>
                            Forgot password? <a href="/forgot-password">Reset here</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
