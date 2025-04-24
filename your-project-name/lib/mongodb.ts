// lib/mongodb.ts
import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

const options = {
  appName: 'devrel.template.nextjs',
  // Add more Mongoose-specific options here if needed
};

interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Augment globalThis to include our custom mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseGlobal['mongoose'];
}

// Avoid reinitializing in dev hot reload
global.mongoose ??= { conn: null, promise: null };

async function connectToDatabase() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(uri, options).then((mongoose) => mongoose);
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectToDatabase;
