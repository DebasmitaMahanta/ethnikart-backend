import Product from "../models/Product.js";

// Add Product (Admin only)
export const addProduct = async (req, res) => {

  try {

    const { name, price, category, description } = req.body;

    const imagePaths = req.files.map(file => file.filename);
    const product = await Product.create({
     name,
  price,
  category,
  description,
  stock,
  images: imagePaths
});

    res.status(201).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};


// Get All Products (Public)
export const getProducts = async (req, res) => {

  const products = await Product.find();

  res.json({
    success: true,
    products
  });

};


// Delete Product (Admin only)
export const deleteProduct = async (req, res) => {

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Product deleted"
  });

};
