const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('Service').findById(v);
                return project !== null;
            },
            message: props => `${props.value} is not a valid service ID`
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
            message: props => `${props.value} is not a user project ID`
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: [true, "Please provide the amount incurred for the service"]
    }
});

const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);
export default Request;