import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    unitsRequired: { type: Number, required: true },
    hospitalName: { type: String, required: true },
    city: { type: String, required: true },
    area: {type: String},
    contactNumber: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
    status: { 
        type: String, 
        enum: ["Pending", "Fulfilled", "Expired"], 
        default: "Pending" 
    },
    potentialDonors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.models.requests || mongoose.model("requests", requestSchema);
export default Request;