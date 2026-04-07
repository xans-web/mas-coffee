const mongoose = require('mongoose');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const match = envContent.match(/MONGODB_URI=(.*)/);
const uri = match[1].trim();

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    const Settings = mongoose.models.Settings || mongoose.model('Settings', new mongoose.Schema({ _id: String, adminEmail: String }, { strict: false, collection: 'settings' }));
    
    await Settings.findOneAndUpdate(
      { _id: 'global' },
      { $set: { adminEmail: "besudani4@gmail.com" } },
      { upsert: true, new: true }
    );
    
    console.log('ADMIN EMAIL UPDATED SUCCESSFULLY TO besudani4@gmail.com');
    process.exit(0);
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
