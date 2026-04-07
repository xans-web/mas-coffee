const fs = require('fs');
const mongoose = require('mongoose');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error("No MONGODB_URI found");
  process.exit(1);
}
const uri = match[1].trim();

console.log('Connecting to MongoDB...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({}, { strict: false, collection: 'settings' }));
    
    const result = await Settings.findOneAndUpdate(
      { _id: 'global' },
      { $set: { adminPassword: '1234' } },
      { upsert: true, new: true }
    );
    console.log('Success! Password set to 1234.');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
