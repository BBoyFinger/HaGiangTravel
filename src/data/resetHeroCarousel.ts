import mongoose from 'mongoose';
import HeroCarousel from '../models/HeroCarousel';

const MONGODB_URI = process.env.MONGODB_URI as string;

const resetHeroCarousel = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop the collection completely
    try {
      await mongoose.connection.db.collection('herocarousels').drop();
     
    } catch (error) {
      console.log('ℹ️ Collection does not exist or already dropped', error);
    }

    // Create new collection with correct schema
    const slides = [
      {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
        isActive: true
      },
      {
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop",
        isActive: true
      }
    ];

    await HeroCarousel.insertMany(slides);
    console.log('✅ Created new collection with sample data');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    console.log('🎉 HeroCarousel collection reset successfully!');
  } catch (error) {
    console.error('❌ Error resetting HeroCarousel:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  resetHeroCarousel();
}

export default resetHeroCarousel; 