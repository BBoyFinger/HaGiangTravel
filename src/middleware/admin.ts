import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
      return
    }
    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireEditor = requireRole(['admin', 'editor']);
