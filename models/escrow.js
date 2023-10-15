const mongoose = require("mongoose")

const escrowSchema = new mongoose.Schema({
    account: {
        type: String,
        required: [true, "Provide who created the escrow!"],
        lowercase: true
    },
    destination: {
        type: String,
        required: [true, "Provide with who this was created!"],
        lowercase: true
    },
    amount: {
        type: Number,
        required: [true, "Provide the amount!"]
    },
    sequence: {
        type: String,
        required: [true, "Give the sequence number"],
        unique: true,
    },
    transactionType: {
        type: String,
        enum: ["EscrowCreate", "EscrowFinish"],
        required: true
    },
    condition: {
        type: String,
        required: [true, "Provide the condition"]
    },
    fulfillment: {
        type: String,
        unique: true
    }
});

const Escrow = mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);
export default Escrow;