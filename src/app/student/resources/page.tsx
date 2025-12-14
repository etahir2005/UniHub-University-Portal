'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, formatFileSize } from '@/lib/utils';
import styles from './resources.module.css';

interface Resource {
    _id: string;
    title: string;
    description: string;
    category: 'past-paper' | 'notes' | 'tutorial' | 'sample-project';
    courseCode: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedBy: string;
    uploadedAt: string;
}

const sampleResources: Resource[] = [
    {
        _id: '1',
        title: 'CS101 Midterm Exam 2023',
        description: 'Past paper with solutions',
        category: 'past-paper',
        courseCode: 'CS101',
        fileName: 'CS101_Midterm_2023.pdf',
        fileUrl: '/uploads/sample.pdf',
        fileSize: 2500000,
        uploadedBy: 'Dr. Smith',
        uploadedAt: new Date().toISOString(),
    },
    {
        _id: '2',
        title: 'Data Structures Complete Notes',
        description: 'Comprehensive notes for all chapters',
        category: 'notes',
        courseCode: 'CS303',
        fileName: 'DS_Complete_Notes.pdf',
        fileUrl: '/uploads/sample.pdf',
        fileSize: 5200000,
        uploadedBy: 'Dr. Johnson',
        uploadedAt: new Date().toISOString(),
    },
    {
        _id: '3',
        title: 'Web Development Tutorial',
        description: 'HTML, CSS, JavaScript basics',
        category: 'tutorial',
        courseCode: 'CS202',
        fileName: 'Web_Dev_Tutorial.pdf',
        fileUrl: '/uploads/sample.pdf',
        fileSize: 1800000,
        uploadedBy: 'Dr. Smith',
        uploadedAt: new Date().toISOString(),
    },
    {
        _id: '4',
        title: 'E-Commerce Website Project',
        description: 'Sample full-stack project',
        category: 'sample-project',
        courseCode: 'CS202',
        fileName: 'Ecommerce_Project.zip',
        fileUrl: '/uploads/sample.zip',
        fileSize: 8500000,
        uploadedBy: 'Student Contributor',
        uploadedAt: new Date().toISOString(),
    },
    {
        _id: '5',
        title: 'CS303 Final Exam 2022',
        description: 'Past paper for final examination',
        category: 'past-paper',
        courseCode: 'CS303',
        fileName: 'CS303_Final_2022.pdf',
        fileUrl: '/uploads/sample.pdf',
        fileSize: 3200000,
        uploadedBy: 'Dr. Johnson',
        uploadedAt: new Date().toISOString(),
    },
    {
        _id: '6',
        title: 'Algorithm Analysis Notes',
        description: 'Big O notation and complexity analysis',
        category: 'notes',
        courseCode: 'CS303',
        fileName: 'Algorithm_Notes.pdf',
        fileUrl: '/uploads/sample.pdf',
        fileSize: 2100000,
        uploadedBy: 'Dr. Johnson',
        uploadedAt: new Date().toISOString(),
    },
];

export default function StudentResourcesPage() {
    const [resources] = useState<Resource[]>(sampleResources);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredResources = selectedCategory === 'all'
        ? resources
        : resources.filter(r => r.category === selectedCategory);

    const getCategoryBadge = (cat: string) => {
        const badges: any = {
            'past-paper': { status: 'pending', label: 'Past Paper' },
            'notes': { status: 'active', label: 'Notes' },
            'tutorial': { status: 'completed', label: 'Tutorial' },
            'sample-project': { status: 'inactive', label: 'Sample Project' },
        };
        return badges[cat] || badges.notes;
    };

    const handleDownload = (fileUrl: string, fileName: string) => {
        // Simulate download
        console.log(`Downloading: ${fileName}`);
    };

    return (
        <DashboardLayout role="student">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Resource Hub</h1>
                        <p className={styles.subtitle}>Access study materials, past papers, and tutorials</p>
                    </div>
                </div>

                {/* Category Filter */}
                <div className={styles.filterSection}>
                    <div className={styles.filterButtons}>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            📚 All Resources
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'notes' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('notes')}
                        >
                            📝 Notes
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'past-paper' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('past-paper')}
                        >
                            📄 Past Papers
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'tutorial' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('tutorial')}
                        >
                            🎓 Tutorials
                        </button>
                        <button
                            className={`${styles.filterBtn} ${selectedCategory === 'sample-project' ? styles.filterActive : ''}`}
                            onClick={() => setSelectedCategory('sample-project')}
                        >
                            💻 Sample Projects
                        </button>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className={styles.resourcesGrid}>
                    {filteredResources.length === 0 ? (
                        <Card>
                            <p className={styles.emptyState}>No resources found</p>
                        </Card>
                    ) : (
                        filteredResources.map((resource) => (
                            <Card key={resource._id} className={styles.resourceCard}>
                                <div className={styles.resourceHeader}>
                                    <Badge status={getCategoryBadge(resource.category).status}>
                                        {getCategoryBadge(resource.category).label}
                                    </Badge>
                                    <span className={styles.courseCode}>{resource.courseCode}</span>
                                </div>
                                <h3 className={styles.resourceTitle}>{resource.title}</h3>
                                <p className={styles.resourceDesc}>{resource.description}</p>
                                <div className={styles.resourceMeta}>
                                    <span className={styles.metaItem}>📄 {resource.fileName}</span>
                                    <span className={styles.metaItem}>💾 {formatFileSize(resource.fileSize)}</span>
                                </div>
                                <div className={styles.resourceFooter}>
                                    <span className={styles.uploadedBy}>By {resource.uploadedBy}</span>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleDownload(resource.fileUrl, resource.fileName)}
                                    >
                                        Download
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
