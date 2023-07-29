import mongoose from 'mongoose';

export const connectDB = async () => {
    mongoose.set('strictQuery', false);
    const uri = process.env.MONGODB_URI;
    const dbName = 'captaincy';

    try {
        const { connection } = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connected with ${connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}