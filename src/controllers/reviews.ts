import Review from '../models/Review';
import { Request, Response } from 'express';

// Lấy tất cả review
export async function getAllReviews(req: Request, res: Response) {
    try {
        const { tourId } = req.query;
        const filter: Record<string, unknown> = {};
        if (tourId) filter.tourId = tourId;
        const reviews = await Review.find(filter).populate('userId', 'name email');
        res.json({ reviews });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách review.', error: err });
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
        res.status(500).json({ message: 'Lỗi server khi lấy review.', error: err });
    }
}

// Tạo mới review
export async function createReview(req: Request, res: Response) {
    try {
        const { userId, name, email, tourId, rating, comment } = req.body;
        const reviewData: Record<string, unknown> = { tourId, rating, comment };
        if (userId) reviewData.userId = userId;
        if (name) reviewData.name = name;
        if (email) reviewData.email = email;
        const review = await Review.create(reviewData);
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
        res.status(500).json({ message: 'Lỗi server khi cập nhật review.', error: err });
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
        res.status(500).json({ message: 'Lỗi server khi xóa review.', error: err });
    }
} 