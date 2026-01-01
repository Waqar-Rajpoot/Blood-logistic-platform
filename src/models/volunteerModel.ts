import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Please provide a valid user ID."],
    },
    bloodGroup: {
        type: String,
        required: [true, "Please provide a valid blood group."],
    },
    hbLevel: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["Offered", "Scheduled", "Completed", "Cancelled"],
        default: "Offered",
    },
    preferredDate: {
        type: Date,
        required: [true, "Please provide a valid date."],
    },
    location: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
    },
    donorNote: String,
    adminNote: String,
    token: {
        type: String,
        unique: true,
    }
}, { timestamps: true });


volunteerSchema.index({ location: "2dsphere" });

const Volunteer = mongoose.models.volunteers || mongoose.model("volunteers", volunteerSchema);
export default Volunteer;