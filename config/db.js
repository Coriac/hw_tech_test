const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

async function connectToMongo() {
  try {
    console.log(`MONGO_URI ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Quitte l'app si la connexion échoue
  }
}

module.exports = connectToMongo;
