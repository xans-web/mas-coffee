import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { SubCategory } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await SubCategory.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("SubCategories GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch sub-categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    if (!body.name || !body.parentSection || !body.coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const category = await SubCategory.create(body);
    return NextResponse.json(category);
  } catch (error) {
    console.error("SubCategories POST Error:", error);
    return NextResponse.json({ error: "Failed to create sub-category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    
    if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const category = await SubCategory.findByIdAndUpdate(_id, updateData, { new: true });
    if (!category) return NextResponse.json({ error: "Sub-Category not found" }, { status: 404 });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("SubCategories PUT Error:", error);
    return NextResponse.json({ error: "Failed to update sub-category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const result = await SubCategory.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Sub-Category not found" }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SubCategories DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete sub-category" }, { status: 500 });
  }
}
