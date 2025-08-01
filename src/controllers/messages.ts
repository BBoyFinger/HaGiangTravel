import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import transporter from '../config/nodemailer';

// Lấy lịch sử chat giữa user và admin
export async function getChatHistory(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            res.status(404).json({ message: 'No admin found' });
            return;
        }
        
        const messages = await Message.find({
            $or: [
                { from: userId, to: admin._id },
                { from: admin._id, to: userId }
            ]
        })
        .populate('from', 'name email avatarUrl')
        .populate('to', 'name email avatarUrl')
        .sort({ createdAt: 1 });
        
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy lịch sử chat', error: err });
    }
}

// Gửi tin nhắn (REST, dùng cho fallback hoặc test)
export async function sendMessage(req: Request, res: Response) {
    try {
        const { from, to, content } = req.body;
        
        // Validate input
        if (!from || !to || !content) {
            res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
            return;
        }
        
        const message = await Message.create({ from, to, content });
        
        // Populate user info
        const populatedMessage = await Message.findById(message._id)
            .populate('from', 'name email avatarUrl')
            .populate('to', 'name email avatarUrl');
        
        // Gửi email thông báo nếu cần
        const recipient = await User.findById(to);
        if (recipient && recipient.email) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: recipient.email,
                    subject: 'Bạn có tin nhắn mới từ HaGiang Travel',
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
            } catch (emailErr) {
                console.log('Email notification failed:', emailErr);
            }
        }
        
        res.status(201).json(populatedMessage);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi gửi tin nhắn', error: err });
    }
}

// Lấy danh sách user đã chat với admin
export async function getChatUsers(req: Request, res: Response) {
    try {
        // Lấy admin
        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            res.status(404).json({ message: 'No admin found' });
            return
        }
        // Lấy tất cả message liên quan admin
        const messages = await Message.find({ $or: [{ from: admin._id }, { to: admin._id }] });
        // Lấy userId unique
        const userIds = Array.from(new Set(messages.map(m => m.from.toString() === admin._id.toString() ? m.to.toString() : m.from.toString())));
        // Lấy thông tin user
        const users = await User.find({ _id: { $in: userIds } }).select('-passwordHash');
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách user chat.', error: err });
    }
}

export default {
    getChatHistory,
    sendMessage,
    getChatUsers
}; 