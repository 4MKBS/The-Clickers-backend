import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    // Add other variables as needed
};
