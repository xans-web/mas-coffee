import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Inquiry } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    switch (action) {
      case 'updateStatus':
        await Inquiry.findOneAndUpdate({ id: payload.id }, { status: payload.status });
        break;
      case 'delete':
        await Inquiry.deleteOne({ id: payload.id });
        break;
      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process inquiry request' }, { status: 500 });
  }
}
