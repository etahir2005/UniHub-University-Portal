import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // In a real app, you would:
        // 1. Check if user exists
        // 2. Generate a reset token
        // 3. Save token to database with expiry
        // 4. Send email with reset link

        // For development, we'll just simulate success
        console.log(`Password reset requested for: ${email}`);
        console.log(`Reset link: http://localhost:3000/reset-password?token=mock-token-${Date.now()}`);

        return NextResponse.json({
            message: 'Password reset instructions sent to email',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}
