import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroCarousel extends Document {
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroCarouselSchema = new Schema<IHeroCarousel>({
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IHeroCarousel>('HeroCarousel', HeroCarouselSchema); 