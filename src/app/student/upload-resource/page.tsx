'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/ui/FileUpload';
import { courses } from '@/lib/sampleData';

export default function StudentUploadResourcePage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        category: 'Notes',
        file: null as File | null
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate upload
        setTimeout(() => {
            setSuccess('Resource uploaded successfully!');
            setLoading(false);
            setFormData({
                title: '',
                description: '',
                courseId: '',
                category: 'Notes',
                file: null
            });
            setTimeout(() => setSuccess(''), 3000);
        }, 1500);
    };

    return (
        <DashboardLayout role="student">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: 'var(--space-8)' }}>
                    <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
                        Upload Resource
                    </h1>
                    <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gray-medium)' }}>
                        Share notes, summaries, and projects with your classmates.
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                        <Input
                            label="Resource Title"
                            placeholder="e.g., Chapter 5 Summary"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <label style={{ fontWeight: 500, color: 'var(--color-gray-dark)' }}>Course</label>
                            <select
                                style={{
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-gray-light)',
                                    fontSize: 'var(--text-base)'
                                }}
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                required
                            >
                                <option value="">Select a course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.courseCode} - {course.courseName}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <label style={{ fontWeight: 500, color: 'var(--color-gray-dark)' }}>Category</label>
                            <select
                                style={{
                                    padding: 'var(--space-3)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-gray-light)',
                                    fontSize: 'var(--text-base)'
                                }}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Notes">Notes</option>
                                <option value="Summary">Summary</option>
                                <option value="Project">Project</option>
                                <option value="Tutorial">Tutorial</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Description"
                            placeholder="Briefly describe this resource..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            <label style={{ fontWeight: 500, color: 'var(--color-gray-dark)' }}>File</label>
                            <FileUpload
                                onFileSelect={(file) => setFormData({ ...formData, file })}
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                maxSize={10 * 1024 * 1024} // 10MB
                            />
                        </div>

                        {success && (
                            <div style={{
                                padding: 'var(--space-3)',
                                background: '#dcfce7',
                                color: '#166534',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                            }}>
                                {success}
                            </div>
                        )}

                        <Button type="submit" variant="primary" size="lg" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload Resource'}
                        </Button>
                    </form>
                </Card>
            </div>
        </DashboardLayout>
    );
}
