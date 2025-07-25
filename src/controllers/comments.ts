import Comment from '../models/Comment';
import { Request, Response } from 'express';

// Lấy tất cả comment, có thể lọc theo status/refType/refId
export async function getAllComments(req: Request, res: Response) {
    try {
        const { status, refType, refId } = req.query;
        const filter: Record<string, unknown> = {};
        if (status) filter.status = status;
        if (refType) filter.refType = refType;
        if (refId) filter.refId = refId;
        const comments = await Comment.find(filter).populate('user');
        res.json({ comments });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách comment.', error: err });
    }
}

// Tạo mới comment (user gửi)
export async function createComment(req: Request, res: Response) {
    try {
        const { user, name, email, content, refId, refType } = req.body;
        const commentData: Record<string, unknown> = { content, refId, refType };
        if (user) commentData.user = user;
        if (name) commentData.name = name;
        if (email) commentData.email = email;
        const comment = await Comment.create(commentData);
        res.status(201).json({ comment });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo comment.', error: err });
    }
}

// Duyệt comment (admin accept)
export async function approveComment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!comment) {
            res.status(404).json({ message: 'Không tìm thấy comment.' });
            return
        }
        res.json({ comment });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi duyệt comment.', error: err });
    }
}

// Từ chối comment (admin reject)
export async function rejectComment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!comment) {
            res.status(404).json({ message: 'Không tìm thấy comment.' });
            return
        }
        res.json({ comment });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi từ chối comment.', error: err });
    }
}

// Xóa comment
export async function deleteComment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            res.status(404).json({ message: 'Không tìm thấy comment.' });
            return
        }
        res.json({ message: 'Xóa comment thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa comment.', error: err });
    }
}

// Sửa nội dung comment (admin chỉnh sửa nếu cần)
export async function updateComment(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });
        if (!comment) {
            res.status(404).json({ message: 'Không tìm thấy comment.' });
            return
        }
        res.json({ comment });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật comment.', error: err });
    }
} 