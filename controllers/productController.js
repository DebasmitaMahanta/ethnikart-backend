import Product from "../models/Product.js";



export const addProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock, variants } = req.body;

    // allow images to be passed either via multipart upload (req.files)
    // or via JSON body (e.g., `images: []` / `thumbnails: []`)
    const productImagesFromFiles =
      req.files?.productImages?.map((file) => file.filename) || [];
    const thumbnailsFromFiles =
      req.files?.thumbnails?.map((file) => file.filename) || [];

    const productImages =
      Array.isArray(req.body.images) && req.body.images.length
        ? req.body.images
        : productImagesFromFiles;
    const thumbnails =
      Array.isArray(req.body.thumbnails) && req.body.thumbnails.length
        ? req.body.thumbnails
        : thumbnailsFromFiles;

    // require at least one image + one thumbnail
    if (!productImages.length || !thumbnails.length) {
      return res.status(400).json({
        success: false,
        message: "Product must include at least one image and one thumbnail",
      });
    }

    // parse variants (allow array or JSON string)
    const parsedVariants = variants
      ? typeof variants === "string"
        ? JSON.parse(variants)
        : variants
      : [];

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

// 🏷️ GET CATEGORIES (from enum)
export const getCategories = async (req, res) => {
  try {
    const categoryPath = Product.schema.path("category");
    const categories = Array.isArray(categoryPath?.enumValues)
      ? categoryPath.enumValues
      : [];

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🗂️ GET PRODUCTS BY CATEGORY
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const categoryPath = Product.schema.path("category");
    const allowedCategories = Array.isArray(categoryPath?.enumValues)
      ? categoryPath.enumValues
      : [];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
        allowed: allowedCategories,
      });
    }

    const products = await Product.find({ category }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category,
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