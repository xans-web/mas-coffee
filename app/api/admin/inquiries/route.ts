import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { ContactInquiry } from '@/lib/models';

export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await ContactInquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Inquiries GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    const inquiry = await ContactInquiry.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error("Inquiries PUT Error:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await ContactInquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inquiries DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}
