import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Settings } from '@/lib/models';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    let settings = await Settings.findById('global');
    
    if (!settings) {
      settings = new Settings({ _id: 'global', adminEmail: 'admin@abayhotel.com' });
    }
    
    // Check if entered email matches admin email
    const configuredAdminEmail = settings.adminEmail || 'admin@abayhotel.com';
    
    if (email !== configuredAdminEmail) {
      // Return success anyway to avoid email enumeration attacks
      return NextResponse.json({ success: true, message: 'If email exists, OTP sent.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    settings.resetOtp = otp;
    settings.resetOtpExpiry = expiry;
    await settings.save();

    // Setup Nodemailer (using Gmail if configured, ethereal fallback otherwise)
    let transporter;
    
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`[AUTH] Configuring Gmail SMTP for: ${process.env.EMAIL_USER}`);
      transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.log('[AUTH] No EMAIL_USER found in .env.local. Falling back to Ethereal.');
      // Fallback for dev: Ethereal (creates a mock email inbox)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user, 
          pass: testAccount.pass, 
        },
      });
    }

    console.log(`[AUTH] Attempting to send OTP email to ${email}...`);
    try {
      const info = await transporter.sendMail({
        from: `"Abay Restaurant Admin" <${process.env.EMAIL_USER || 'admin@abayhotel.com'}>`,
        to: email,
        subject: "Your Admin Password Reset OTP",
        text: `Your OTP is: ${otp}. It will expire in 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #D4AF37;">Abay Restaurant Dashboard Admin</h2>
            <p>You requested a password reset. Here is your 6-digit One Time Password (OTP):</p>
            <h1 style="letter-spacing: 5px; color: #1a1a1a; background: #f4f4f4; padding: 10px; display: inline-block; border-radius: 5px;">${otp}</h1>
            <p>This code will expire in 15 minutes.</p>
            <p style="font-size: 12px; color: #888; mt: 20px;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      });
      console.log("[AUTH] OTP Email sent successfully! MessageId: %s", info.messageId);
      
      // Log preview URL if using ethereal email
      if (!process.env.EMAIL_USER) {
        console.log("[AUTH] Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
    } catch (mailError: any) {
      console.error("\n================= EMAIL SENDING FAILED =================");
      console.error(mailError);
      console.error("========================================================\n");
      // Optionally return the error to the client for debugging during dev
      return NextResponse.json({ error: 'Failed to send email. Check server logs.', details: mailError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' });
  } catch (error: any) {
    console.error('Password reset overall error:', error);
    return NextResponse.json({ error: 'Failed to process request', details: error.message }, { status: 500 });
  }
}
