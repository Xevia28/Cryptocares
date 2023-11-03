// Donation Schema : This will be used to store the details of donations
const mongoose = require("mongoose")

const donationSchema = new mongoose.Schema({
    transaction_hash: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    amount: {
        type: Number,
        required: true
    },
    // donor: {
    //     type: String,
    //     required: [true, "Please provide sender's wallet address!"],
    // },
    // project: {
    //     type: String,
    //     required: [true, "Please provide project's wallet address!"],
    // },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('User').findById(v);
                return project !== null;
            },
            message: props => `${props.value} is not a valid user ID`
        }
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('Project').findById(v);
                return project !== null;
            },
            message: props => `${props.value} is not a valid project ID`
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Donation = mongoose.models.Donation || mongoose.model("Donation", donationSchema);
export default Donation;