import mongoose from "mongoose";

const {Schema, model} = mongoose;

// Define Course Category Schema
const courseCategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
});

// Create the CourseCategory model
const CourseCategory = model("CourseCategory", courseCategorySchema);

// Define Course Schema
const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "CourseCategory", // Reference to the CourseCategory model
        required: true,
    },
    price: {
        type: Number,
    },
});

// Create the Course model
const Course = model("Course", courseSchema);

// Export both models
export {CourseCategory, Course};
