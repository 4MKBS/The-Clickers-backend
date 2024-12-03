import express from "express";
import {
    createCategory,
    createCourse,
    getAllCategories,
    getCategoryById,
    getAllCourses,
    getCourseById,
} from "../controller/course-controller.js";

const router = express.Router();

// Category Routes
router.post("/category", createCategory);
router.get("/categories", getAllCategories); // Get all categories
router.get("/category/:id", getCategoryById); // Get a single category by ID

// Course Routes
router.post("/course", createCourse);
router.get("/courses", getAllCourses); // Get all courses
router.get("/course/:id", getCourseById); // Get a single course by ID

export default router;
