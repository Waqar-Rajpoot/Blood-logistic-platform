import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8
    },
    // Updated roles based on your proposal: Donor, Receiver, Admin
    role: {
        type: String,
        enum: ["donor", "receiver", "admin"], 
        default: "donor",
    },
    // New Fields for Blood Donation
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: function() { return this.role === 'donor'; } // Required if donor
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required for emergency alerts"],
    },
    city: {
        type: String,
        required: [true, "City is required for location-based search"],
    },
    area: {
        type: String,
        required: [true, "Area/Neighborhood is required for precise matching"],
    },
    // Status tracking
    isAvailable: {
        type: Boolean,
        default: true, // Only relevant for donors
    },
    lastDonationDate: {
        type: Date,
    },
    // Security and Verification
    isVerified: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
},
{
    timestamps: true
})

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;