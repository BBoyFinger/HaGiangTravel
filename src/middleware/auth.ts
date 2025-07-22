import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response, NextFunction, RequestHandler } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'Tài khoản không tồn tại.' });
      return;
    }

    (req as AuthRequest).user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ.', error: err });
  }
};
