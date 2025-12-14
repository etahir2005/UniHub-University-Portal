'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getDataForUser, submissions } from '@/lib/sampleData';
import styles from './profile.module.css';

export default function TeacherProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        phone: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setFormData({
                firstName: parsed.firstName || '',
                lastName: parsed.lastName || '',
                email: parsed.email || '',
                department: parsed.department || 'Computer Science',
                phone: parsed.phone || '+1 (555) 123-4567',
            });

            const data = getDataForUser(parsed);
            if (data) {
                setCourses(data.courses);
                setAssignments(data.assignments);
            }
        }
    }, []);

    const handleSave = () => {
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
    };

    const totalSubmissions = assignments.reduce((acc, curr) => {
        return acc + submissions.filter(s => s.assignmentId === curr._id).length;
    }, 0);

    const stats = {
        coursesTeaching: courses.length,
        totalAssignments: assignments.length,
        totalSubmissions: totalSubmissions,
        recentAnnouncements: 8,
    };

    return (
        <DashboardLayout role="teacher">
            <div className={styles.container}>
                <h1 className={styles.title}>My Profile</h1>

                <Card className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.avatar}>
                            {formData.firstName[0]}{formData.lastName[0]}
                        </div>
                        <div className={styles.profileInfo}>
                            <h2 className={styles.name}>
                                {formData.firstName} {formData.lastName}
                            </h2>
                            <p className={styles.role}>👨‍🏫 Teacher</p>
                            <p className={styles.department}>📚 {formData.department} Department</p>
                        </div>
                        <Button
                            variant={isEditing ? 'outline' : 'primary'}
                            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>

                    {isEditing ? (
                        <div className={styles.editForm}>
                            <div className={styles.formRow}>
                                <Input
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                                <Input
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <Input
                                label="Department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <Button variant="primary" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.profileDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Email:</span>
                                <span className={styles.detailValue}>{formData.email}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Department:</span>
                                <span className={styles.detailValue}>{formData.department}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailLabel}>Phone:</span>
                                <span className={styles.detailValue}>{formData.phone}</span>
                            </div>
                        </div>
                    )}
                </Card>

                <div className={styles.statsGrid}>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📚</div>
                        <div className={styles.statValue}>{stats.coursesTeaching}</div>
                        <div className={styles.statLabel}>Courses Teaching</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📝</div>
                        <div className={styles.statValue}>{stats.totalAssignments}</div>
                        <div className={styles.statLabel}>Total Assignments</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📥</div>
                        <div className={styles.statValue}>{stats.totalSubmissions}</div>
                        <div className={styles.statLabel}>Total Submissions</div>
                    </Card>
                    <Card className={styles.statCard}>
                        <div className={styles.statIcon}>📢</div>
                        <div className={styles.statValue}>{stats.recentAnnouncements}</div>
                        <div className={styles.statLabel}>Announcements Posted</div>
                    </Card>
                </div>

                <Card className={styles.coursesCard}>
                    <CardHeader>
                        <CardTitle>Courses Teaching</CardTitle>
                    </CardHeader>
                    <div className={styles.coursesList}>
                        {courses.length === 0 ? (
                            <p className={styles.emptyState}>No courses assigned.</p>
                        ) : (
                            courses.map(course => (
                                <div key={course._id} className={styles.courseItem}>
                                    <div className={styles.courseCode}>{course.courseCode}</div>
                                    <div className={styles.courseName}>{course.courseName}</div>
                                    <div className={styles.courseStudents}>
                                        {course.enrolledStudents?.length || 0} students
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
