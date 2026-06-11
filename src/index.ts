import "dotenv/config";
import express from "express";
import cors from "cors";
import todoRouter from "./routes/todo.js";
import subtaskRouter from "./routes/subtasks.js";
import { connectToDatabase } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:5174",
	"https://lollolicense.github.io",
];

app.disable("x-powered-by");

// Middleware
app.use(cors({
	origin: allowedOrigins,})
);
app.use(express.json());


// Routes

app.use("/todos", todoRouter);
app.use("/subtasks", subtaskRouter);
//Health
app.get("/ping", (_request, response) => {
	response.status(200).json({status: "ok"});
});



// Connect to database
connectToDatabase();

// Start the express server
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});