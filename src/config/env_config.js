import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    // Add other variables as needed
};
