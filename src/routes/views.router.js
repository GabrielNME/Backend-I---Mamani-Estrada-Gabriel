import { Router } from "express";
import ProductManager from "../managers/productManager.js";

const router = Router();
const productManager = new ProductManager();

// Vista Home
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

// Vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

export default router;
