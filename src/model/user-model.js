import mongoose from "mongoose";

const {Schema, model} = mongoose;

// Define the User Schema
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["admin", "student", "teacher"], // Define valid roles
            default: "user", // Default role
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the User Model
export const User = model("User", userSchema);

// Define Profile Schema
const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "teacher"],
            required: true,
        },
        // Common Fields
        profile_pic: {
            type: String,
            default: "", // You can integrate an upload service later
        },
        // Student-Specific Fields
        department: {
            type: String,
            required: function () {
                return this.role === "student";
            },
        },
        semester: {
            type: String,
            required: function () {
                return this.role === "student";
            },
        },
        interested_courses: {
            type: [String],
            required: function () {
                return this.role === "student";
            },
        },
        // Teacher-Specific Fields
        introduction: {
            type: String,
            required: function () {
                return this.role === "teacher";
            },
        },
        education: {
            type: String,
            required: function () {
                return this.role === "teacher";
            },
        },
        teaching_courses: {
            type: [String],
            required: function () {
                return this.role === "teacher";
            },
        },
        in_completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Create the Profile Model
export const Profile = model("Profile", profileSchema);
