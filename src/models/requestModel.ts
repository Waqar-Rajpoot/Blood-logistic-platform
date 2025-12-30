// import mongoose from "mongoose";

// const requestSchema = new mongoose.Schema({
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "users", 
//         required: true 
//     },
//     patientName: { type: String, required: true },
//     bloodGroup: { type: String, required: true },
//     unitsRequired: { type: Number, required: true },
//     hospitalName: { type: String, required: true },
//     city: { type: String, required: true },
//     area: {type: String},
//     contactNumber: { type: String, required: true },
//     isUrgent: { type: Boolean, default: false },
//     status: { 
//         type: String, 
//         enum: ["Pending", "Fulfilled", "Expired"], 
//         default: "Pending" 
//     },
//     potentialDonors: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users"
//     }],
//     createdAt: { type: Date, default: Date.now }
// });

// const Request = mongoose.models.requests || mongoose.model("requests", requestSchema);
// export default Request;





// import mongoose from "mongoose";

// const requestSchema = new mongoose.Schema({
//     userId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: "users", 
//         required: true 
//     },
//     patientName: { type: String, required: true },
//     bloodGroup: { type: String, required: true },
//     unitsRequired: { type: Number, required: true },
//     hospitalName: { type: String, required: true },
//     city: { type: String, required: true },
//     area: { type: String },
//     contactNumber: { type: String, required: true },
//     isUrgent: { type: Boolean, default: false },
    
//     // UPDATED: Added status for the donor-on-way phase
//     status: { 
//         type: String, 
//         enum: ["Pending", "Accepted", "Fulfilled", "Expired"], 
//         default: "Pending" 
//     },

//     // NEW: The exact pin location of the hospital/receiver
//     location: {
//         type: {
//             type: String,
//             enum: ["Point"],
//             default: "Point",
//         },
//         coordinates: {
//             type: [Number], // [longitude, latitude]
//             required: true,
//         },
//     },

//     // To track which specific donor accepted the request
//     acceptedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users",
//         default: null
//     },

//     potentialDonors: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "users"
//     }],
//     createdAt: { type: Date, default: Date.now }
// });

// // CRITICAL: Index the location so we can do distance calculations
// requestSchema.index({ location: "2dsphere" });

// const Request = mongoose.models.requests || mongoose.model("requests", requestSchema);
// export default Request;






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
        lowercase: true, // Consistent with userModel for matching
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
    
    // Status management for the donation lifecycle
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Fulfilled", "Expired"], 
        default: "Pending" 
    },

    // GeoJSON Location for the Hospital Pin
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, "Hospital location coordinates are required for distance matching"],
        },
    },

    // The hero donor who accepted the request
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },

    // Log of donors who showed interest
    potentialDonors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// CRITICAL: Ensure 2dsphere index is active for $near and distance queries
requestSchema.index({ location: "2dsphere" });

// Prevent model recompilation errors in Next.js development
const Request = mongoose.models.requests || mongoose.model("requests", requestSchema);

export default Request;