// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, "Please provide a username"],
//     unique: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, "Please provide an email"],
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: [true, "Please provide a password"],
//   },
//   role: {
//     type: String,
//     enum: ["donor", "receiver", "admin"],
//     default: "donor",
//   },
//   bloodGroup: {
//     type: String,
//     // Only required if role is donor
//     enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, "Phone number is required for contact"],
//   },
//   city: {
//     type: String,
//     required: [true, "City is required for location-based search"],
//     lowercase: true, // Stores 'sahiwal' to make searching easier
//     trim: true,
//   },
//   area: {
//     type: String,
//     required: [true, "Area/Neighborhood is required for precise matching"],
//     trim: true,
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },

//   // GeoJSON Location Field
//   location: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       required: true,
//       default: "Point",
//     },
//     coordinates: {
//       type: [Number],
//       required: true,
//       default: [0, 0], // [Longitude, Latitude]
//     },
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// // CRITICAL: Create the geospatial index for the 10km Smart Match
// // We use index() on the schema level.
// userSchema.index({ location: "2dsphere" });

// // Next.js specific model export logic
// const User = mongoose.models.users || mongoose.model("users", userSchema);

// export default User;






import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["donor", "receiver", "admin"],
    default: "donor",
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required for contact"],
  },
  city: {
    type: String,
    required: [true, "City is required for location-based search"],
    lowercase: true,
    trim: true,
  },
  area: {
    type: String,
    required: [true, "Area/Neighborhood is required for precise matching"],
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  points: { 
    type: Number, 
    default: 0 
  },
  donationsCount: { 
    type: Number, 
    default: 0 
  },
  // GeoJSON Location Field
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true,
      validate: {
        validator: function (val: number[]) {
          return val.length === 2;
        },
        message: "Coordinates must be an array of [longitude, latitude]",
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// CRITICAL: Geospatial index for the 10km Smart Match
// This allows MongoDB to run $near and $geoWithin queries
userSchema.index({ location: "2dsphere" });

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
