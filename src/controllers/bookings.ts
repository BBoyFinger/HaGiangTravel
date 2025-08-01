import Booking from '../models/Booking';
import Tour from '../models/Tour';
import { Request, Response } from 'express';

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// Lấy tất cả booking
export async function getAllBookings(req: Request, res: Response): Promise<void> {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email phone')
            .populate('tourId', 'name description imageUrls')
            .populate('guideId', 'name email phone');
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách booking.', error: err });
    }
}

// Lấy booking theo ID
export async function getBookingById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id)
            .populate('userId', 'name email phone')
            .populate('tourId', 'name description imageUrls')
            .populate('guideId', 'name email phone');
        if (!booking) {
            res.status(404).json({ message: 'Không tìm thấy booking.' });
            return;
        }
        res.json({ booking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy booking.', error: err });
    }
}

// Tạo mới booking
export async function createBooking(req: Request, res: Response): Promise<void> {
    try {
        const { tourId, numberOfPeople, travelDate, contactInfo, note } = req.body;

        // Get tour to calculate total price
        const tour = await Tour.findById(tourId);
        if (!tour) {
            res.status(404).json({ message: 'Tour không tồn tại.' });
            return;
        }

        // Calculate total price based on number of people and pricing tiers
        const vndPrice = tour.price?.get('VND');
        if (!vndPrice) {
            res.status(400).json({ message: 'Tour không có thông tin giá VND.' });
            return;
        }

        let totalPrice = 0;
        const { perSlot, groupPrice, discountPrice } = vndPrice;

        // Apply pricing logic:
        // 1. If discount price exists and is lower than other prices, use it
        // 2. If group price exists and number of people >= 2, use group price
        // 3. Otherwise use per slot price
        if (discountPrice && discountPrice > 0) {
            // Use discount price if available
            totalPrice = discountPrice * numberOfPeople;
        } else if (groupPrice && numberOfPeople >= 2) {
            // Use group price for 2+ people
            totalPrice = groupPrice * numberOfPeople;
        } else {
            // Use regular per slot price
            totalPrice = perSlot * numberOfPeople;
        }

        // Get user ID from request (set by auth middleware)
        const userId = (req as AuthRequest).user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Người dùng chưa đăng nhập.' });
            return;
        }

        const bookingData = {
            userId,
            tourId,
            numberOfPeople,
            totalPrice,
            travelDate,
            contactInfo,
            note: note || ''
        };

        const booking = await Booking.create(bookingData);
        res.status(201).json({ booking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo booking.', error: err });
    }
}

// Cập nhật booking
export async function updateBooking(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
            .populate('userId', 'name email phone')
            .populate('tourId', 'name description imageUrls')
            .populate('guideId', 'name email phone');
        if (!booking) {
            res.status(404).json({ message: 'Không tìm thấy booking.' });
            return;
        }
        res.json({ booking });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật booking.', error: err });
    }
}

// Xóa booking
export async function deleteBooking(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
            res.status(404).json({ message: 'Không tìm thấy booking.' });
            return;
        }
        res.json({ message: 'Xóa booking thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa booking.', error: err });
    }
}