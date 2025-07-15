import User from '../models/User';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

// Lấy tất cả user
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách user.' });
  }
}

// Tạo mới user (admin tạo)
export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, password, role } = req.body;
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
    const user = await User.create({ name, email, passwordHash, role });
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi tạo user.', error: err });
  }
}

// Sửa user (admin sửa)
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(id, { name, email, role, isActive }, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật user.' });
  }
}

// Xóa user
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return;
    }
    res.json({ message: 'Xóa user thành công.' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa user.' });
  }
}

// Đổi vai trò user
export async function changeRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return;
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi đổi vai trò user.' });
  }
}

// Khóa/mở user
export async function toggleActive(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return;
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái user.' });
  }
} 