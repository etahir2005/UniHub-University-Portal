import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // In a real app, you would:
        // 1. Verify token from database
        // 2. Check if token is expired
        // 3. Get user ID from token
        // 4. Hash new password
        // 5. Update user password
        // 6. Delete/invalidate token

        // For development, we'll simulate success
        // In production, you'd validate the token against your database
        if (!token.startsWith('mock-token-')) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // In a real app, you would update the user's password here
        console.log(`Password reset successful for token: ${token}`);
        console.log(`New hashed password: ${hashedPassword.substring(0, 20)}...`);

        return NextResponse.json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        );
    }
}
