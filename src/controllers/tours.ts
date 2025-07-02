import slugify from 'slugify';
import Tour from '../models/Tour';
import { Request, Response } from 'express';

// Lấy tất cả tour
export async function getAllTours(req: Request, res: Response) {
    try {
        const tours = await Tour.find();
        res.json({ tours });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách tour.' });
    }
}

// Lấy tour theo ID
export async function getTourById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const tour = await Tour.findById(id);
        if (!tour) {
            res.status(404).json({ message: 'Không tìm thấy tour.' });
            return;
        }
        res.json({ tour });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy tour.' });
    }
}

// Tạo mới tour
export async function createTour(req: Request, res: Response) {
    try {
        const { name, ...rest } = req.body;
        const slug = slugify(name, { lower: true, locale: 'vi' });
        const tour = await Tour.create({ name, slug, ...rest });
        res.status(201).json({ tour });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo tour.', error: err });
    }
}

// Cập nhật tour
export async function updateTour(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, locale: 'vi' });
        }

        const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!tour) {
            res.status(404).json({ message: 'Không tìm thấy tour.' });
            return;
        }
        res.json({ tour });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật tour.' });
    }
}

// Xóa tour
export async function deleteTour(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const tour = await Tour.findByIdAndDelete(id);
        if (!tour) {
            res.status(404).json({ message: 'Không tìm thấy tour.' });
            return
        }
        res.json({ message: 'Xóa tour thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa tour.' });
    }
}