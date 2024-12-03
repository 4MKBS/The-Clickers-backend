import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {StatusCodes} from "http-status-codes";

// routes
import userRoutes from "./routes/user-routes.js";
import courseRoutes from "./routes/course-routes.js";

const app = express();

// cors
app.use(cors({origin: "*"}));

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
});

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", courseRoutes);

app.get("/", (req, res) => {
    res.send(`Server is running at 5000 port`);
});

//handle not found
app.use((req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Url Found",
            },
        ],
    });
    next();
});

export default app;
