import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { MenuSection } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET: Fetch all menu sections from MongoDB.
 * No local JSON fallback.
 */
export async function GET() {
  try {
    await connectToDatabase();
    const menu = await MenuSection.find({}).select('-_id -__v -items._id').lean();
    return NextResponse.json(menu, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read menu data' }, { status: 500 });
  }
}

/**
 * POST: Atomic Category/Section operations.
 * action: 'addCategory' | 'renameCategory' | 'deleteCategory'
 */
export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    switch (action) {
      case 'addCategory': {
        const { categoryName } = payload;
        const id = categoryName.toLowerCase().replace(/\s+/g, '-');
        await MenuSection.findOneAndUpdate(
          { id: id },
          { 
            $set: { 
              category_en: categoryName,
              category_am: categoryName,
              id: id,
              items: []
            } 
          },
          { upsert: true, new: true }
        );
        break;
      }
      case 'renameCategory': {
        const { categoryId, newName } = payload;
        await MenuSection.updateOne(
          { id: categoryId },
          { $set: { category_en: newName, category_am: newName } }
        );
        return NextResponse.json({ success: true });
      }
      case 'deleteCategory': {
        const { categoryId } = payload; // This is the 'id' field from your MongoDB screenshot
        await MenuSection.deleteOne({ id: categoryId });
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: 'Invalid Category Action' }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process category' }, { status: 500 });
  }
}

/**
 * PUT: Atomic Item operations (Update or Add).
 * action: 'upsertItem' (takes categoryId and item data)
 */
export async function PUT(request: Request) {
  try {
    const { action, payload } = await request.json();
    await connectToDatabase();

    if (action === 'upsertItem') {
      const { categoryId, item } = payload;
      // If item has no ID, it's a new item (Add)
      if (!item.id) {
        const newItem = { ...item, id: Date.now() };
        await MenuSection.updateOne(
          { id: categoryId },
          { $push: { items: newItem } }
        );
      } else {
        // Existing item (Update)
        await MenuSection.updateOne(
          { id: categoryId, "items.id": item.id },
          { $set: { "items.$": item } }
        );
      }
    } else {
      return NextResponse.json({ error: 'Invalid Item Action' }, { status: 400 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

/**
 * DELETE: Atomic Item removal.
 * payload: { itemId, categoryId }
 */
export async function DELETE(request: Request) {
  try {
    const { itemId, categoryId } = await request.json();
    await connectToDatabase();

    await MenuSection.updateOne(
      { id: categoryId },
      { $pull: { items: { id: itemId } } }
    );

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
