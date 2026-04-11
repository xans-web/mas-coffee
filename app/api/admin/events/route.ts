import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Event } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    console.log("Fetching main_site_events...");
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Events GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Creating main_site_event:", body);

    if (!body.name || !body.date || !body.description || !body.image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await Event.create(body);
    console.log("Event created successfully:", event._id);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Events POST Error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    console.log("Updating main_site_event:", _id, updateData);

    if (!_id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const event = await Event.findByIdAndUpdate(_id, updateData, { new: true });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    console.log("Event updated successfully:", _id);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Events PUT Error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log("Deleting main_site_event:", id);

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const result = await Event.findByIdAndDelete(id);
    if (!result) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    console.log("Event deleted successfully:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Events DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
