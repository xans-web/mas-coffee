const mongoose = require('mongoose');
const uri = "mongodb+srv://abayadmin:abay2026@cluster0.a8swle1.mongodb.net/?appName=Cluster0";

console.log('Connecting to MongoDB...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err.message);
    process.exit(1);
  });
