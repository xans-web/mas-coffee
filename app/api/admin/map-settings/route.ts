import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { SiteSettings } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findById('site_settings');
    if (!settings) {
      settings = await SiteSettings.create({ _id: 'site_settings' });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Site Settings GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const settings = await SiteSettings.findByIdAndUpdate(
      'site_settings',
      { ...body, lastUpdated: new Date() },
      { new: true, upsert: true }
    );
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Site Settings POST Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
