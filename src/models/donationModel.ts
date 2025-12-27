import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    requestId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "requests", 
        required: true 
    },
    receiverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    unitsDonated: { type: Number, default: 1 },
    hospitalName: { type: String, required: true },
    donationDate: { type: Date, default: Date.now },
    // Status ensures that the donor gets credit only after verification
    status: { 
        type: String, 
        enum: ["Verified", "Pending"], 
        default: "Pending" 
    }
});

const Donation = mongoose.models.donations || mongoose.model("donations", donationSchema);
export default Donation;