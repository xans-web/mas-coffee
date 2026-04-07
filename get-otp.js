const mongoose = require('mongoose');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}
const uri = match[1].trim();

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({ _id: String, resetOtp: String }, { strict: false, collection: 'settings' }));
    
    const data = await Settings.findOne({ _id: 'global' });
    if (data && data.resetOtp) {
      console.log('--- OTP FOUND ---');
      console.log('Your 6-digit OTP is:', data.resetOtp);
      console.log('-----------------');
    } else {
      console.log('No OTP found in the database. Did the request succeed?');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
