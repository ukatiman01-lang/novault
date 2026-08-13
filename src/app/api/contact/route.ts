import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format.' },
        { status: 400 }
      );
    }

    // In production, this would send to an email service or CRM
    // For now, we acknowledge receipt
    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. Our team will respond within 24 hours.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
