// Service Schema : This will be used to store the details of services created by the providers
const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a service name"]
    },
    description: {
        type: String,
        required: [true, "Provide a description of your service"]
    },
    location: {
        type: String,
        required: [true, "Please provide the location where the services will be available"]
    },
    photo: {
        type: String,
        required: [true, "Provide a photo to help people visualize"]
    },
    pricePerDay: {
        type: Number,
        required: [true, "Please provide the price of your service for a day"]
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    provider: {
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
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('Project').findById(v);
                return project !== null;
            },
            message: props => `${props.value} is not a valid project ID`
        }
    }],
});

const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default Service;