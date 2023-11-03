// Project Schema : This will be used to store the details of project created on the platform
const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    wallet_addr: {
        type: String,
        required: [true, "Please provide a wallet address!"],
        unique: true,
        // lowercase: true,
    },
    seed: {
        type: String,
        required: [true, "Please provide your seed value!"],
        unique: true,
    },
    targetAmount: {
        type: Number,
        required: true
    },
    amountRaised: {
        type: Number,
        default: 0
    },
    photo: {
        type: String,
        required: [true, "Provide a photo to help people visualize"]
    },
    location: {
        type: String,
        required: [true, "Please provide the location where you're fundraising"]
    },
    status: {
        type: String,
        enum: ["pending", "approved", "completed"],
        default: "pending"
    },
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date,
        required: [true, "Please provide the end date for the project"]
    },
    beneficiary: {
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
    // donors: an array of references to the users who have donated to the project
    // donors: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     validate: {
    //         validator: async function (v) {
    //             const project = await mongoose.model('User').findById(v);
    //             return project !== null;
    //         },
    //         message: props => `${props.value} is not a valid user ID`
    //     }
    // }],
    // serviceRequests: an array of ServiceRequest objects that the user has made or received
    serviceRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        validate: {
            validator: async function (v) {
                const request = await mongoose.model('Request').findById(v);
                return request !== null;
            },
            message: props => `${props.value} is not a valid request ID`
        }
    }]
});

projectSchema.pre("save", function (next) {
    if (this.amountRaised >= this.targetAmount) {
        this.status = "completed";
    }
    next();
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;