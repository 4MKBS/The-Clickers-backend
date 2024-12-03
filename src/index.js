import mongoose from "mongoose";
import {envConfig} from "./config/env_config.js";

import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
let server;

async function connection() {
    try {
        await mongoose.connect(envConfig.database_url);
        console.log("DB is connected successfully ....!!");

        server = app.listen(envConfig.port, () => {
            console.log(`Application is listening on port ${envConfig.port}`);
        });
    } catch (err) {
        console.log("server errooooooooooorrrrr", err);
    }
}
connection();
