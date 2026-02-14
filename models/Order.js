import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: Number
    }
  ],

  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },

  totalPrice: Number,

  paymentStatus: {
    type: String,
    default: "Pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
