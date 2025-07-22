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
import commentRouter from "./routes/comments";
import userRouter from "./routes/users";
import heroCarouselRouter from "./routes/heroCarousel";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import Message from "./models/Message";
import User from "./models/User";
import transporter from "./config/nodemailer";
import { messageRouter } from "./routes/users";


dotenv.config();

const app = express()
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "https://ha-giang-client.vercel.app/",
    credentials: true
  }
});
const PORT = process.env.PORT


//Middleware
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));
app.use(express.json())
app.use(cookieParser())

// Thêm biến toàn cục io để sử dụng ở các file khác nếu cần
app.set("io", io);

// Kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI as string
mongoose.connect(MONGODB_URI)
  .then(() => ("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error: ", err);
    process.exit(1);
  });

app.use("/api/auth", authRouter);
app.use("/api/tours", tourRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/accommodation", accommodationRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/destinations", destinationRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/hero-carousel", heroCarouselRouter);

io.on("connection", (socket) => {
  // Lấy userId từ client khi connect
  console.log("connetion")
  io.on("connection", (socket) => {
    socket.on("send_message", async ({ from, to, content }: { from: string, to: string, content: string }) => {
      console.log("Received send_message", { from, to, content })
      // ...rest of code
    });
  });

  // Gửi tin nhắn
  socket.on("send_message", async ({ from, to, content }) => {
    // Lưu DB
    const message = await Message.create({ from, to, content });
    // Gửi realtime cho người nhận
    io.to(to).emit("receive_message", message);
    // Gửi realtime cho người gửi (nếu cần)
    io.to(from).emit("receive_message", message);
    // Gửi email nếu người nhận là admin hoặc user
    console.log("sebd bè")
    const recipient = await User.findById(to);
    if (recipient && recipient.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipient.email,
        subject: "Bạn có tin nhắn mới",
        text: `Bạn vừa nhận được tin nhắn mới: ${content}`
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})