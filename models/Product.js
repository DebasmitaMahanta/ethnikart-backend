import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
  },
  { timestamps: true }
);

const variantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["saree", "kurta", "dress", "baby dress"],
      required: true,
    },

    description: {
      type: String,
    },

   
    images: [
      {
        type: String,
        required: true,
      },
    ],

   
    thumbnails: [
      {
        type: String,
      },
    ],

    
    variants: [variantSchema],

   
    stock: {
      type: Number,
      default: 0,
    },

    
    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);