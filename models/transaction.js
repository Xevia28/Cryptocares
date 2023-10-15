const mongoose = require("mongoose")

const transactionsSchema = new mongoose.Schema({
    transaction_hash: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    amount: {
        type: Number,
        required: [true, "Please provide the amount!"]
    },
    from: {
        type: String,
        required: [true, "Please provide sender's wallet address!"],
    },
    to: {
        type: String,
        required: [true, "Please provide receiver's wallet address!"],
    },
    createdAt: {
        type: String,
        default: Date.now
    }
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionsSchema);
export default Transaction;