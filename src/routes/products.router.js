import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import { validateProduct } from "../middlewares/products.middleware.js";
import { successResponse, errorResponse } from "../utils/response.js";

const router = Router();
const productManager = new ProductManager();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;


    const result = await productManager.getProducts({
      limit: limit ? parseInt(limit) : 10,
      page: page ? parseInt(page) : 1,
      sort,
      query,
    });


    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    
    return res.json({
      ...result,
      prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit || 10}` : null,
      nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit || 10}` : null,
    });

  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return errorResponse(res, "Producto no encontrado", 404);
    
    return successResponse(res, product);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
});

// POST /api/products
router.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        
        const io = req.app.get("io");
        const allProducts = await productManager.getAllProducts(); 
        io.emit("updateProducts", allProducts);
        
        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await productManager.updateProduct(pid, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        const io = req.app.get("io");
        const allProducts = await productManager.getAllProducts();
        io.emit("updateProducts", allProducts);

        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const deleted = await productManager.deleteProduct(pid);
        
        if (!deleted) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

        const io = req.app.get("io");
        const allProducts = await productManager.getAllProducts(); 
        io.emit("updateProducts", allProducts);

        res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});
export default router;
