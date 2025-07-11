import Review from '../models/Review';
import { Request, Response } from 'express';

// Lấy tất cả review
export async function getAllReviews(req: Request, res: Response) {
    try {
        const reviews = await Review.find();
        res.json({ reviews });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách review.' });
    }
}

// Lấy review theo ID
export async function getReviewById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        if (!review) {
            res.status(404).json({ message: 'Không tìm thấy review.' });
            return;
        }
        res.json({ review });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy review.' });
    }
}

// Tạo mới review
export async function createReview(req: Request, res: Response) {
    try {
        const review = await Review.create(req.body);
        res.status(201).json({ review });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo review.', error: err });
    }
}

// Cập nhật review
export async function updateReview(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!review) {
            res.status(404).json({ message: 'Không tìm thấy review.' });
            return;
        }
        res.json({ review });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật review.' });
    }
}

// Xóa review
export async function deleteReview(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            res.status(404).json({ message: 'Không tìm thấy review.' });
            return;
        }
        res.json({ message: 'Xóa review thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa review.' });
    }
} 