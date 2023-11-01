import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log("Connected to MongoDB."))
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

export default connectMongoDB;
