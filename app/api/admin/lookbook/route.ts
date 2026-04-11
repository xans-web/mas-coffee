import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { LookbookItem } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    console.log("Fetching main_site_lookbook items...");
    const items = await LookbookItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Lookbook GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch lookbook" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Creating main_site_lookbook item:", body);

    if (!body.title || !body.image) {
      return NextResponse.json({ error: "Missing required fields (title, image)" }, { status: 400 });
    }

    const item = await LookbookItem.create(body);
    console.log("Lookbook item created successfully:", item._id);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Lookbook POST Error:", error);
    return NextResponse.json({ error: "Failed to create lookbook item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    console.log("Updating main_site_lookbook item:", _id, updateData);

    if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const item = await LookbookItem.findByIdAndUpdate(_id, updateData, { new: true });
    if (!item) return NextResponse.json({ error: "Lookbook item not found" }, { status: 404 });

    console.log("Lookbook item updated successfully:", _id);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Lookbook PUT Error:", error);
    return NextResponse.json({ error: "Failed to update lookbook item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Deleting main_site_lookbook item:", id);

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const result = await LookbookItem.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Lookbook item not found" }, { status: 404 });

    console.log("Lookbook item deleted successfully:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lookbook DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete lookbook item" }, { status: 500 });
  }
}
