import express from "express";
import {
    completeProfile,
    createUser,
    loginUser,
} from "../controller/user-controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Route to create a new user
router.post("/user/signup", createUser);
router.post("/user/login", loginUser);

router.patch("/user/update/:id", auth("admin"), completeProfile);

export default router;
