import mongoose from "mongoose"

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    locations: [{
        type: String,
        required: true,
    }],
    imageUrls: [{
        type: String,
        required: true,
    }],
    price: {
        perSlot: {
            type: Number,
            required: true,
        },
        groupPrice: {
            type: Number,
        },
        currency: {
            type: String,
            required: true,
        }
    },
    duration: {
        type: String,
        required: true,
    },
    guideLanguage: [{
        type: String,
        required: true,
    }],
    includedServices: [{
        type: String,
        required: true,
    }],
    excludedServices: [{
        type: String,
    }],
    schedule: {
        type: String,
    },
    rating: {
        type: Number,
        required: true,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.model("Tour", tourSchema);