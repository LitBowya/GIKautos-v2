import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const products = await Product.find({ ...keyword });

  res.json({ products });
});

const getAllProducts = asyncHandler(async (req, res) => {
  let query = {};

  // Filter by category
  if (req.query.category) {
    query.category = { $regex: new RegExp(req.query.category, "i") };
  }

  // Apply brand filter if provided
  if (req.query.brand) {
    const brands = req.query.brand.split(",");
    query.brand = { $in: brands };
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = req.query.minPrice;
    }
    if (req.query.maxPrice) {
      query.price.$lte = req.query.maxPrice;
    }
  }

  // Sort criteria
  let sortCriteria = {};
  if (req.query.sort === "rating") {
    sortCriteria = { rating: -1 };
  } else if (req.query.sort === "lowestPrice") {
    sortCriteria = { price: 1 };
  } else if (req.query.sort === "highestPrice") {
    sortCriteria = { price: -1 };
  } else if (req.query.sort === "mostReviewed") {
    sortCriteria = { numReviews: -1 };
  } else if (req.query.sort === "newestIn") {
    sortCriteria = { createdAt: -1 };
  }

  const products = await Product.find(query).sort(sortCriteria);

  if (products.length > 0) {
    res.status(200).json(products);
  } else {
    res.status(404);
    throw new Error("Products not found");
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added successfully" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(6);
  res.status(200).json(products);
});

const getLatestProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(6);
  res.status(200).json(products);
});

const getMostPurchasedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ numReviews: -1 }).limit(6);
  res.status(200).json(products);
});

const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  let query = { category: { $regex: new RegExp(category, "i") } };

  // Apply brand filter if provided
  if (req.query.brand) {
    const brands = req.query.brand.split(",");
    query.brand = { $in: brands };
  }

  // Apply price filter if provided
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) {
      query.price.$gte = req.query.minPrice;
    }
    if (req.query.maxPrice) {
      query.price.$lte = req.query.maxPrice;
    }
  }

  // Apply sorting
  let sortCriteria = { createdAt: -1 }; // Default sorting by createdAt

  if (req.query.sort === "newestIn") {
    sortCriteria = { createdAt: -1 };
  } else if (req.query.sort === "mostReviewed") {
    sortCriteria = { numReviews: -1 };
  } else if (req.query.sort === "rating") {
    sortCriteria = { rating: -1 };
  } else if (req.query.sort === "lowestPrice") {
    sortCriteria = { price: 1 }; // Sort by lowest price
  } else if (req.query.sort === "highestPrice") {
    sortCriteria = { price: -1 }; // Sort by highest price
  }

  const products = await Product.find(query).sort(sortCriteria);

  if (products.length > 0) {
    res.status(200).json(products);
  } else {
    res.status(404);
    throw new Error("Products not found");
  }
});

const getBrands = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const brands = await Product.find({ category }).distinct("brand");
  if (brands) {
    res.status(200).json(brands);
  } else {
    res.status(404);
    throw new Error("Brands not found for this category");
  }
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.find().distinct("category");
  if (categories) {
    res.status(200).json(categories);
  } else {
    res.status(404);
    throw new Error("Categories not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  deleteProduct,
  getTopProducts,
  getLatestProducts,
  getMostPurchasedProducts,
  getProductsByCategory,
  getAllProducts,
  getBrands,
  getCategories,
};
