import express from "express";
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCartItems,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/getcartitems", protect, getCartItems);
router.put("/updatecart", protect, updateCartQuantity);
router.delete("/:id", protect, removeFromCart);
router.post("/addtocart", protect, addToCart);
router.put("/clearcart", protect, clearCartItems);

export default router;
