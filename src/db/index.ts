import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        if (!MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        await mongoose.connect(MONGO_URI, {
            dbName: 'ecommerce-api',
        });

        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}
