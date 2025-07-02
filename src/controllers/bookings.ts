import Booking from '../models/Booking';
import { Request, Response } from 'express';

// Lấy tất cả booking
export async function getAllBookings(req: Request, res: Response) {
    try {
        const bookings = await Booking.find();
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách booking.' });
    }
}

// Lấy booking theo ID
export async function getBookingById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) {
            res.status(404).json({ message: 'Không tìm thấy booking.' });
            return;
        }
        res.json({ booking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy booking.' });
    }
}

// Tạo mới booking
export async function createBooking(req: Request, res: Response) {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json({ booking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo booking.', error: err });
    }
}

// Cập nhật booking
export async function updateBooking(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!booking) {
            res.status(404).json({ message: 'Không tìm thấy booking.' });
            return;
        }
        res.json({ booking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật booking.' });
    }
}

// Xóa booking
export async function deleteBooking(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
            res.status(404).json({ message: 'Không tìm thấy booking.' });
            return;
        }
        res.json({ message: 'Xóa booking thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa booking.' });
    }
}