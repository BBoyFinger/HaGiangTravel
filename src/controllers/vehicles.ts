import Vehicle from '../models/Vehicle';
import { Request, Response } from 'express';
import slugify from 'slugify';

// Lấy tất cả vehicle
export async function getAllVehicles(req: Request, res: Response) {
    try {
        const vehicles = await Vehicle.find();
        res.json({ vehicles });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách phương tiện.' });
    }
}

// Lấy vehicle theo ID
export async function getVehicleById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            res.status(404).json({ message: 'Không tìm thấy phương tiện.' });
            return;
        }
        res.json({ vehicle });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy phương tiện.' });
    }
}

// Lấy vehicle theo slug
export async function getVehicleBySlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const vehicle = await Vehicle.findOne({ slug });
        if (!vehicle) {
            res.status(404).json({ message: 'Không tìm thấy phương tiện.' });
            return;
        }
        res.json({ vehicle });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy phương tiện.' });
    }
}

// Tạo mới vehicle
export async function createVehicle(req: Request, res: Response) {
    try {
        const { name, ...rest } = req.body;
        const slug = slugify(name, { lower: true, locale: 'vi' });
        const vehicle = await Vehicle.create({ name, slug, ...rest });
        res.status(201).json({ vehicle });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo phương tiện.', error: err });
    }
}

// Cập nhật vehicle
export async function updateVehicle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };
        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, locale: 'vi' });
        }
        const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!vehicle) {
            res.status(404).json({ message: 'Không tìm thấy phương tiện.' });
            return;
        }
        res.json({ vehicle });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật phương tiện.' });
    }
}

// Xóa vehicle
export async function deleteVehicle(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            res.status(404).json({ message: 'Không tìm thấy phương tiện.' });
            return;
        }
        res.json({ message: 'Xóa phương tiện thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa phương tiện.' });
    }
} 