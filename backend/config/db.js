import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dormquest';
    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.warn(`Local MongoDB at ${mongoUri} not reachable: ${error.message}`);
        console.log('Starting embedded in-memory MongoDB instance for development/testing...');
        
        try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const memoryUri = mongod.getUri();
            const conn = await mongoose.connect(memoryUri);
            console.log(`✓ Connected to Embedded MongoDB: ${memoryUri}`);

            // Automatically populate initial data into in-memory instance
            const { seedInitialData } = await import('../seed.js');
            if (seedInitialData) {
                console.log('Auto-populating database with hostels, users, and bookings...');
                await seedInitialData();
            }

            return conn;
        } catch (memError) {
            console.error(`Database initialization error: ${memError.message}`);
            console.error('Make sure MongoDB is installed and running locally, or specify a valid MONGO_URI in .env');
            process.exit(1);
        }
    }
};

export default connectDB;
