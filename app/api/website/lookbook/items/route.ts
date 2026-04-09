import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { LookbookItem } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const items = await LookbookItem.find({}).lean();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    switch (action) {
      case 'add':
        const newItem = new LookbookItem({ ...payload, id: Date.now() });
        await newItem.save();
        break;
      case 'update':
        await LookbookItem.findOneAndUpdate({ id: payload.id }, payload);
        break;
      case 'delete':
        await LookbookItem.deleteOne({ id: payload.id });
        break;
      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process item request' }, { status: 500 });
  }
}
