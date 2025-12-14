'use client';

import React, { useState } from 'react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    multiple?: boolean;
}

export default function FileUpload({
    onFilesSelected,
    maxFiles = 5,
    maxSizeMB = 10,
    acceptedTypes = [],
    multiple = true,
}: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState('');

    const validateFiles = (files: File[]): boolean => {
        setError('');

        if (files.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`);
            return false;
        }

        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        for (const file of files) {
            if (file.size > maxSizeBytes) {
                setError(`File "${file.name}" exceeds ${maxSizeMB}MB limit`);
                return false;
            }

            if (acceptedTypes.length > 0) {
                const fileExt = file.name.split('.').pop()?.toLowerCase();
                if (!fileExt || !acceptedTypes.includes(`.${fileExt}`)) {
                    setError(`File type .${fileExt} not allowed`);
                    return false;
                }
            }
        }

        return true;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        if (validateFiles(fileArray)) {
            setSelectedFiles(fileArray);
            onFilesSelected(fileArray);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesSelected(newFiles);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.dropzone} ${dragActive ? styles.active : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className={styles.input}
                    onChange={handleChange}
                    multiple={multiple}
                    accept={acceptedTypes.join(',')}
                />
                <label htmlFor="file-upload" className={styles.label}>
                    <div className={styles.icon}>📁</div>
                    <p className={styles.text}>
                        <span className={styles.highlight}>Click to upload</span> or drag and drop
                    </p>
                    <p className={styles.hint}>
                        {acceptedTypes.length > 0 ? acceptedTypes.join(', ') : 'Any file type'}
                        {' '}(Max {maxSizeMB}MB per file)
                    </p>
                </label>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {selectedFiles.length > 0 && (
                <div className={styles.fileList}>
                    <h4 className={styles.fileListTitle}>Selected Files ({selectedFiles.length})</h4>
                    {selectedFiles.map((file, index) => (
                        <div key={index} className={styles.fileItem}>
                            <div className={styles.fileInfo}>
                                <span className={styles.fileName}>📄 {file.name}</span>
                                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                            </div>
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeFile(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
