import express from "express";
import cors from "cors";

// import routes from "./app/routes";
import cookieParser from "cookie-parser";

const app = express();

// cors
app.use(cors({origin: "http://localhost:3000/"}));

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
});
// cockie perser
app.use(cookieParser());

// body perser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// use routes
// app.use("/api/v1", routes);

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
