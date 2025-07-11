import Destination from '../models/Destination';
import { Request, Response } from 'express';
import slugify from 'slugify';

// Lấy tất cả destination
export async function getAllDestinations(req: Request, res: Response) {
    try {
        const destinations = await Destination.find();
        res.json({ destinations });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách điểm đến.' });
    }
}

// Lấy destination theo ID
export async function getDestinationById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const destination = await Destination.findById(id);
        if (!destination) {
            res.status(404).json({ message: 'Không tìm thấy điểm đến.' });
            return;
        }
        res.json({ destination });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy điểm đến.' });
    }
}

// Lấy destination theo slug
export async function getDestinationBySlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const destination = await Destination.findOne({ slug });
        if (!destination) {
            res.status(404).json({ message: 'Không tìm thấy điểm đến.' });
            return;
        }
        res.json({ destination });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy điểm đến.' });
    }
}

// Tạo mới destination
export async function createDestination(req: Request, res: Response) {
    try {
        const { name, ...rest } = req.body;
        const slug = slugify(name, { lower: true, locale: 'vi' });
        const destination = await Destination.create({ name, slug, ...rest });
        res.status(201).json({ destination });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo điểm đến.', error: err });
    }
}

// Cập nhật destination
export async function updateDestination(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };
        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, locale: 'vi' });
        }
        const destination = await Destination.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!destination) {
            res.status(404).json({ message: 'Không tìm thấy điểm đến.' });
            return;
        }
        res.json({ destination });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật điểm đến.' });
    }
}

// Xóa destination
export async function deleteDestination(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const destination = await Destination.findByIdAndDelete(id);
        if (!destination) {
            res.status(404).json({ message: 'Không tìm thấy điểm đến.' });
            return;
        }
        res.json({ message: 'Xóa điểm đến thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa điểm đến.' });
    }
} 