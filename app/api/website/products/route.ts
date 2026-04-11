import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { MainSiteProduct } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const products = await MainSiteProduct.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Website Products GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch website products' }, { status: 500 });
  }
}
