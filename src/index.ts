import express from "express"
import * as dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import tourRouter from "./routes/tours";
import blogRouter from "./routes/blogs";
import accommodationRouter from "./routes/accommodations";
import vehicleRouter from "./routes/vehicles";
import reviewRouter from "./routes/reviews";
import bookingRouter from "./routes/bookings";
import destinationRouter from "./routes/destinations";


dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001


//Middleware
app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}))
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
app.use("/api/tours", tourRouter);
app.use("/api/blog", blogRouter);
app.use("/api/accommodation", accommodationRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/destination", destinationRouter);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})