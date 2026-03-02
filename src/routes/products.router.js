import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import { validateProduct } from "../middlewares/products.middleware.js";
import { successResponse, errorResponse } from "../utils/response.js";

const router = Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const parsedLimit = parseInt(limit);

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return errorResponse(res, "El limit debe ser un número válido", 400);
      }

      return successResponse(res, products.slice(0, parsedLimit));
    }

    return successResponse(res, products);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return errorResponse(res, "Producto no encontrado", 404);
    }

    return successResponse(res, product);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// POST /api/products
router.post("/", validateProduct(false), async (req, res) => {
  try {
    const productData = {
      status: true,
      thumbnails: [],
      ...req.body,
    };

    const newProduct = await productManager.addProduct(productData);

    const io = req.app.get("io");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);

    return successResponse(res, newProduct, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// PUT /api/products/:pid
router.put("/:pid", validateProduct(true), async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body,
    );

    if (!updatedProduct) {
      return errorResponse(res, "Producto no encontrado", 404);
    }

    return successResponse(res, updatedProduct);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(req.params.pid);

    if (!deleted) {
      return errorResponse(res, "Producto no encontrado", 404);
    }

    const io = req.app.get("io");
    const products = await productManager.getProducts();
    io.emit("updateProducts", products);

    return successResponse(res, "Producto eliminado correctamente");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

export default router;
