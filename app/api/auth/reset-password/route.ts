import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Settings } from '@/lib/models';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Email, OTP, and New Password are required' }, { status: 400 });
    }

    await connectToDatabase();
    const settings = await Settings.findById('global');
    
    if (!settings) return NextResponse.json({ error: 'System unconfigured' }, { status: 500 });

    const configuredAdminEmail = settings.adminEmail || 'admin@abayhotel.com';
    
    // Validate Email
    if (email !== configuredAdminEmail) {
      return NextResponse.json({ error: 'Invalid OTP or Email' }, { status: 401 });
    }

    // Validate OTP presence and match
    if (!settings.resetOtp || settings.resetOtp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    // Validate Expiry
    if (!settings.resetOtpExpiry || new Date() > settings.resetOtpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 401 });
    }

    // All validations passed. Update password and clear OTP
    settings.adminPassword = newPassword;
    settings.resetOtp = null;
    settings.resetOtpExpiry = null;
    
    await settings.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset verify error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
