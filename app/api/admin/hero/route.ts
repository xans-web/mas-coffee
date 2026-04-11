import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { MainHero } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    console.log("Fetching main_site_hero slides...");
    const heroes = await MainHero.find({}).sort({ order: 1 });
    return NextResponse.json(heroes);
  } catch (error) {
    console.error("Hero GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch heroes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Creating main_site_hero slide:", body);

    if (!body.title || !body.image) {
      return NextResponse.json({ error: "Missing required fields (title, image)" }, { status: 400 });
    }

    const id =
      typeof body.id === "string" && body.id.length > 0
        ? body.id
        : `hero_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    const hero = await MainHero.create({
      id,
      title: body.title,
      subtitle: body.subtitle ?? "",
      image: body.image,
      order: typeof body.order === "number" ? body.order : 0,
    });
    console.log("Hero slide created successfully:", hero._id);
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Hero POST Error:", error);
    return NextResponse.json({ error: "Failed to create hero" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    console.log("Updating main_site_hero slide:", _id, updateData);

    if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const hero = await MainHero.findByIdAndUpdate(_id, updateData, { new: true });
    if (!hero) return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });

    console.log("Hero slide updated successfully:", _id);
    return NextResponse.json(hero);
  } catch (error) {
    console.error("Hero PUT Error:", error);
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Deleting main_site_hero slide:", id);

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const result = await MainHero.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });

    console.log("Hero slide deleted successfully:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete hero" }, { status: 500 });
  }
}
