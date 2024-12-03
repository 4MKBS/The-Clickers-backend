import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {envConfig} from "../config/env_config.js";
import {Profile, User} from "../model/user-model.js";

export const createUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: err.message,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // 1. Check if user exists
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 2. Verify password
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // 3. Generate Access Token and Refresh Token
        const accessToken = jwt.sign(
            {id: existingUser._id, role: existingUser.role},
            envConfig.access_token_secret,
            {expiresIn: "1d"} // Access token valid for 15 minutes
        );

        const refreshToken = jwt.sign(
            {id: existingUser._id},
            envConfig.access_token_secret,
            {expiresIn: "7d"} // Refresh token valid for 7 days
        );

        // 4. Set tokens in HTTP-only cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 1 day
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 5. Respond with success
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred during login",
            error: err.message,
        });
    }
};

export const completeProfile = async (req, res) => {
    try {
        const {id} = req.params; // User ID from route parameter
        const {
            role,
            profile_pic,
            department,
            semester,
            interested_courses,
            introduction,
            education,
            teaching_courses,
        } = req.body;

        // 1. Validate user existence
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // 2. Validate role matches
        if (user.role !== role) {
            return res.status(400).json({
                success: false,
                message: `Invalid role. User role is ${user.role}`,
            });
        }

        // 3. Prepare profile data based on role
        let profileData = {user: id, role, profile_pic};

        if (role === "student") {
            if (!department || !semester || !interested_courses) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields for student profile",
                });
            }
            profileData = {
                ...profileData,
                department,
                semester,
                interested_courses,
            };
        }

        if (role === "teacher") {
            if (!introduction || !education || !teaching_courses) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields for teacher profile",
                });
            }
            profileData = {
                ...profileData,
                introduction,
                education,
                teaching_courses,
            };
        }

        // 4. Check if the profile already exists
        let profile = await Profile.findOne({user: id});
        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                {user: id},
                {...profileData, in_completed: true},
                {new: true}
            );
        } else {
            // Create new profile
            profile = new Profile({...profileData, in_completed: true});
            await profile.save();
        }

        // 5. Respond with success
        res.status(200).json({
            success: true,
            message: "Profile completed successfully",
            data: profile,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to complete profile",
            error: err.message,
        });
    }
};
