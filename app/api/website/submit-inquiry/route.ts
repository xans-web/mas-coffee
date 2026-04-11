import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { ContactInquiry } from '@/lib/models';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const newInquiry = new ContactInquiry({
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      subject: body.subject || "",
      message: body.message,
      status: 'new',
      createdAt: new Date()
    });

    await newInquiry.save();

    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error("Public Inquiry POST Error:", error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
