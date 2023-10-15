import mongoose from "mongoose";

const connectMongoDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Mongo Database.");
    } catch (err) {
        console.log(err);
    }
}

export default connectMongoDB;