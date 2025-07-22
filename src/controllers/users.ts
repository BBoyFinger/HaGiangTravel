import User from '../models/User';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

// Lấy tất cả user
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select('-passwordHash');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách user.', error: err });
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
    res.status(500).json({ message: 'Lỗi server khi cập nhật user.', error: err });
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
    res.status(500).json({ message: 'Lỗi server khi xóa user.', error: err });
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
    res.status(500).json({ message: 'Lỗi server khi đổi vai trò user.', error: err });
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
    res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái user.', error: err });
  }
}

// API lấy wishlist tour của user
export async function getWishlist(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('wishlist');
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return
    }
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy wishlist.', error: err });
  }
}

// API thêm tour vào wishlist
export async function addToWishlist(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { tourId } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return
    }
    if (!user.wishlist.some(tid => tid.toString() === tourId)) {
      user.wishlist.push(tourId);
      await user.save();
    }
    const populated = await user.populate('wishlist');
    res.json({ wishlist: populated.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi thêm vào wishlist.', error: err });
  }
}

// API xoá tour khỏi wishlist
export async function removeFromWishlist(req: Request, res: Response) {
  try {
    const { id, tourId } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy user.' });
      return
    }
    user.wishlist = user.wishlist.filter(tid => tid.toString() !== tourId);
    await user.save();
    const populated = await user.populate('wishlist');
    res.json({ wishlist: populated.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xoá khỏi wishlist.', error: err });
  }
}

// Lấy admin đầu tiên
export async function getAdmin(req: Request, res: Response) {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-passwordHash');
    if (!admin) {
      res.status(404).json({ message: 'No admin found' });
      return
    }
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi lấy admin.', error: err });
  }
}

export default {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changeRole,
  toggleActive,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAdmin
}; 