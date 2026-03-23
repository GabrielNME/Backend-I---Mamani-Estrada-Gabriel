import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import CartManager from "../managers/cartManager.js";
import { adminAuth } from "../middlewares/auth.middleware.js";


const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// CONTRASEÑA ADMIN MODO
router.get("/realtimeproducts", adminAuth, async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render("realTimeProducts", { products });
});


//  LISTA CON PAGINACIÓN
router.get("/products", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;

        limit = parseInt(limit)
        page = parseInt(page)

        const result = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query
        });

        
        res.render("products", {
            payload: result.payload,
            limit: limit,
            totalDocs: result.totalDocs,
            status: result.status,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            limit: limit 
        });
    } catch (error) {
        res.status(500).render("error", { message: "Error al cargar el catálogo" });
    }
});
//  DETALLE PRODUCTO
router.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);

  if (!product) {
    return res.send("Producto no encontrado");
  }

  res.render("productDetail", { product });
});

//  VER CARRITO
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);

  if (!cart) {
    return res.send("Carrito no encontrado");
  }

  res.render("cart", { cart });
});


// VER Y GESTIONAR PRODUCTOS EN TIEMPO REAL
router.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).render("error", { message: "Error al cargar la vista de admin" });
    }
});

export default router;