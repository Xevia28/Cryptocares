// Proof Schema : This will be used to store the image of the proof of eligibility
const mongoose = require("mongoose")

const proof_of_need = new mongoose.Schema({
    photo: {
        type: String,
        required: [true, "Provide a photo to prove you are legitimate"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('User').findById(v);
                return project !== null;
            },
            message: props => `${props.value} is not a valid user ID`
        }
    },
    proj_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('Project').findById(v);
                return project !== null;
            },
            message: props => `${props.value} is not a valid project ID`
        }
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        validate: {
            validator: async function (v) {
                const project = await mongoose.model('Service').findById(v);

            },
            message: props => `${props.value} is not a valid service ID`
        }
    },
})

const Proof = mongoose.models.Proof || mongoose.model("Proof", proof_of_need);
export default Proof;