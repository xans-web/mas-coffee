const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://abayadmin:abay2026@ac-47yb1qo-shard-00-00.a8swle1.mongodb.net:27017,ac-47yb1qo-shard-00-01.a8swle1.mongodb.net:27017,ac-47yb1qo-shard-00-02.a8swle1.mongodb.net:27017/?ssl=true&replicaSet=atlas-9kkfk2-shard-0&authSource=admin&appName=Cluster0";

async function test() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const settings = await db.collection('settings').findOne({ _id: 'global' });
    console.log("Global Settings:", settings);
    
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

test();
