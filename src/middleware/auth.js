import jwt from "jsonwebtoken"; // Import jsonwebtoken directly
import {envConfig} from "../config/env_config.js";
import httpStatus from "http-status-codes";

const auth = (...requiredRoles) => {
    return async (req, res, next) => {
        try {
            // Get the access token from cookies
            const token = req.cookies["accessToken"];

            // Check if the token exists
            if (!token) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    status: httpStatus.UNAUTHORIZED,
                    message: "Access token is required",
                });
            }

            // Verify the access token manually using jsonwebtoken
            const verifiedUser = jwt.verify(
                token,
                envConfig.access_token_secret
            ); // Secret key from config

            // If the token is invalid or expired
            if (!verifiedUser) {
                return res.status(httpStatus.UNAUTHORIZED).json({
                    status: httpStatus.UNAUTHORIZED,
                    message: "You are not authorized",
                });
            }

            req.user = verifiedUser;

            // Check if the user has one of the required roles
            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifiedUser.role)
            ) {
                return res.status(httpStatus.FORBIDDEN).json({
                    status: httpStatus.FORBIDDEN,
                    message:
                        "You do not have permission to access this resource",
                });
            }

            // If everything is fine, proceed to the next middleware
            next();
        } catch (error) {
            // Handle JWT errors like expired or invalid token
            return res.status(httpStatus.UNAUTHORIZED).json({
                status: httpStatus.UNAUTHORIZED,
                message: "Invalid or expired token",
            });
        }
    };
};

export default auth;
