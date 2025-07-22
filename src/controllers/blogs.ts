import Blog from '../models/Blog';
import { Request, Response } from 'express';
import slugify from 'slugify';

// Lấy tất cả blog
export async function getAllBlogs(req: Request, res: Response) {
    try {
        const blogs = await Blog.find();
        res.json({ blogs });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách blog.', error: err });
    }
}

// Lấy blog theo ID
export async function getBlogById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            res.status(404).json({ message: 'Không tìm thấy blog.' });
            return
        }
        res.json({ blog });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy blog.', error: err });
    }
}

// Lấy blog theo slug
export async function getBlogBySlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug });
        if (!blog) {
            res.status(404).json({ message: 'Không tìm thấy blog.' });
            return
        }
        res.json({ blog });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy blog.', error: err });
    }
}

// Tạo mới blog
export async function createBlog(req: Request, res: Response): Promise<void> {
    try {
        const { title, thumbnail, ...rest } = req.body;
        let slug = '';
        if (title) {
            if (typeof title === 'object' && title.vi) {
                slug = slugify(title.vi, { lower: true, locale: 'vi' });
            } else if (typeof title === 'string') {
                slug = slugify(title, { lower: true, locale: 'vi' });
            }
        }
        const imageUrls = req.files ? (Array.isArray(req.files) ? req.files.map((file: Express.Multer.File) => file.path) : []) : [];
        const blogThumbnail = thumbnail || (imageUrls.length > 0 ? imageUrls[0] : undefined);
        if (!blogThumbnail) {
            res.status(400).json({ message: 'Thiếu ảnh đại diện (thumbnail) cho blog.' });
            return;
        }
        const blog = await Blog.create({ title, slug, thumbnail: blogThumbnail, imageUrls, ...rest });
        res.status(201).json({ blog });
        return;
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo blog.', error: err });
        return;
    }
}

// Cập nhật blog
export async function updateBlog(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.title) {
            if (typeof updateData.title === 'object' && updateData.title.vi) {
                updateData.slug = slugify(updateData.title.vi, { lower: true, locale: 'vi' });
            } else if (typeof updateData.title === 'string') {
                updateData.slug = slugify(updateData.title, { lower: true, locale: 'vi' });
            }
        }
        // Xử lý cập nhật nhiều ảnh
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            updateData.imageUrls = req.files.map((file: Express.Multer.File) => file.path);
            // Nếu không có thumbnail mới, lấy ảnh đầu tiên trong imageUrls mới
            if (!updateData.thumbnail && updateData.imageUrls.length > 0) {
                updateData.thumbnail = updateData.imageUrls[0];
            }
        }
        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!blog) {
            res.status(404).json({ message: 'Không tìm thấy blog.' });
            return;
        }
        res.json({ blog });
        return;
    } catch (err) {
        res.status(500).json({ message: err });
        return;
    }
}

// Xóa blog
export async function deleteBlog(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            res.status(404).json({ message: 'Không tìm thấy blog.' });
            return
        }
        res.json({ message: 'Xóa blog thành công.' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi xóa blog.', error: err });
    }
} 