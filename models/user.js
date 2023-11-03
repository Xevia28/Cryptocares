// User Schema : This will be used to store the details of the users.
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minlength: 8,
        select: false
    },
    wallet_addr: {
        type: String,
        unique: true,
        required: [true, "Please provide your wallet address!"],
    },
    role: {
        type: String,
        enum: ["donor", "beneficiary", "provider", "admin"],
        default: "donor"
    },
    is_active: {
        type: Boolean,
        default: true
    },
    photo: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/7/72/Default-welcomer.png"
    },
    // projects: an array of Project objects that the user has created or donated to
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
    // services: an array of Service objects that the user provides or benefits from
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        validate: {
            validator: async function (v) {
                const service = await mongoose.model('Service').findById(v);
                return service !== null;
            },
            message: props => `${props.value} is not a valid service ID`
        }
    }]
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

userSchema.pre("findOneAndUpdate", async function (next) {
    if (!this._update.password) return next(); // If password is not modified, skip hashing
    try {
        const hashedPassword = await bcrypt.hash(this._update.password, 12);
        this._update.password = hashedPassword; // Replace plain password with hashed password
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
userSchema.index({ email: 1 });
userSchema.index({ wallet_addr: 1 });
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
