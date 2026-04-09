import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { MainHero } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const heroes = await MainHero.find({}).sort({ order: 1 }).lean();
    return NextResponse.json(heroes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    switch (action) {
      case 'add':
        const newHero = new MainHero({ ...payload, id: Date.now().toString() });
        await newHero.save();
        break;
      case 'update':
        await MainHero.findOneAndUpdate({ id: payload.id }, payload);
        break;
      case 'delete':
        await MainHero.deleteOne({ id: payload.id });
        break;
      case 'reorder':
        const { orders } = payload; // Array of {id, order}
        const promises = orders.map((item: {id: string, order: number}) => 
          MainHero.updateOne({ id: item.id }, { $set: { order: item.order } })
        );
        await Promise.all(promises);
        break;
      default:
        return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process hero request' }, { status: 500 });
  }
}
