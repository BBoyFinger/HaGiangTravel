import Blog from '../models/Blog';
import { Request, Response } from 'express';
import slugify from 'slugify';

// Lấy tất cả blog
export async function getAllBlogs(req: Request, res: Response) {
    try {
        const blogs = await Blog.find();
        res.json({ blogs });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách blog.' });
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
        res.status(500).json({ message: 'Lỗi server khi lấy blog.' });
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
        res.status(500).json({ message: 'Lỗi server khi lấy blog.' });
    }
}

// Tạo mới blog
export async function createBlog(req: Request, res: Response) {
    try {
        const { title, ...rest } = req.body;
        const slug = slugify(title, { lower: true, locale: 'vi' });
        const blog = await Blog.create({ title, slug, ...rest });
        res.status(201).json({ blog });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi tạo blog.', error: err });
    }
}

// Cập nhật blog
export async function updateBlog(req: Request, res: Response) {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };
        if (updateData.title) {
            updateData.slug = slugify(updateData.title, { lower: true, locale: 'vi' });
        }
        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!blog) {
            res.status(404).json({ message: 'Không tìm thấy blog.' });
            return
        }
        res.json({ blog });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật blog.' });
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
        res.status(500).json({ message: 'Lỗi server khi xóa blog.' });
    }
} 