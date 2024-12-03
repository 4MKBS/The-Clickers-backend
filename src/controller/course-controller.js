import httpStatus from "http-status-codes";
import {CourseCategory, Course} from "../model/course-model.js";

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const {title} = req.body;

        // Validate that title is provided
        if (!title) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Title is required for category",
            });
        }

        // Check if category already exists
        const existingCategory = await CourseCategory.findOne({title});
        if (existingCategory) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Category already exists",
            });
        }

        // Create new category
        const newCategory = new CourseCategory({
            title,
        });

        await newCategory.save();

        return res.status(httpStatus.CREATED).json({
            message: "Course category created successfully",
            data: newCategory,
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while creating category",
        });
    }
};

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const {title, description, category, price} = req.body;

        // Validate that required fields are provided
        if (!title || !category) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Title and category are required for course",
            });
        }

        // Check if the category exists
        const existingCategory = await CourseCategory.findById(category);
        if (!existingCategory) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Category not found",
            });
        }

        // Check if the course already exists in this category (to avoid duplicates)
        const existingCourse = await Course.findOne({title, category});
        if (existingCourse) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: "Course already exists in this category",
            });
        }

        // Create a new course
        const newCourse = new Course({
            title,
            description,
            category,
            price,
        });

        await newCourse.save();

        return res.status(httpStatus.CREATED).json({
            message: "Course created successfully",
            data: newCourse,
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while creating course",
        });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await CourseCategory.find();

        return res.status(httpStatus.OK).json({
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while fetching categories",
        });
    }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const {id} = req.params;

        // Find category by ID
        const category = await CourseCategory.findById(id);

        if (!category) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Category not found",
            });
        }

        return res.status(httpStatus.OK).json({
            message: "Category fetched successfully",
            data: category,
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while fetching the category",
        });
    }
};

// Get all courses
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("category", "title");

        return res.status(httpStatus.OK).json({
            message: "Courses fetched successfully",
            data: courses,
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while fetching courses",
        });
    }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
    try {
        const {id} = req.params;

        // Find course by ID and populate category details
        const course = await Course.findById(id).populate("category", "title");

        if (!course) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "Course not found",
            });
        }

        return res.status(httpStatus.OK).json({
            message: "Course fetched successfully",
            data: course,
        });
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while fetching the course",
        });
    }
};
