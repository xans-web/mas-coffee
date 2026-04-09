import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Announcement } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const announcements = await Announcement.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    switch (action) {
      case 'add':
        const newAnnouncement = new Announcement({ ...payload, id: Date.now().toString() });
        await newAnnouncement.save();
        break;
      case 'update':
        await Announcement.findOneAndUpdate({ id: payload.id }, payload);
        break;
      case 'delete':
        await Announcement.deleteOne({ id: payload.id });
        break;
      case 'toggle':
        const announcement = await Announcement.findOne({ id: payload.id });
        if (announcement) {
          announcement.isActive = !announcement.isActive;
          await announcement.save();
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process announcement request' }, { status: 500 });
  }
}
