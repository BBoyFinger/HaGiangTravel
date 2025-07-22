import Destination from '../models/Destination';
import { Request, Response } from 'express';
import slugify from 'slugify';

// Lấy tất cả destination
export async function getAllDestinations(req: Request, res: Response) {
    try {
        const destinations = await Destination.find();
        res.json({ destinations });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách điểm đến.', error: err });
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
        res.status(500).json({ message: 'Lỗi server khi lấy điểm đến.', error: err });
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
        res.status(500).json({ message: 'Lỗi server khi lấy điểm đến.', error: err });
    }
}

// Tạo mới destination
export async function createDestination(req: Request, res: Response) {
    try {
        const { name, ...rest } = req.body;
        if (!name || !name.vi) {
            res.status(400).json({ message: 'Trường name.vi là bắt buộc.' });
            return
        }
        const slug = slugify(name.vi, { lower: true, locale: 'vi' });
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
        const updateData = { ...req.body };
        // Parse các trường object nếu là string (khi gửi multipart/form-data)
        if (typeof updateData.name === 'string') {
            updateData.name = JSON.parse(updateData.name);
        }
        if (typeof updateData.shortDescription === 'string') {
            updateData.shortDescription = JSON.parse(updateData.shortDescription);
        }
        if (typeof updateData.description === 'string') {
            updateData.description = JSON.parse(updateData.description);
        }
        if (typeof updateData.location === 'string') {
            updateData.location = JSON.parse(updateData.location);
        }
        if (updateData.name && updateData.name.vi) {
            updateData.slug = slugify(updateData.name.vi, { lower: true, locale: 'vi' });
        }
        // Lấy danh sách ảnh cũ muốn giữ lại
        let imagesToKeep: string[] = [];
        if (updateData.imagesToKeep) {
            if (typeof updateData.imagesToKeep === 'string') {
                imagesToKeep = JSON.parse(updateData.imagesToKeep);
            } else if (Array.isArray(updateData.imagesToKeep)) {
                imagesToKeep = updateData.imagesToKeep;
            }
        }
        // Ảnh mới upload
        let newImages: string[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            newImages = req.files.map((file: Express.Multer.File) => file.path);
        }
        // Gộp ảnh giữ lại + ảnh mới
        updateData.images = [...imagesToKeep, ...newImages];

        const destination = await Destination.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!destination) {
            res.status(404).json({ message: 'Không tìm thấy điểm đến.' });
            return;
        }
        res.json({ destination });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật điểm đến.', error: err });
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
        res.status(500).json({ message: 'Lỗi server khi xóa điểm đến.', error: err });
    }
} 