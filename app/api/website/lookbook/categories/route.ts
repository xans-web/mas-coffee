import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { LookbookCategory } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await LookbookCategory.find({}).lean();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    switch (action) {
      case 'add':
        const id = payload.name.toLowerCase().replace(/\s+/g, '-');
        const newCategory = new LookbookCategory({ name: payload.name, id });
        await newCategory.save();
        break;
      case 'delete':
        await LookbookCategory.deleteOne({ id: payload.id });
        break;
      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process category request' }, { status: 500 });
  }
}
