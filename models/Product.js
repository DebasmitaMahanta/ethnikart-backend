import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  rating: Number,
  comment: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({

  name: { type: String, required: true },

  price: { type: Number, required: true },

  category: {
    type: String,
    enum: ["saree", "kurta", "dress", "baby dress"],
    required: true
  },

  description: String,

  images: [
    {
      type: String
    }
  ],

  stock: {
    type: Number,
    required: true,
    default: 0
  },

  ratings: {
    type: Number,
    default: 0
  },

  numOfReviews: {
    type: Number,
    default: 0
  },

  reviews: [reviewSchema]

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
