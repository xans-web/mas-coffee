import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { SiteSettings } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne({ _id: 'site_settings' }).lean();
    
    if (!settings) {
      settings = {
        mapLatitude: "9.0227",
        mapLongitude: "38.7460",
        lastUpdated: new Date()
      };
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Public Site Settings GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}
