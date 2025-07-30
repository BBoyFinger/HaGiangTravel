import slugify from 'slugify';
import Tour from '../models/Tour';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Lấy tất cả tour
export async function getAllTours(req: Request, res: Response) {
    try {
        const tours = await Tour.find();
        res.json({ tours });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách tour.', error: err });
    }
}

// Lấy tour theo ID
export async function getTourById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let tour;
        if (mongoose.Types.ObjectId.isValid(id)) {
            tour = await Tour.findById(id);
        }
        if (!tour) {
            // Nếu không tìm thấy theo id, thử tìm theo slug
            tour = await Tour.findOne({ slug: id });
        }
        if (!tour) {
            res.status(404).json({ message: 'Không tìm thấy tour.' });
            return;
        }
        res.json({ tour });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy tour.', error: err });
    }
}

// Tạo mới tour
export async function createTour(req: Request, res: Response) {
    try {
        // Parse JSON fields that are sent as strings from frontend
        const parsedBody: any = {};
        Object.keys(req.body).forEach(key => {
            try {
                parsedBody[key] = JSON.parse(req.body[key]);
            } catch {
                parsedBody[key] = req.body[key];
            }
        });

        const { name, ...rest } = parsedBody;
        const slug = slugify(name.vi || name.en, { lower: true, locale: 'vi' });
        const imageUrls = req.files ? (Array.isArray(req.files) ? req.files.map((file: Express.Multer.File) => file.path) : []) : [];
        const tour = await Tour.create({ name, slug, imageUrls, ...rest });
        res.status(201).json({ tour });
    } catch (err: any) {
        res.status(500).json({ message: 'Lỗi server khi tạo tour.', error: err.message });
    }
}

// Cập nhật tour
export async function updateTour(req: Request, res: Response) {
    try {
        const { id } = req.params;

        // Parse JSON fields that are sent as strings from frontend
        const parsedBody: any = {};
        Object.keys(req.body).forEach(key => {
            try {
                parsedBody[key] = JSON.parse(req.body[key]);
            } catch {
                parsedBody[key] = req.body[key];
            }
        });

        const { existingImages, removedImages, ...restData } = parsedBody;
        const updateData = { ...restData };

        if (updateData.name) {
            updateData.slug = slugify(updateData.name.vi || updateData.name.en, { lower: true, locale: 'vi' });
        }

        // Xử lý cập nhật nhiều ảnh
        let newImageUrls: string[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            newImageUrls = req.files.map((file: Express.Multer.File) => file.path);
        }

        // Xử lý existingImages và removedImages
        if (existingImages || removedImages) {
            // Get current tour to access existing imageUrls
            const currentTour = await Tour.findById(id);
            if (currentTour) {
                let finalImageUrls = [...currentTour.imageUrls];
                
                // Remove images that were marked for deletion
                if (removedImages && Array.isArray(removedImages)) {
                    finalImageUrls = finalImageUrls.filter(url => !removedImages.includes(url));
                }
                
                // Add new images
                finalImageUrls = [...finalImageUrls, ...newImageUrls];
                
                updateData.imageUrls = finalImageUrls;
            }
        } else if (newImageUrls.length > 0) {
            // If no existingImages/removedImages handling, just add new images
            updateData.imageUrls = newImageUrls;
        }

        const tour = await Tour.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!tour) {
            res.status(404).json({ message: 'Không tìm thấy tour.' });
            return;
        }
        res.json({ tour });
    } catch (err) {
        res.status(500).json({ message: err });
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
        res.status(500).json({ message: 'Lỗi server khi xóa tour.', error: err });
    }
}