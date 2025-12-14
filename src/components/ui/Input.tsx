'use client';

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className={styles.formGroup}>
            {label && <label className={styles.formLabel}>{label}</label>}
            <input className={`${styles.formInput} ${className}`} {...props} />
            {error && <p className={styles.formError}>{error}</p>}
        </div>
    );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
    return (
        <div className={styles.formGroup}>
            {label && <label className={styles.formLabel}>{label}</label>}
            <textarea className={`${styles.formTextarea} ${className}`} {...props} />
            {error && <p className={styles.formError}>{error}</p>}
        </div>
    );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
    return (
        <div className={styles.formGroup}>
            {label && <label className={styles.formLabel}>{label}</label>}
            <select className={`${styles.formSelect} ${className}`} {...props}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className={styles.formError}>{error}</p>}
        </div>
    );
}
