import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const getCartItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const cartItems = [];

  for (const cartItem of user.cartItems) {
    const product = await Product.findById(cartItem.product);

    if (product) {
      cartItems.push({
        _id: cartItem._id,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          countInStock: product.countInStock,
        },
        quantity: cartItem.quantity,
      });
    }
  }

  res.status(200).json(cartItems);
});

const addToCart = asyncHandler(async (req, res) => {
  const { quantity, productId } = req.body;

  if (typeof quantity !== "number" || isNaN(quantity)) {
    return res.status(400).json({
      success: false,
      message: `Invalid Quantity. This is a ${typeof quantity}`,
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  let existingItem = user.cartItems.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    // If the item already exists in the cart, update its quantity with the new quantity
    existingItem.quantity = quantity;
  } else {
    // If the item does not exist in the cart, add it
    user.cartItems.push({ product: productId, quantity });
  }

  await user.save();

  const cartItem = {
    _id: existingItem ? existingItem._id : null,
    product: {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      countInStock: product.countInStock,
    },
    quantity: quantity,
  };

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    cartItem,
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Find the index of the cart item with the given product ID
  const cartIndex = user.cartItems.findIndex(
    (item) => item.product.toString() == productId
  );

  if (cartIndex !== -1) {
    // Remove the item from the cart array
    user.cartItems.splice(cartIndex, 1);
    await user.save();
    res.json({ message: "Item removed from cart", cartItems: user.cartItems });
  } else {
    res.status(404);
    throw new Error("Item not found in cart");
  }
});

const updateCartQuantity = asyncHandler(async (req, res) => {
  const { quantity, productId } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const itemIndex = user.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex !== -1) {
    user.cartItems[itemIndex].quantity = quantity;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Item quantity updated",
      cartItems: user.cartItems,
    });
  } else {
    res.status(404).json({ success: false, message: "Item not found in cart" });
  }
});

const clearCartItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.cartItems = [];
  await user.save();

  res.status(200).json({
    message: "Cart items cleared successfully",
    cartItems: user.cartItems,
  });
});

export {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCartItems,
};
