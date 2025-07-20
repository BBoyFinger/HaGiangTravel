import { Request, Response } from 'express';
import HeroCarousel from '../models/HeroCarousel';

// Get all carousel slides
export const getAllCarouselSlides = async (req: Request, res: Response) => {
    try {
        const slides = await HeroCarousel.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ slides });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carousel slides', error });
    }
};

// Get all carousel slides (admin)
export const getAllCarouselSlidesAdmin = async (req: Request, res: Response) => {
    try {
        const slides = await HeroCarousel.find().sort({ createdAt: -1 });
        res.json({ slides });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carousel slides', error });
    }
};

// Get single carousel slide
export const getCarouselSlide = async (req: Request, res: Response) => {
    try {
        const slide = await HeroCarousel.findById(req.params.id);
        if (!slide) {
            res.status(404).json({ message: 'Carousel slide not found' });
            return
        }
        res.json({ slide });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carousel slide', error });
    }
};

// Create new carousel slide
export const createCarouselSlide = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.body.image;
    
    // If file is uploaded, use the uploaded file URL
    if (req.file) {
      imageUrl = req.file.path;
    }
    
    const newSlide = new HeroCarousel({
      image: imageUrl,
      isActive: true
    });

    const savedSlide = await newSlide.save();
    res.status(201).json({ slide: savedSlide });
  } catch (error) {
    res.status(500).json({ message: 'Error creating carousel slide', error });
  }
};

// Update carousel slide
export const updateCarouselSlide = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.body.image;
    
    // If file is uploaded, use the uploaded file URL
    if (req.file) {
      imageUrl = req.file.path;
    }
    
    const updatedSlide = await HeroCarousel.findByIdAndUpdate(
      req.params.id,
      {
        image: imageUrl,
        isActive: req.body.isActive
      },
      { new: true }
    );

    if (!updatedSlide) {
      res.status(404).json({ message: 'Carousel slide not found' });
      return
    }

    res.json({ slide: updatedSlide });
  } catch (error) {
    res.status(500).json({ message: 'Error updating carousel slide', error });
  }
};

// Delete carousel slide
export const deleteCarouselSlide = async (req: Request, res: Response) => {
    try {
        const deletedSlide = await HeroCarousel.findByIdAndDelete(req.params.id);

        if (!deletedSlide) {
            res.status(404).json({ message: 'Carousel slide not found' });
            return
        }

        res.json({ message: 'Carousel slide deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting carousel slide', error });
    }
};

// Update slide order (removed - no longer needed)
export const updateSlideOrder = async (req: Request, res: Response) => {
    try {
        const slides = await HeroCarousel.find().sort({ createdAt: -1 });
        res.json({ slides });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching slides', error });
    }
}; 