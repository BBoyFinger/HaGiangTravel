import express from "express"
import * as dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5001

//Middleware
app.use(cors())
app.use(express.json())

// mongoose.connect(process.env.MONGODB_URI as string).then(() => console.log("Connected to MongoDB")).catch((err) => console.error("MongoDB connection error: ", err))

app.get("/", (req, res) => {
    res.send("Hello from TypeScript + Node.js!")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})