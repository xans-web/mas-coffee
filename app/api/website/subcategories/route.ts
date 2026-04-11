import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { SubCategory } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const subCategories = await SubCategory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(subCategories);
  } catch (error) {
    console.error("Website SubCategories GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch sub-categories' }, { status: 500 });
  }
}
