'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './forgot.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess('Password reset instructions have been sent to your email!');
            setEmail('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}></div>
            <div className={styles.rightPanel}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Forgot Password?</h1>
                    <p className={styles.subtitle}>
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="student@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {error && <p className={styles.error}>{error}</p>}
                        {success && <p className={styles.success}>{success}</p>}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                            className={styles.submitBtn}
                        >
                            {loading ? 'Sending...' : 'Send Reset Instructions'}
                        </Button>

                        <p className={styles.backToLogin}>
                            Remember your password? <a href="/login">Back to Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
