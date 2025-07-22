import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

type UserForToken = {
  _id: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES = '1d';

const createToken = (user: UserForToken) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
};

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'Email đã được sử dụng.' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = createToken({ _id: user._id.toString(), role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Đăng ký thất bại.', error: err });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }
    const token = createToken({ _id: user._id.toString(), role: user.role });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Đăng nhập thất bại.', error: err });
  }
}

export function logout(req: Request, res: Response): void {
  res.clearCookie('token');
  res.status(200).json({ message: 'Đăng xuất thành công.' });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById((req as AuthRequest).user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server.', error: err });
  }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById((req as AuthRequest).user.id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return;
    }
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ message: 'Mật khẩu cũ không đúng.' });
      return;
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server.', error: err });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const { name, avatarUrl, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      (req as AuthRequest).user.id,
      { name, avatarUrl, phone },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server.', error: err });
  }
}

export default {
  register,
  login,
  logout,
  getMe,
  changePassword,
  updateProfile
};