import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    patientName: { 
        type: String, 
        required: [true, "Patient name is required"],
        trim: true 
    },
    bloodGroup: { 
        type: String, 
        required: [true, "Blood group is required"],
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] 
    },
    unitsRequired: { 
        type: Number, 
        required: true,
        default: 1 
    },
    hospitalName: { 
        type: String, 
        required: [true, "Hospital name is required"] 
    },
    city: { 
        type: String, 
        required: true,
        lowercase: true, 
        trim: true
    },
    area: { 
        type: String,
        trim: true
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    isUrgent: { 
        type: Boolean, 
        default: false 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Fulfilled", "Expired"], 
        default: "Pending" 
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, "Hospital location coordinates are required"],
        },
    },

    // 1. INVITATIONS (From Search Page)
    // People who were sent a direct notification but haven't clicked yet
    potentialDonors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],

    // 2. ACTUAL RESPONSES (From Alert Page)
    // People who clicked "I can Donate" (Works for both Global & Search alerts)
    respondedDonors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],

    // The final hero who is officially handling the case
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

requestSchema.index({ location: "2dsphere" });

const Request = mongoose.models.requests || mongoose.model("requests", requestSchema);
export default Request;