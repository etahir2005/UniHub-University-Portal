import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { comparePassword, generateToken } from '@/lib/auth';
import { users } from '@/lib/sampleData';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const sampleUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);

        if (sampleUser) {
            if (sampleUser.password === password) {
                const token = generateToken({
                    userId: sampleUser._id,
                    email: sampleUser.email,
                    role: sampleUser.role,
                });

                return NextResponse.json({
                    message: 'Login successful',
                    token,
                    user: sampleUser,
                });
            } else {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }
        }

        try {
            await connectDB();
            const user = await User.findOne({ email: email.toLowerCase() });

            if (user) {
                if (user.role !== role) {
                    return NextResponse.json(
                        { error: 'Invalid role for this account' },
                        { status: 401 }
                    );
                }

                const isPasswordValid = await comparePassword(password, user.password);
                if (!isPasswordValid) {
                    return NextResponse.json(
                        { error: 'Invalid credentials' },
                        { status: 401 }
                    );
                }

                const token = generateToken({
                    userId: user._id.toString(),
                    email: user.email,
                    role: user.role,
                });

                return NextResponse.json({
                    message: 'Login successful',
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        studentId: user.studentId,
                        employeeId: user.employeeId,
                    },
                });
            }
        } catch (dbError) {
            console.warn('Database connection failed, relying only on sample data', dbError);
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
