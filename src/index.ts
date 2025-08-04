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
//Middleware
const allowedOrigins = [
  'https://ha-giang-client.vercel.app',
  'https://hagiang-travel.vercel.app',
  'https://hagiang-travel.netlify.app',
  "http://localhost:5173",
  "http://localhost:3000"
];
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});
const PORT = process.env.PORT





const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials (cookies, etc.)
};

// Apply CORS middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
app.use("/api/bookings", bookingRouter);
app.use("/api/destinations", destinationRouter);
app.use("/api/comments", commentRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/hero-carousel", heroCarouselRouter);

io.on("connection", (socket) => {
  console.log("🔌 New socket connection:", socket.id);

  // Join room khi user connect
  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  // Lưu thông tin user ẩn danh
  socket.on("set_anonymous_info", (info: { name: string, email: string }) => {
    (socket as any).senderName = info.name;
    (socket as any).senderEmail = info.email;
    console.log(`👤 Anonymous user info set: ${info.name} (${info.email})`);
  });

  // Gửi tin nhắn
  socket.on("send_message", async ({ from, to, content, createdAt }) => {
    try {
      console.log("📨 Received message:", { from, to, content, createdAt });
      console.log("👤 Socket sender info:", {
        senderName: (socket as any).senderName,
        senderEmail: (socket as any).senderEmail
      });

      // Lưu vào DB
      const message = await Message.create({
        from,
        to,
        content,
        createdAt: createdAt || new Date(),
        senderName: (socket as any).senderName,
        senderEmail: (socket as any).senderEmail
      });

      // Populate user info (chỉ cho 'to' vì 'from' có thể là anonymous)
      const populatedMessage = await Message.findById(message._id)
        .populate('to', 'name email avatarUrl');

      // Gửi realtime cho tất cả clients (bao gồm cả người gửi)
      io.emit("receive_message", populatedMessage);

      console.log("✅ Message sent successfully");
      console.log("📤 Emitted message to all clients:", populatedMessage);

      // Gửi email notification (optional)
      try {
        const recipient = await User.findById(to);
        if (recipient && recipient.email) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipient.email,
            subject: "Bạn có tin nhắn mới từ HaGiang Travel",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #059669;">💬 Tin nhắn mới từ HaGiang Travel</h2>
                <p>Bạn vừa nhận được tin nhắn mới:</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <p style="margin: 0; color: #374151;">${content}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px;">
                  Đăng nhập vào website để trả lời tin nhắn này.
                </p>
              </div>
            `
          });
        }
      } catch (emailErr) {
        console.log("📧 Email notification failed:", emailErr);
      }

    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  // User online/offline events
  socket.on("user_online", (userId: string) => {
    console.log(`🟢 User ${userId} is online`);
    socket.broadcast.emit("user_online", userId);
  });

  socket.on("user_offline", (userId: string) => {
    console.log(`🔴 User ${userId} is offline`);
    socket.broadcast.emit("user_offline", userId);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})