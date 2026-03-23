import { Router } from "express";
import CartManager from "../managers/cartManager.js";
import ProductManager from "../managers/productManager.js";
import { TicketModel } from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/:cid/purchase", async (req, res) => {
  try {
    const { cid } = req.params;
    
    // 1. Ejecutamos la lógica de stock y montos en el Manager
    const result = await cartManager.purchaseCart(cid);

    if (!result) {
      return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
    }

    // 2. Si el monto es 0, significa que nada tenía stock
    if (result.amount === 0) {
      return res.status(400).json({ 
        status: "error", 
        message: "No se pudo procesar ningún producto por falta de stock",
        unprocessedProducts: result.unprocessedProducts 
      });
    }

    // 3. Creamos el Ticket en la base de datos
    const ticket = await TicketModel.create({
      code: uuidv4(),
      amount: result.amount,
      purchaser: req.body.email || "cliente@muebles.com",
    });

    // 4. Respondemos con el ticket y los productos que NO se pudieron comprar
    res.json({
      status: "success",
      message: "Compra realizada con éxito",
      ticket,
      unprocessedProducts: result.unprocessedProducts
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito con productos
router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart); // 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Validar producto
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const result = await cartManager.removeProduct(cid, pid);

    if (!result) {
      return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar TODO el carrito
router.put("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartManager.updateCart(
      req.params.cid,
      req.body.products
    );

    if (!updatedCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;

    const result = await cartManager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity
    );

    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado en carrito" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const result = await cartManager.clearCart(req.params.cid);

    if (!result) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;