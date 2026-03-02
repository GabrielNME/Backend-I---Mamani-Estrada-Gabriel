import { Router } from "express";
import CartManager from "../managers/cartManager.js";
import ProductManager from "../managers/productManager.js";
import { successResponse, errorResponse } from "../utils/response.js";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

// POST /api/carts
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    return successResponse(res, newCart, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);

    if (!cart) {
      return errorResponse(res, "Carrito no encontrado", 404);
    }

    return successResponse(res, cart.products);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // 1️⃣ Validar carrito
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return errorResponse(res, "Carrito no encontrado", 404);
    }

    // 2️⃣ Validar producto
    const product = await productManager.getProductById(pid);
    if (!product) {
      return errorResponse(res, "Producto no encontrado", 404);
    }

    // 3️⃣ Agregar producto al carrito
    const updatedCart = await cartManager.addProductToCart(cid, pid);

    return successResponse(res, updatedCart);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default router;
