const mongoose = require('mongoose');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/MONGODB_URI=(.*)/);
const uri = match[1].trim();

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({ _id: String, resetOtp: String, resetOtpExpiry: Date, adminEmail: String }, { strict: false, collection: 'settings' }));
    
    const otp = "123456";
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    
    await Settings.findOneAndUpdate(
      { _id: 'global' },
      { $set: { resetOtp: otp, resetOtpExpiry: expiry, adminEmail: "admin@abayhotel.com" } },
      { upsert: true, new: true }
    );
    
    console.log('OTP SEEDED SUCCESSFULLY');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
