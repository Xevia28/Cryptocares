const mongoose = require("mongoose")

const escrowSchema = new mongoose.Schema({
    account: {
        type: String,
        required: [true, "Provide who created the escrow!"],
    },
    destination: {
        type: String,
        required: [true, "Provide with who this was created!"],
    },
    amount: {
        type: Number,
        required: [true, "Provide the amount!"]
    },
    sequence: {
        type: String,
        required: [true, "Give the sequence number"],
    },
    condition: {
        type: String,
        required: [true, "Provide the condition"],
        unique: true
    },
    fulfillment: {
        type: String,
        required: [true, "Provide the fulfillment"],
        unique: true
    },
    cancelAfter: {
        type: Number,
        required: [true, "Please provide the cancel date"]
    },
    status: {
        type: String,
        enum: ["pending", "active", "cancelled", "finished"],
        default: "pending"
    },
    escrowTx: {
        type: Object,
        required: [true, "Provide the escrowTx!"]
    }
});

const Escrow = mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);
export default Escrow;