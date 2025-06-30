import express from "express"
import * as dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";


dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001


//Middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// Kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hagiangtravel';
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error: ", err);
    process.exit(1);
  });

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})