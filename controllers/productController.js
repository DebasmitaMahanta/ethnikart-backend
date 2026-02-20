import Product from "../models/Product.js";


// ➕ CREATE PRODUCT (Admin)
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock, variants } = req.body;

    // get uploaded files
    const productImages =
      req.files?.productImages?.map((file) => file.filename) || [];

    const thumbnails =
      req.files?.thumbnails?.map((file) => file.filename) || [];

    // parse variants
    const parsedVariants = variants ? JSON.parse(variants) : [];

    // validation
    if (productImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const product = await Product.create({
      name,
      price,
      category,
      description,
      stock,
      images: productImages,
      thumbnails,
      variants: parsedVariants,
    });

    res.status(201).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 📄 GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔍 GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews.user", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✏️ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // update images if new uploaded
    const productImages =
      req.files?.productImages?.map(file => file.filename) || product.images;

    const thumbnails =
      req.files?.thumbnails?.map(file => file.filename) || product.thumbnails;

    const parsedVariants = req.body.variants
      ? JSON.parse(req.body.variants)
      : product.variants;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: productImages,
        thumbnails,
        variants: parsedVariants,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ❌ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ⭐ ADD REVIEW
export const addReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id, // from auth middleware
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      // update existing review
      product.reviews.forEach(r => {
        if (r.user.toString() === req.user._id.toString()) {
          r.rating = rating;
          r.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // calculate average rating
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};