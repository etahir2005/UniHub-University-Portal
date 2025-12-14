'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardSubtitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { TextArea } from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import Badge from '@/components/ui/Badge';
import { formatDate, formatFileSize } from '@/lib/utils';
import { getDataForUser } from '@/lib/sampleData';
import styles from './resources.module.css';

export default function TeacherResourcesPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<string>('notes');
    const [courseCode, setCourseCode] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const data = getDataForUser(parsedUser);
            if (data) {
                setResources(data.resources);
            }
        }
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadedFile || !title || !courseCode) {
            setError('Please fill in all required fields');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            // Simulate upload
            const newResource = {
                _id: Date.now().toString(),
                title,
                description,
                category: category as any,
                courseCode,
                fileName: uploadedFile.name,
                fileUrl: '/uploads/' + uploadedFile.name,
                fileSize: uploadedFile.size,
                uploadedBy: 'Dr. Smith',
                uploadedAt: new Date().toISOString(),
            };

            setResources([newResource, ...resources]);
            setSuccess('Resource uploaded successfully!');
            setTitle('');
            setDescription('');
            setCourseCode('');
            setUploadedFile(null);
            setShowUploadForm(false);
        } catch (error: any) {
            setError(error.message || 'Failed to upload resource');
        } finally {
            setUploading(false);
        }
    };

    const filteredResources = selectedCategory === 'all'
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    const getCategoryBadge = (cat: string) => {
        const badges: any = {
            'past-paper': { status: 'pending', label: 'Past Paper' },
            'notes': { status: 'active', label: 'Notes' },
            'tutorial': { status: 'completed', label: 'Tutorial' },
            'other': { status: 'inactive', label: 'Other' },
            'Lecture Material': { status: 'active', label: 'Lecture Material' }
        };
        return badges[cat] || badges.other;
    };

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Resource Hub</h1>
                        <p className={styles.subtitle}>Upload and manage course resources for students</p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setShowUploadForm(!showUploadForm)}
                    >
                        {showUploadForm ? 'Cancel' : '+ Upload Resource'}
                    </Button>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}

                {showUploadForm && (
                    <Card className={styles.uploadCard}>
                        <CardHeader>
                            <CardTitle>Upload New Resource</CardTitle>
                            <CardSubtitle>Share study materials with your students</CardSubtitle>
                        </CardHeader>

                        <form onSubmit={handleUpload}>
                            <Input
                                label="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <TextArea
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Category *</label>
                                    <select
                                        className={styles.select}
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="notes">Notes</option>
                                        <option value="past-paper">Past Paper</option>
                                        <option value="tutorial">Tutorial</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <Input
                                    label="Course Code"
                                    value={courseCode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                    placeholder="e.g., CS101"
                                    required
                                />
                            </div>
                            <FileUpload
                                onFilesSelected={(files) => setUploadedFile(files[0])}
                                maxFiles={1}
                                maxSizeMB={10}
                                acceptedTypes={['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip']}
                                multiple={false}
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={uploading || !uploadedFile}
                            >
                                {uploading ? 'Uploading...' : 'Upload Resource'}
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Filter */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'notes' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('notes')}
                        >
                            Notes
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'past-paper' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('past-paper')}
                        >
                            Past Papers
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'tutorial' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('tutorial')}
                        >
                            Tutorials
                        </button>
                    </div>
                </div>

                {/* Resources List */}
                <div className={styles.resourcesList}>
                    {filteredResources.length === 0 ? (
                        <Card>
                            <p className={styles.emptyState}>No resources found</p>
                        </Card>
                    ) : (
                        filteredResources.map((resource) => (
                            <Card key={resource._id} className={styles.resourceCard}>
                                <div className={styles.resourceHeader}>
                                    <div>
                                        <h3 className={styles.resourceTitle}>{resource.title}</h3>
                                        <p className={styles.resourceDesc}>{resource.description}</p>
                                    </div>
                                    <Badge status={getCategoryBadge(resource.category).status}>
                                        {getCategoryBadge(resource.category).label}
                                    </Badge>
                                </div>
                                <div className={styles.resourceMeta}>
                                    <span className={styles.metaItem}>📚 {resource.courseCode}</span>
                                    <span className={styles.metaItem}>📄 {resource.fileName}</span>
                                    <span className={styles.metaItem}>💾 {formatFileSize(resource.fileSize)}</span>
                                    <span className={styles.metaItem}>📅 {formatDate(resource.uploadedAt)}</span>
                                </div>
                                <div className={styles.resourceActions}>
                                    <Button variant="outline" size="sm">
                                        Download
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
