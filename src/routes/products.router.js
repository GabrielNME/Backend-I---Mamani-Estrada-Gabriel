import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();

const validateProduct = (data, isUpdate = false) => {
  const { title, description, code, price, stock, category } = data;

  if (!isUpdate) {
    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      stock === undefined ||
      !category
    ) {
      return "Faltan campos obligatorios";
    }
  }

  if (title && typeof title !== "string") return "El título debe ser un string";
  if (description && typeof description !== "string")
    return "La descripción debe ser un string";
  if (code && typeof code !== "string") return "El código debe ser un string";
  if (price !== undefined && (typeof price !== "number" || price <= 0))
    return "El precio debe ser un número mayor a 0";
  if (stock !== undefined && (typeof stock !== "number" || stock < 0))
    return "El stock debe ser un número válido";
  if (category && typeof category !== "string")
    return "La categoría debe ser un string";

  return null;
};

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit) {
      const parsedLimit = parseInt(limit);

      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res
          .status(400)
          .json({ error: "El limit debe ser un número válido" });
      }

      return res.json(products.slice(0, parsedLimit));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const errorValidation = validateProduct(req.body);
    if (errorValidation) {
      return res.status(400).json({ error: errorValidation });
    }

    const productData = {
      status: true,
      thumbnails: [],
      ...req.body,
    };

    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const errorValidation = validateProduct(req.body, true);
    if (errorValidation) {
      return res.status(400).json({ error: errorValidation });
    }

    const updatedProduct = await productManager.updateProduct(
      req.params.pid,
      req.body,
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(req.params.pid);

    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
