import Accommodation from '../models/Accommodation';
import { Request, Response } from 'express';
import slugify from 'slugify';

// Lấy tất cả accommodation
export async function getAllAccommodations(req: Request, res: Response) {
    try {
        const accommodations = await Accommodation.find();
        res.json({ accommodations });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách chỗ ở.' });
    }
}

// Lấy accommodation theo ID
export async function getAccommodationById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findById(id);
        if (!accommodation) {
            res.status(404).json({ message: 'Không tìm thấy chỗ ở.' });
            return;
        }
        res.json({ accommodation });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy chỗ ở.' });
    }
}

// Lấy accommodation theo slug
export async function getAccommodationBySlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const accommodation = await Accommodation.findOne({ slug });
        if (!accommodation) {
            res.status(404).json({ message: 'Không tìm thấy chỗ ở.' });
            return;
        }
        res.json({ accommodation });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy chỗ ở.' });
    }
}

// Tạo mới accommodation
export async function createAccommodation(req: Request, res: Response) {
    try {
        const { name, ...rest } = req.body;
        const slug = slugify(name, { lower: true, locale: 'vi' });
        const accommodation = await Accommodation.create({ name, slug, ...rest });
        res.status(201).json({ accommodation });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo chỗ ở.', error: err });
    }
}

// Cập nhật accommodation
export async function updateAccommodation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };
        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, locale: 'vi' });
        }
        const accommodation = await Accommodation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!accommodation) {
            res.status(404).json({ message: 'Không tìm thấy chỗ ở.' });
            return;
        }
        res.json({ accommodation });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật chỗ ở.' });
    }
}

// Xóa accommodation
export async function deleteAccommodation(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const accommodation = await Accommodation.findByIdAndDelete(id);
        if (!accommodation) {
            res.status(404).json({ message: 'Không tìm thấy chỗ ở.' });
            return;
        }
        res.json({ message: 'Xóa chỗ ở thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa chỗ ở.' });
    }
} 