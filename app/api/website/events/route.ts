import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Event } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(events);
  } catch (error) {
    console.error("Website Events GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch website events' }, { status: 500 });
  }
}
