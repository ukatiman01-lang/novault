import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = body.email?.toString().trim().toLowerCase()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      )
    }

    try {
      await db.waitlist.create({ data: { email } })
    } catch {
      return NextResponse.json(
        { success: false, error: 'This email is already on the waitlist.' },
        { status: 409 }
      )
    }

    const count = await db.waitlist.count()

    return NextResponse.json({ success: true, count })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const count = await db.waitlist.count()
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
